/* eslint-disable multiline-ternary */
import { yupResolver } from '@hookform/resolvers/yup'
import useJwt from '@src/@core/auth/jwt/useJwt'
import ErrorAlert from '@src/@core/components/error-alert'
import HookFormInput from '@src/@core/components/hook-form/HookFormInput'
import { createCommunity } from '@src/apis'
import { USER_TYPE } from '@src/constants'
import { getResponseErrorMessage } from '@src/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'react-feather'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'reactstrap'
import * as yup from 'yup'

const Create = () => {
  const { jwt } = useJwt()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const user = jwt.getUser()

  const schema = yup.object({
    name: yup.string().required().label('Name'),
    description: yup.string().nullable().label('Description')
  })

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all'
  })

  const mutation = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries(['communities'])
      navigate('/communities')
    },
    onError: (err) => {
      const message = getResponseErrorMessage(err, 'Something went wrong')
      toast.error(message)
    }
  })

  const handleSubmit = (data) => {
    if (user.type === USER_TYPE.USER) {
      toast.error('You are not allowed to perform this action')
      return
    }
    mutation.mutate(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Community</CardTitle>
        <Button color="secondary" tag={Link} to="/communities">
          <ArrowLeft size={15} className="me-1" />
          Back
        </Button>
      </CardHeader>
      <CardBody>
        <Form className="auth-login-form mt-2" onSubmit={form.handleSubmit(handleSubmit)}>
          {mutation.isError && !mutation.error?.response?.data?.data && <ErrorAlert error={mutation.error} />}

          <Row>
            <Col md="6" className="mb-2">
              <HookFormInput name="name" label="Name" placeholder="Enter name" form={form} />
            </Col>
            <Col md="6" className="mb-2">
              <HookFormInput name="description" label="Description" placeholder="Enter description" form={form} />
            </Col>

            <Col>
              <Button color="primary" disabled={mutation.isPending}>
                {mutation.isPending && <Spinner size="sm" className="me-1" />}
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  )
}

export default Create
