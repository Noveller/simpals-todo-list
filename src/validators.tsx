export const required = (required: Boolean) => {
    return (value: any) => {
        return {
            valid: !!value === required,
            params: { required }
        }
    }
};

export const between = (minlength: number, maxlength: number) => {
    return (value: string) => {
        return {
            valid: value.length >= minlength && value.length <= maxlength,
            params: { minlength, maxlength }
        }
    }
};


