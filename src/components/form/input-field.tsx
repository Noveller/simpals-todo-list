import * as React from "react";

export type InputFieldProps = {
    name: string,
    value: any,
    isError: boolean,
    onChange: (event: React.ChangeEvent) => void
}

const InputField = ({ name, value, isError, onChange }: InputFieldProps) => {

    const inputClassNames = () => {
        const defaultClasses = ['form-control'];

        if (isError) return [...defaultClasses, 'is-invalid'].join(' ');

        return defaultClasses.join(' ')
    };

    return (
        <input className={inputClassNames()} value={value}  type="text" name={name} onChange={onChange} />
    )
};

export default InputField;