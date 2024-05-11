/* eslint-disable multiline-ternary */
import { yupResolver } from '@hookform/resolvers/yup'
import useJwt from '@src/@core/auth/jwt/useJwt'
import ErrorAlert from '@src/@core/components/error-alert'
import HookFormInput from '@src/@core/components/hook-form/HookFormInput'
import ComponentSpinner from '@src/@core/components/spinner/Loading-spinner'
import { createSupportTicketMessage, getSupportTicketChat } from '@src/apis'
import { getFileUrl, getResponseErrorMessage } from '@src/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { MessageList } from 'react-chat-elements'
import { Image } from 'react-feather'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Button, Card, CardBody, CardHeader, CardTitle, Form, InputGroup, Spinner } from 'reactstrap'
import * as yup from 'yup'

const Chat = ({ supportTicket }) => {
  const { jwt } = useJwt()
  const queryClient = useQueryClient()
  const attachmentRef = useRef()
  const chatScrollRef = useRef()
  const [scrolledOnce, setScrolledOnce] = useState(false)

  const user = jwt.getUser()

  const schema = yup.object({
    message: yup.string().required().label('Message')
  })

  const form = useForm({
    resolver: yupResolver(schema)
  })

  const chatQuery = useQuery({
    queryKey: ['support-tickets', supportTicket._id, 'chat'],
    queryFn: () => getSupportTicketChat(supportTicket._id),
    refetchInterval: 1000 * 5
  })

  const mutation = useMutation({
    mutationFn: ({ id, body }) => createSupportTicketMessage(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['support-tickets', supportTicket._id, 'chat'])
      setScrolledOnce(false)
      chatScrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER
      form.reset()
    },
    onError: (err) => {
      const message = getResponseErrorMessage(err, 'Something went wrong')
      toast.error(message)
    }
  })

  const handleSubmit = (data) => {
    const formData = new FormData()
    formData.append('message', data.message)
    mutation.mutate({ id: supportTicket._id, body: formData })
  }

  const handleAttachment = (e) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('attachment', file)
      mutation.mutate({ id: supportTicket._id, body: formData })
    }
  }

  useEffect(() => {
    if (chatScrollRef.current && !scrolledOnce) {
      chatScrollRef.current.scrollTop = Number.MAX_SAFE_INTEGER
      setScrolledOnce(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatQuery.data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardBody className="border rounded">
        {chatQuery.isPending && <ComponentSpinner />}
        {chatQuery.isError && <ErrorAlert error={chatQuery.error} />}
        {chatQuery.data && (
          <div style={{ height: '500px' }}>
            <PerfectScrollbar
              containerRef={(ref) => {
                chatScrollRef.current = ref
              }}
            >
              <MessageList
                className="message-list px-1"
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={
                  chatQuery.data.data.length === 0
                    ? [
                        {
                          type: 'system',
                          text: 'No message found'
                        }
                      ]
                    : chatQuery.data.data.map((message) => ({
                        id: message._id,
                        position: message.created_by._id === user._id ? 'right' : 'left',
                        type: message.message ? 'text' : 'photo',
                        title: message.created_by.name,
                        text: message.message,
                        data: { uri: getFileUrl(message.attachment), width: '100%', height: '100%' },
                        date: message.created_at
                      }))
                }
              />
            </PerfectScrollbar>
          </div>
        )}
        <Form className="mt-1" onSubmit={form.handleSubmit(handleSubmit)}>
          {mutation.isError && <ErrorAlert error={mutation.error} />}
          <InputGroup>
            <HookFormInput name="message" placeholder="Enter message" showError={false} form={form} />
            <Button
              type="button"
              color="primary"
              disabled={mutation.isPending}
              onClick={() => attachmentRef.current.click()}
            >
              {mutation.isPending && <Spinner size="sm" className="me-1" />}
              <Image size={15} />
            </Button>
            <input type="file" className="d-none" accept="image/*" onChange={handleAttachment} ref={attachmentRef} />
            <Button type="submit" color="primary" disabled={mutation.isPending}>
              {mutation.isPending && <Spinner size="sm" className="me-1" />}
              Send
            </Button>
          </InputGroup>
        </Form>
      </CardBody>
    </Card>
  )
}

Chat.propTypes = {
  supportTicket: PropTypes.object.isRequired
}

export default Chat
