import PropTypes from 'prop-types'
import { useId } from 'react'
import { FormFeedback, Input, Label } from 'reactstrap'
import InputPasswordToggle from '../input-password-toggle'
import { Controller } from 'react-hook-form'

const HookFormInput = ({ children, label, form, name, showError = true, type = 'input', ...rest }) => {
  const id = useId()
  return (
    <>
      {label && (
        <Label className="form-label" for={id}>
          {label}
        </Label>
      )}
      {type !== 'password' && (
        <Controller
          id={id}
          name={name}
          control={form.control}
          defaultValue={''}
          render={({ field }) => (
            <Input type={type} invalid={!!form.formState.errors[name]} {...field} {...rest}>
              {children}
            </Input>
          )}
        />
      )}
      {type === 'password' && (
        <Controller
          id={id}
          name={name}
          control={form.control}
          defaultValue={''}
          render={({ field }) => (
            <InputPasswordToggle className="input-group-merge" invalid={!!form.formState.errors[name]} {...field} />
          )}
        />
      )}
      {showError && form.formState.errors[name] && <FormFeedback>{form.formState.errors[name].message}</FormFeedback>}
    </>
  )
}

HookFormInput.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  form: PropTypes.object.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  showError: PropTypes.bool,
  type: PropTypes.string
}

export default HookFormInput
