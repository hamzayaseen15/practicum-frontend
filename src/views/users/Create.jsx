/* eslint-disable multiline-ternary */
import { yupResolver } from '@hookform/resolvers/yup'
import useJwt from '@src/@core/auth/jwt/useJwt'
import ErrorAlert from '@src/@core/components/error-alert'
import HookFormInput from '@src/@core/components/hook-form/HookFormInput'
import { createUser, getCommunities } from '@src/apis'
import { USER_TYPE } from '@src/constants'
import { getResponseErrorMessage, getUserTypeLabel } from '@src/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
    email: yup.string().email().required().label('Email'),
    type: yup.string().required().label('Type'),
    password: yup.string().required().label('Password'),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref('password')])
      .required()
      .label('Confirm password'),
    phone: yup.string().nullable().label('Phone'),
    address: yup.string().nullable().label('Address'),
    community: yup
      .string()
      .when('type', {
        is: (value) => value === USER_TYPE.USER,
        then: (s) => s.required(),
        otherwise: (s) => s.nullable()
      })
      .label('Community')
  })

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all'
  })

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      navigate('/users')
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
    const body = { ...data }
    delete body.password_confirmation
    mutation.mutate(body)
  }

  const type = form.watch('type')

  const communitiesQuery = useQuery({
    queryKey: ['communities'],
    queryFn: getCommunities,
    enabled: type === USER_TYPE.USER
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add User</CardTitle>
        <Button color="secondary" tag={Link} to="/users">
          <ArrowLeft size={15} className="me-1" />
          Back
        </Button>
      </CardHeader>
      <CardBody>
        <Form className="auth-login-form mt-2" onSubmit={form.handleSubmit(handleSubmit)}>
          {mutation.isError && <ErrorAlert error={mutation.error} />}
          <Row>
            <Col md="6" className="mb-2">
              <HookFormInput name="name" label="Name" placeholder="Enter name" form={form} />
            </Col>
            <Col md="6" className="mb-2">
              <HookFormInput type="select" name="type" label="Type" form={form}>
                <option value="">Select an option</option>
                {Object.values(USER_TYPE).map((type, idx) => (
                  <option value={type} key={idx}>
                    {getUserTypeLabel(type)}
                  </option>
                ))}
              </HookFormInput>
            </Col>

            <Col md={type === USER_TYPE.USER ? '6' : '12'} className="mb-2">
              <HookFormInput name="email" label="Email" placeholder="Enter email" form={form} />
            </Col>
            {type === USER_TYPE.USER && (
              <Col md="6" className="mb-2">
                {communitiesQuery.isError && <ErrorAlert error={communitiesQuery.error} />}
                <HookFormInput
                  type="select"
                  name="community"
                  label="Community"
                  form={form}
                  disabled={communitiesQuery.isPending}
                >
                  <option value="">Select an option</option>
                  {communitiesQuery.data?.data?.map((community) => (
                    <option value={community._id} key={community._id}>
                      {community.name}
                    </option>
                  ))}
                </HookFormInput>
              </Col>
            )}

            <Col md="6" className="mb-2">
              <HookFormInput type="password" name="password" label="Password" form={form} />
            </Col>
            <Col md="6" className="mb-2">
              <HookFormInput type="password" name="password_confirmation" label="Confirm Password" form={form} />
            </Col>

            <Col md="6" className="mb-2">
              <HookFormInput name="phone" label="Phone" placeholder="Enter phone" form={form} />
            </Col>
            <Col md="6" className="mb-2">
              <HookFormInput name="address" label="Address" placeholder="Enter address" form={form} />
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
