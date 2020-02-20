import {default as React, SyntheticEvent, useEffect, useState} from "react";
import FormControl from "./form-control";
import {getErrorMessage} from "./error-messages";

type Field = { type: string, label: string, value?: any, valid?: boolean, $dirty?: boolean };

type Fields = {
    [key: string]: Field
};

type Errors = { [key: string]: { name?: string, message?: string } }

type FormProps = {
    fields: Fields,
    validation: { [key: string]: { [key: string]: any } },
    onSubmit?: (values: { [key: string]: any }) => void
}

const Form = (props: FormProps = {fields: {}, validation: {} }) => {

    const getValidators = (fieldName: string) => props.validation[fieldName] || {};

    const validateValue = (fieldName: string, fieldValue: any): { valid: boolean, validatorName?: string, params?: any } => {
        let validationResult: { valid: boolean, validatorName?: string } = {
            valid: true
        };

        const validatorsEntries = Object.entries(getValidators(fieldName));

        for (let i = 0; i < validatorsEntries.length; i++) {
            const [name, fn] = validatorsEntries[i];

            const result = fn(fieldValue);

            let valid = result.valid;

            if (!valid) {
                validationResult = {
                    ...result,
                    valid,
                    validatorName: name
                };
                break;
            }

        }

        return validationResult;
    };

    const prepareFields = (fields: Fields) => {
        return Object.fromEntries(
            Object.entries(fields)
                .map(([k, v]) => {
                    const validationData = validateValue(k, v.value);
                    return [k, {...v, $dirty: false, valid: validationData.valid}]
                })
        )
    };

    const makeDirty = () => {
      setState(prevState => {
          return Object.fromEntries(
             Object.entries(prevState)
                 .map(([name, field]) => {
                     return [name, { ...field, $dirty: true }]
                 })
         )
      });
    };

    const validate = () => {
        setErrors(Object.fromEntries(
            Object.entries(state).map(([fieldName, fieldConfig]) => {
                const validationData = validateValue(fieldName, fieldConfig.value);

                return [
                    fieldName,
                    {
                        name: validationData.validatorName,
                        message: !validationData.valid ? getErrorMessage(validationData.validatorName, validationData.params) : ''
                    }
                ]
            })
        ));
    };

    const clear = () => {
      setState(prepareFields(props.fields));
    };

    const [state, setState] = useState<Fields>(prepareFields(props.fields));

    const [errors, setErrors] = useState<Errors>({});


    const isInvalid = () => {
      return Object.values(state).map(s => s.valid).some(valid => !valid)
    };

    const getErrors = (fieldName: string) => {
        return errors[fieldName] || null
    };

    const handleFieldChange = (event: React.SyntheticEvent) => {
        const target = event.target as HTMLInputElement;

        const {name, value} = target;

        const validationData = validateValue(name, value);

        setErrors(prevErrors => {
            if (validationData.validatorName) {
                return {...prevErrors,
                    [name]: {
                        name: validationData.validatorName,
                        message: !validationData.valid ? getErrorMessage(validationData.validatorName, validationData.params) : ''
                    }
                };
            }

            return prevErrors;
        });

        setState(prevState => {
            return {
                ...prevState, [name]: {
                    ...prevState[name],
                    value: value,
                    valid: validationData.valid,
                    $dirty: true
                }
            };
        });
    };

    const onSubmit = (event: SyntheticEvent) => {
        event.preventDefault();

        validate();
        makeDirty();

        if (!isInvalid()) {
            props.onSubmit(
                Object.fromEntries(
                    Object.entries(state)
                        .map(([name, params]) => {
                            return [name, params.value]
                        })
                )
            );

            clear();
        }
    };

    const fields = Object.entries(state).map(([fieldName, fieldConfig]) =>
        <FormControl
            key={fieldName}
            name={fieldName}
            error={getErrors(fieldName)}
            onChange={handleFieldChange}
            {...fieldConfig} />);

    return (
        <>
            <form onSubmit={onSubmit}>
                {fields}
                <button className={'btn btn-primary'}>Сохранить</button>
            </form>
        </>
    )
};

export default Form;