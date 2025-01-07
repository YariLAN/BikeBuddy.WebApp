import * as yup from 'yup'

type ValidateSchema = yup.ObjectSchema<any>
type ErrorsState = { [key : string]: string }
type SetErrorsFunction = (prev: ErrorsState) => ErrorsState

export class ValidationService {
    private schema: ValidateSchema

    constructor(schema: ValidateSchema) {
        this.schema = schema;
    }

    async validateField(
        field: string,
        value: string,
        setErrors: (callback: SetErrorsFunction) => void) 
    {
        try {
            await this.schema.validateAt(field, { [field]: value })
            setErrors(prev => ({ ...prev, [field]: '' }))
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                setErrors(prev => ({ ...prev, [field]: error.message }))
            }
            return false;
        }
    }

    async validateForm(data: object) {
        try {
            await this.schema.validate(data, { abortEarly: false })
            return { isValid: true, errors: {} }
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors: ErrorsState = {}
                error.inner.forEach((err) => {
                    if (err.path) {
                        errors[err.path] = err.message
                    }
                })
                return { isValid: false, errors: errors }
            }
            return { isValid: false, errors: {} }
        }
    }
}