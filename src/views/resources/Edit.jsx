import { yupResolver } from '@hookform/resolvers/yup'
import useJwt from '@src/@core/auth/jwt/useJwt'
import ErrorAlert from '@src/@core/components/error-alert'
import HookFormFileInput from '@src/@core/components/hook-form/HookFormFileInput'
import HookFormInput from '@src/@core/components/hook-form/HookFormInput'
import ComponentSpinner from '@src/@core/components/spinner/Loading-spinner'
import { getResource, updateResource } from '@src/apis'
import { API_URL, USER_TYPE } from '@src/constants'
import { getResponseErrorMessage } from '@src/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ArrowLeft } from 'react-feather'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'reactstrap'
import * as yup from 'yup'

const Edit = () => {
  const { jwt } = useJwt()
  const navigate = useNavigate()
  const params = useParams()
  const queryClient = useQueryClient()

  const user = jwt.getUser()

  const resourceQuery = useQuery({
    queryKey: ['resources', params.id],
    queryFn: () => getResource(params.id)
  })

  const schema = yup.object({
    name: yup.string().required().label('Name'),
    description: yup.string().nullable().label('Description'),
    files: yup.array().of(yup.mixed().required()).nullable().label('Files')
  })

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: resourceQuery?.data?.data
  })

  useEffect(() => {
    if (!resourceQuery.isLoading && resourceQuery.data) {
      if (resourceQuery.data) {
        for (const key in resourceQuery.data.data) {
          if (Object.hasOwnProperty.call(resourceQuery.data.data, key)) {
            const value = resourceQuery.data.data[key]
            if (key === 'files') continue
            form.setValue(key, value)
          }
        }
      }
    }
  }, [resourceQuery.data, resourceQuery.isLoading, form])

  const mutation = useMutation({
    mutationFn: ({ id, body }) => updateResource(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['resources'])
      navigate('/resources')
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
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
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
        <CardTitle>{user.type !== USER_TYPE.USER ? 'Edit Resource' : 'Resource'}</CardTitle>
        <Button color="secondary" tag={Link} to="/resources">
          <ArrowLeft size={15} className="me-1" />
          Back
        </Button>
      </CardHeader>
      <CardBody>
        {resourceQuery.isPending && <ComponentSpinner />}

        {resourceQuery.isError && <ErrorAlert error={resourceQuery.error} />}

        {resourceQuery.data && (
          <Form className="auth-login-form mt-2" onSubmit={form.handleSubmit(handleSubmit)}>
            {mutation.isError && <ErrorAlert error={mutation.error} />}

            <Row>
              <Col md="6" className="mb-2">
                <HookFormInput
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                  form={form}
                  readOnly={user.type === USER_TYPE.USER}
                />
              </Col>
              <Col md="6" className="mb-2">
                <HookFormInput
                  name="description"
                  label="Description"
                  placeholder="Enter description"
                  form={form}
                  readOnly={user.type === USER_TYPE.USER}
                />
              </Col>

              {user.type !== USER_TYPE.USER && (
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
              )}

              <div className="divider">
                <div className="divider-text">{user.type !== USER_TYPE.USER ? 'Existing files' : 'Files'}</div>
              </div>

              <Col md="12">
                {resourceQuery.data.data.files.map((file, idx) => (
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

              {user.type !== USER_TYPE.USER && (
                <Col sm="12">
                  <Button color="primary" disabled={mutation.isPending}>
                    {mutation.isPending && <Spinner size="sm" className="me-1" />}
                    Save
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        )}
      </CardBody>
    </Card>
  )
}

export default Edit
