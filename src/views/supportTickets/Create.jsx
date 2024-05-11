import { yupResolver } from '@hookform/resolvers/yup'
import ErrorAlert from '@src/@core/components/error-alert'
import HookFormFileInput from '@src/@core/components/hook-form/HookFormFileInput'
import HookFormInput from '@src/@core/components/hook-form/HookFormInput'
import { createSupportTicket } from '@src/apis'
import { getResponseErrorMessage } from '@src/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'react-feather'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'reactstrap'
import * as yup from 'yup'

const Create = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const schema = yup.object({
    name: yup.string().required().label('Name'),
    description: yup.string().nullable().label('Description'),
    files: yup.array().of(yup.mixed().required()).nullable().label('Files')
  })

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all'
  })

  const mutation = useMutation({
    mutationFn: createSupportTicket,
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
    for (let idx = 0; idx < data.files?.length; idx++) {
      const file = data.files[idx]
      formData.append('files', file)
    }

    mutation.mutate(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add SupportTicket</CardTitle>
        <Button color="secondary" tag={Link} to="/support-tickets">
          <ArrowLeft size={15} className="me-1" />
          Back
        </Button>
      </CardHeader>
      <CardBody>
        <Form className="auth-login-form mt-2" onSubmit={form.handleSubmit(handleSubmit)}>
          {mutation.isError && !mutation.error?.response?.data?.data && <ErrorAlert error={mutation.error} />}
          <Row>
            <Col md="6" className="mb-2">
              <HookFormInput name="name" label="Title" placeholder="Enter title" form={form} />
            </Col>
            <Col md="6" className="mb-2">
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
