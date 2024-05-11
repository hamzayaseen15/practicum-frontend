import { yupResolver } from '@hookform/resolvers/yup'
import useJwt from '@src/@core/auth/jwt/useJwt'
import ErrorAlert from '@src/@core/components/error-alert'
import HookFormInput from '@src/@core/components/hook-form/HookFormInput'
import ComponentSpinner from '@src/@core/components/spinner/Loading-spinner'
import { getEvent, updateEvent } from '@src/apis'
import { USER_TYPE } from '@src/constants'
import { getResponseErrorMessage } from '@src/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
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

  const eventQuery = useQuery({
    queryKey: ['events', params.id],
    queryFn: () => getEvent(params.id)
  })

  const schema = yup.object({
    name: yup.string().required().label('Name'),
    description: yup.string().nullable().label('Description'),
    start_date: yup.date().required().label('Start date'),
    end_date: yup.date().min(yup.ref('start_date')).required().label('End date')
  })

  const form = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      ...eventQuery?.data?.data,
      start_date: moment(eventQuery?.data?.data.start_date).format('YYYY-DD-MM'),
      end_date: moment(eventQuery?.data?.data.end_date).format('YYYY-DD-MM')
    }
  })

  useEffect(() => {
    if (!eventQuery.isLoading && eventQuery.data) {
      if (eventQuery.data) {
        for (const key in eventQuery.data.data) {
          if (Object.hasOwnProperty.call(eventQuery.data.data, key)) {
            const value = eventQuery.data.data[key]
            if (['start_date', 'end_date'].includes(key)) {
              form.setValue(key, moment(value).format('YYYY-MM-DD'))
            } else {
              form.setValue(key, value)
            }
          }
        }
      }
    }
  }, [eventQuery.data, eventQuery.isLoading, form])

  const mutation = useMutation({
    mutationFn: ({ id, body }) => updateEvent(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries(['events'])
      navigate('/events')
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
        <CardTitle>Edit Event</CardTitle>
        <Button color="secondary" tag={Link} to="/events">
          <ArrowLeft size={15} className="me-1" />
          Back
        </Button>
      </CardHeader>
      <CardBody>
        {eventQuery.isPending && <ComponentSpinner />}

        {eventQuery.isError && <ErrorAlert error={eventQuery.error} />}

        {eventQuery.data && (
          <Form className="auth-login-form mt-2" onSubmit={form.handleSubmit(handleSubmit)}>
            {mutation.isError && <ErrorAlert error={mutation.error} />}

            <Row>
              <Col md="6" className="mb-2">
                <HookFormInput name="name" label="Name" placeholder="Enter name" form={form} />
              </Col>
              <Col md="6" className="mb-2">
                <HookFormInput name="description" label="Description" placeholder="Enter description" form={form} />
              </Col>

              <Col md="6" className="mb-2">
                <HookFormInput
                  type="date"
                  name="start_date"
                  label="Start Date"
                  placeholder="Enter start date"
                  form={form}
                />
              </Col>
              <Col md="6" className="mb-2">
                <HookFormInput type="date" name="end_date" label="End Date" placeholder="Enter end date" form={form} />
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
