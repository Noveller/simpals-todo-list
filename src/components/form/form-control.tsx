import * as React from "react";
import InputField from "./input-field";
import {Simulate} from "react-dom/test-utils";
import {getErrorMessage, messages} from "./error-messages";

export type FormControlProps = {
    name: string,
    label: string,
    type: string,
    $dirty?: boolean,
    valid?: boolean,
    error: { name?: string, message?: string},
    onChange: (event: React.ChangeEvent) => void
}

const FormControl = ({ name, error, $dirty, valid, type, onChange, label, ...args }: FormControlProps) => {

    const controls: {[key: string]: Function} = {
        'text': InputField
    };

    const Field = controls[type];

    const labelClassNames = () => {

        const defaultClasses = ['control-label'];

        if ($dirty && !valid) return [...defaultClasses, 'text-danger'].join(' ');

        return defaultClasses.join(' ');
    };

    return (
        <div className="form-group">
            <label className={labelClassNames()}>{label}</label>
            <Field
                type={type}
                onChange={onChange}
                name={name}
                isError={$dirty && !valid}
                {...args} />
            { $dirty && !valid && ( <div className="invalid-feedback">{error.message}</div>) }
        </div>
    )
};

export default FormControl;