import { yupResolver } from '@hookform/resolvers/yup'
import useJwt from '@src/@core/auth/jwt/useJwt'
import ErrorAlert from '@src/@core/components/error-alert'
import HookFormInput from '@src/@core/components/hook-form/HookFormInput'
import ComponentSpinner from '@src/@core/components/spinner/Loading-spinner'
import { getCommunity, updateCommunity } from '@src/apis'
import { USER_TYPE } from '@src/constants'
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

  const communityQuery = useQuery({
    queryKey: ['communities', params.id],
    queryFn: () => getCommunity(params.id)
  })

  const schema = yup.object({
    name: yup.string().required().label('Name'),
    description: yup.string().nullable().label('Description')
  })

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: communityQuery?.data?.data
  })

  useEffect(() => {
    if (!communityQuery.isLoading && communityQuery.data) {
      if (communityQuery.data) {
        for (const key in communityQuery.data.data) {
          if (Object.hasOwnProperty.call(communityQuery.data.data, key)) {
            const value = communityQuery.data.data[key]
            form.setValue(key, value)
          }
        }
      }
    }
  }, [communityQuery.data, communityQuery.isLoading, form])

  const mutation = useMutation({
    mutationFn: ({ id, body }) => updateCommunity(id, body),
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
    mutation.mutate({ id: params.id, body: data })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Community</CardTitle>
        <Button color="secondary" tag={Link} to="/communities">
          <ArrowLeft size={15} className="me-1" />
          Back
        </Button>
      </CardHeader>
      <CardBody>
        {communityQuery.isPending && <ComponentSpinner />}

        {communityQuery.isError && <ErrorAlert error={communityQuery.error} />}

        {communityQuery.data && (
          <Form className="auth-login-form mt-2" onSubmit={form.handleSubmit(handleSubmit)}>
            {mutation.isError && <ErrorAlert error={mutation.error} />}

            <Row>
              <Col md="6" className="mb-2">
                <HookFormInput name="name" label="Name" placeholder="Enter name" form={form} />
              </Col>
              <Col md="6" className="mb-2">
                <HookFormInput name="description" label="Description" placeholder="Enter description" form={form} />
              </Col>

              <Col sm="12">
                <Button color="primary" disabled={mutation.isPending}>
                  {mutation.isPending && <Spinner size="sm" className="me-1" />}
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </CardBody>
    </Card>
  )
}

export default Edit
