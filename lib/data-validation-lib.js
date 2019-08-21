/*
* LIBRARY: DATA VALIDATION
* This library has functions to validate data fields, It is common practice to validate the fields before
* doing any processing/operation on them. 
*/

const dataValidation = {};

// Validate whether method of request is valid one.
dataValidation.isRequestMehod = (method, acceptableMethods) => {
    return acceptableMethods.includes(method) ? true : false;
};

// Validate whether given field is valid string, Return trimmed string or false
dataValidation.isValidString = (field) => {
    const trimmedField = field.trim();
    return (typeof(trimmedField) === 'string' && trimmedField.length > 0) ? trimmedField : false; 
};

// Validate whether given field is valid phone number, Return trimmed phone number or false
dataValidation.isValidPhone = (field) => {
    const trimmedField = field.trim();
    return (typeof(trimmedField) === 'string' && trimmedField.length === 10) ? trimmedField : false; 
};

//Validate boolean, return true if true or false in all other cases
dataValidation.isBooleanTrue = (field) => {
    return (typeof(field) === 'boolean' && field === true ? true : false);
}

module.exports = dataValidation;