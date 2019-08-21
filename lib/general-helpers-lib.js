/*
* HELPERS: This will contain helpers that will be used during this project
* ________________________________________________________________________
* 1. Hash - Will be used to hash/mask sensitive data 
* 2. parseStrToJson - parse string to JSON, if not valid JSON forward empty object
*/

//Dependencies Node/3rdparty/External
const crypto = require('crypto');

//Dependencies internal
const dataValidation = require('./data-validation-lib');
const config = require('../config/general-config');

const helpers = {};

// Method to hash/mask/encrypt string
helpers.hash = (plainString) => {
    if(dataValidation.isValidString(plainString)) {
        const hashedString = crypto.createHmac('sha256', config.hashingSecret).update(plainString).digest('hex');
        return hashedString;
    }
    return false;
};

// Method to parse string to json, in case of invalid json, return empty object.
helpers.parseStrToJson = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};

module.exports = helpers;