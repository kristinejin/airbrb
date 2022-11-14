import Ajv from 'ajv';
export const parseJsonFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(JSON.parse(e.target.result));
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};

export const validateJsonFile = (schema, data) => {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        return { isError: true, errorMsg: validate.errors };
    }

    return { isError: false };
};
