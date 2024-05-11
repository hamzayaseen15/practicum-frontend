import { yupResolver } from '@hookform/resolvers/yup'
import useJwt from '@src/@core/auth/jwt/useJwt'
import ErrorAlert from '@src/@core/components/error-alert'
import HookFormInput from '@src/@core/components/hook-form/HookFormInput'
import ComponentSpinner from '@src/@core/components/spinner/Loading-spinner'
import { getUser, updateUser } from '@src/apis'
import { USER_TYPE } from '@src/constants'
import { getResponseErrorMessage, getUserTypeLabel } from '@src/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row, Spinner } from 'reactstrap'
import * as yup from 'yup'

const Settings = () => {
  const { jwt } = useJwt()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const user = jwt.getUser()

  const userQuery = useQuery({
    queryKey: ['users', user._id],
    queryFn: () => getUser(user._id)
  })

  const schema = yup.object({
    name: yup.string().required().label('Name'),
    type: yup.string().required().label('Type'),
    email: yup.string().email().required().label('Email'),
    password: yup.string().nullable().label('Password'),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref('password')])
      .when('password', {
        is: (value) => !!value,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.nullable()
      })
      .label('Confirm password'),
    phone: yup.string().nullable().label('Phone'),
    address: yup.string().nullable().label('Address')
  })

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: userQuery?.data?.data
  })

  useEffect(() => {
    if (!userQuery.isLoading && userQuery.data) {
      if (userQuery.data) {
        for (const key in userQuery.data.data) {
          if (Object.hasOwnProperty.call(userQuery.data.data, key)) {
            const value = userQuery.data.data[key]
            form.setValue(key, value)
          }
        }
      }
    }
  }, [userQuery.data, userQuery.isLoading, form])

  const mutation = useMutation({
    mutationFn: ({ id, body }) => updateUser(id, body),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['users'])
      navigate('/home')
      jwt.setUserData(res.data)
    },
    onError: (err) => {
      const message = getResponseErrorMessage(err, 'Something went wrong')
      toast.error(message)
    }
  })

  const handleSubmit = (data) => {
    const body = { ...data }
    delete body.password_confirmation
    if (!body.password) delete body.password

    mutation.mutate({ id: user._id, body })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardBody>
        {userQuery.isPending && <ComponentSpinner />}

        {userQuery.isError && !userQuery.error?.response?.data?.data && <ErrorAlert error={mutation.error} />}

        {userQuery.data && (
          <Form className="auth-login-form mt-2" onSubmit={form.handleSubmit(handleSubmit)}>
            {mutation.isError && !mutation.error?.response?.data?.data && <ErrorAlert error={mutation.error} />}

            <Row>
              <Col md="6" className="mb-2">
                <HookFormInput name="email" label="Email" placeholder="Enter email" form={form} disabled />
              </Col>
              <Col md="6" className="mb-2">
                <HookFormInput type="select" name="type" label="Type" form={form} disabled>
                  <option value="">Select an option</option>
                  {Object.values(USER_TYPE).map((type, idx) => (
                    <option value={type} key={idx}>
                      {getUserTypeLabel(type)}
                    </option>
                  ))}
                </HookFormInput>
              </Col>

              <div className="divider">
                <div className="divider-text">Change Profile</div>
              </div>

              <Col md="12" className="mb-2">
                <HookFormInput name="name" label="Name" placeholder="Enter name" form={form} />
              </Col>

              <Col md="6" className="mb-2">
                <HookFormInput name="phone" label="Phone" placeholder="Enter phone" form={form} />
              </Col>
              <Col md="6" className="mb-2">
                <HookFormInput name="address" label="Address" placeholder="Enter address" form={form} />
              </Col>

              <div className="divider">
                <div className="divider-text">Change Password</div>
              </div>

              <Col md="6" className="mb-2">
                <HookFormInput type="password" name="password" label="Password" form={form} />
              </Col>
              <Col md="6" className="mb-2">
                <HookFormInput type="password" name="password_confirmation" label="Confirm Password" form={form} />
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

export default Settings
