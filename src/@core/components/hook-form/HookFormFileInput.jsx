import PropTypes from 'prop-types'
import { useId } from 'react'
import { FormFeedback, Input, Label } from 'reactstrap'
import { Controller } from 'react-hook-form'

const HookFormFileInput = ({ children, label, form, name, showError = true, ...rest }) => {
  const id = useId()
  return (
    <>
      {label && (
        <Label className="form-label" for={id}>
          {label}
        </Label>
      )}
      <Controller
        id={id}
        name={name}
        control={form.control}
        defaultValue={''}
        render={({ field }) => (
          <Input
            type="file"
            invalid={!!form.formState.errors[name]}
            {...field}
            value={field?.value?.filename}
            onChange={(event) => {
              console.log({ files: Array.from(event.target.files) })
              field.onChange(Array.from(event.target.files))
            }}
            {...rest}
          >
            {children}
          </Input>
        )}
      />
      {showError && form.formState.errors[name] && <FormFeedback>{form.formState.errors[name].message}</FormFeedback>}
    </>
  )
}

HookFormFileInput.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  form: PropTypes.object.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  showError: PropTypes.bool
}

export default HookFormFileInput
