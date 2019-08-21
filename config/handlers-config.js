/* 
* CONFIGURATION - HANDLERS
* This file contains all handlers. Different handlers will be called
* based on different PATHS when SERVER will get the reques
* ____________________________________________________________________
* HANDLERS:
* 0. NOTFOUND(../xxx)   - Default Handler, To handle where the path does'nt exist in our
*                         configuration    
* 1. PING (../ping)     - This service is only to check whether this server is live or not
* ____________________________________________________________________
*/

// Dependencies
const dataValidation = require('../lib/data-validation-lib');
const dataHandler = require('../lib/data-handler-lib');
const helpers = require('../lib/general-helpers-lib');

const handlers = {};

handlers.sample = (data, callback) => {
    callback(200, { authentication: true });
};

handlers.ping = (data, callback) => {
    callback(200, data);
};

handlers.users = (data, callback) => {

    // Filtering the methods that will be allowed for this handler
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (dataValidation.isRequestMehod(data.method, acceptableMethods)) {
        _users[data.method](data, callback);
    } else {
        callback(405);
    }
}

//To handle if router path does not exist, 404
handlers.notFound = (data, callback) => {
    callback(404);
};

// _users has handler for users
const _users = {};

// Users POST
// Required Data: firstName, lastName, phone, password, tosAgreenment
// Optional: none
_users.post = (data, callback) => {
    const firstName = dataValidation.isValidString(data.payload.firstName);
    const lastName = dataValidation.isValidString(data.payload.lastName);
    const phone = dataValidation.isValidPhone(data.payload.phone);
    const password = dataValidation.isValidString(data.payload.password);
    const tosAgreement = dataValidation.isBooleanTrue(data.payload.tosAgreement);

    if (firstName && lastName && phone && password && tosAgreement) {
        //Make sure that the user doesn't exists, We will naming files from user phone number
        dataHandler.read('users', phone, (errorR, dataR) => {
            if (errorR) {
                // Before storing data, Hashing the password
                const hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    const user = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        tosAgreement
                    };
                    dataHandler.create('users', phone, user, (errorW) => {
                        if (!errorW) {
                            callback(200);
                        } else {
                            callback(500, { Error: 'Could not create a new user' });
                        }
                    });
                } else {
                    callback(500, { Error: 'Password could not be encrypted' });
                }
            } else {
                callback(400, { Error: 'A user already exists with this phone number' });
            }
        });
    }
    else {
        callback(400, { Error: 'Missing required fields' });
    }
}

module.exports = handlers;