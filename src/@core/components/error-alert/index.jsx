/* eslint-disable nonblock-statement-body-position */
import PropTypes from 'prop-types'
import { Alert } from 'reactstrap'

const ErrorAlert = ({ error }) => {
  if (error?.response?.data?.errors?.length > 0)
    return (
      <>
        {error.response.data.errors.map((err, idx) => (
          <Alert color="danger" key={idx}>
            <div className="alert-body">{err}</div>
          </Alert>
        ))}
      </>
    )

  return (
    <Alert color="danger">
      <div className="alert-body">{error.response.data.message ?? 'Something went wrong'}</div>
    </Alert>
  )
}

ErrorAlert.propTypes = {
  error: PropTypes.object
}

export default ErrorAlert
