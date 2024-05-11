import { yupResolver } from '@hookform/resolvers/yup'
import useJwt from '@src/@core/auth/jwt/useJwt'
import ErrorAlert from '@src/@core/components/error-alert'
import HookFormFileInput from '@src/@core/components/hook-form/HookFormFileInput'
import HookFormInput from '@src/@core/components/hook-form/HookFormInput'
import ComponentSpinner from '@src/@core/components/spinner/Loading-spinner'
import { getSupportTicket, updateSupportTicket } from '@src/apis'
import { API_URL, SUPPORT_TICKET_STATUS, SUPPORT_TICKET_PRIORITY, USER_TYPE } from '@src/constants'
import { getResponseErrorMessage, getSupportTicketStatusLabel, getSupportTicketPriorityLabel } from '@src/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ArrowLeft } from 'react-feather'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'reactstrap'
import * as yup from 'yup'
import Chat from './utils/Chat'

const Edit = () => {
  const { jwt } = useJwt()
  const navigate = useNavigate()
  const params = useParams()
  const queryClient = useQueryClient()

  const user = jwt.getUser()

  const supportTicketQuery = useQuery({
    queryKey: ['support-tickets', params.id],
    queryFn: () => getSupportTicket(params.id)
  })

  const schema = yup.object({
    name: yup.string().required().label('Name'),
    description: yup.string().nullable().label('Description'),
    files: yup.array().of(yup.mixed().required()).nullable().label('Files'),
    status: yup.string().required().label('Status')
  })

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: supportTicketQuery?.data?.data
  })

  useEffect(() => {
    if (!supportTicketQuery.isLoading && supportTicketQuery.data) {
      if (supportTicketQuery.data) {
        for (const key in supportTicketQuery.data.data) {
          if (Object.hasOwnProperty.call(supportTicketQuery.data.data, key)) {
            const value = supportTicketQuery.data.data[key]
            if (key === 'files') continue
            form.setValue(key, value)
          }
        }
      }
    }
  }, [supportTicketQuery.data, supportTicketQuery.isLoading, form])

  const mutation = useMutation({
    mutationFn: ({ id, body }) => updateSupportTicket(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['support-tickets'])
      navigate('/support-tickets')
    },
    onError: (err) => {
      const message = getResponseErrorMessage(err, 'Something went wrong')
      toast.error(message)
    }
  })

  const handleSubmit = (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    if (user.type !== USER_TYPE.USER) formData.append('status', data.status)
    if (user.type !== USER_TYPE.USER) formData.append('priority', data.priority)
    if (data.files?.length > 0) {
      for (let idx = 0; idx < data.files.length; idx++) {
        const file = data.files[idx]
        formData.append('files', file)
      }
    }
    mutation.mutate({ id: params.id, body: formData })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.type !== USER_TYPE.USER ? 'Edit SupportTicket' : 'SupportTicket'}</CardTitle>
        <Button color="secondary" tag={Link} to="/support-tickets">
          <ArrowLeft size={15} className="me-1" />
          Back
        </Button>
      </CardHeader>
      <CardBody>
        {supportTicketQuery.isPending && <ComponentSpinner />}

        {supportTicketQuery.isError && <ErrorAlert error={supportTicketQuery.error} />}

        {supportTicketQuery.data && (
          <>
            <Form className="auth-login-form mt-2" onSubmit={form.handleSubmit(handleSubmit)}>
              {mutation.isError && <ErrorAlert error={mutation.error} />}

              <Row>
                <Col md="6" className="mb-2">
                  <HookFormInput name="name" label="Title" placeholder="Enter title" form={form} />
                </Col>
                <Col md="6">
                  <HookFormInput type="select" name="status" label="Status" form={form}>
                    <option value="">Select an option</option>
                    {Object.values(SUPPORT_TICKET_STATUS).map((status, idx) => (
                      <option value={status} key={idx}>
                        {getSupportTicketStatusLabel(status)}
                      </option>
                    ))}
                  </HookFormInput>
                </Col>
                <Col md="6">
                  <HookFormInput type="select" name="priority" label="Priority" form={form} >
                    <option value="">Select an option</option>
                    {Object.values(SUPPORT_TICKET_PRIORITY).map((priority, idx) => (
                      <option value={priority} key={idx}>
                        {getSupportTicketPriorityLabel(priority)}
                      </option>
                    ))}
                  </HookFormInput>
                </Col>

                <Col md="12" className="mb-2">
                  <HookFormInput
                    type="textarea"
                    name="description"
                    label="Description"
                    placeholder="Enter description"
                    form={form}
                  />
                </Col>

                <Col md="12" className="mb-2">
                  <HookFormFileInput
                    type="file"
                    name="files"
                    label="Files"
                    accept="image/jpeg,image/png,application/pdf"
                    form={form}
                    multiple
                  />
                </Col>

                {supportTicketQuery.data.data.files?.length > 0 && (
                  <div className="divider">
                    <div className="divider-text">{user.type !== USER_TYPE.USER ? 'Existing files' : 'Files'}</div>
                  </div>
                )}

                <Col md="12">
                  {supportTicketQuery.data.data.files.map((file, idx) => (
                    <div key={idx}>
                      <a
                        href={`${API_URL}/files/${file._id}`}
                        target="_blank"
                        className="btn btn-primary m-1 ms-0"
                        rel="noreferrer"
                      >
                        {file.name}
                      </a>
                    </div>
                  ))}
                </Col>

                <Col sm="12">
                  <Button color="primary" disabled={mutation.isPending}>
                    {mutation.isPending && <Spinner size="sm" className="me-1" />}
                    Save
                  </Button>
                </Col>
              </Row>
            </Form>

            <Chat supportTicket={supportTicketQuery.data.data} />
          </>
        )}
      </CardBody>
    </Card>
  )
}

export default Edit
