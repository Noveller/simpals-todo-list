type MessageType = (...args: any) => string;

export const messages: { [key: string]: MessageType } = {
    required: () => {
        return 'Укажите обязательное поле'
    },
    between: ({ minlength, maxlength }: { minlength: number, maxlength: number }) => {

      return `Минимальная длина значения должна быть между ${minlength} и ${maxlength}`
    }
};

export const getErrorMessage = (errorName: string, params: any) => {
    const fn = messages[errorName];

    try {
        return fn(params);
    } catch (e) {
        console.log(e);
    }

};