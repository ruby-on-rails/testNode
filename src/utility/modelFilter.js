function filterModel(model, requiredFields) {
    const missingFields = requiredFields.filter(field => 
        !Object.prototype.hasOwnProperty.call(model, field) || model[field] === ''
    );

    if (missingFields.length > 0) {
        const errorMessages = missingFields.map(field => `${field} is required`);
        return {
            isValid: false,
            errorMessages
        };
    }

    return { isValid: true };
}

export default filterModel;
