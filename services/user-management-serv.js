/*
* SERVICE: USER MANAGEMENT,
* This service has all operations to be performed on the user
* ____________________________________________________________
* 1. Add User
* 2. Get User
* 3. Update User
* 4. Delete User
*/

// Dependencies
const dataValidation = require('../lib/data-validation-lib');
const dataHandler = require('../lib/data-handler-lib');
const helpers = require('../lib/general-helpers-lib');
const userService = {};

// Users POST
// Required Data: firstName, lastName, phone, password, tosAgreenment
// Optional: none
userService.post = (data, callback) => {
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

/*
* Required parameter - phone
* Optional parameter - none 
* @TODO: Only authenticated users should be able to see their data, they should not be able to see other's data
*/
userService.get = (data, callback) => {
    const phone = dataValidation.isValidPhone(data.queryStringObject.phone);
    if (phone) {
        dataHandler.read('users', phone, (error, user) => {
            if (!error && user) {
                // Delete hashed password, As we do not want to let user see password
                delete user.hashedPassword;
                callback(200, user);
            } else {
                callback(404);
            }
        });
    } else {
        callback(404, {Error: 'Missing required field'});
    }
};

/*
* Required parameter - phone
* Optional parameter - firstName, lastName, password
* @TODO: Only authenticate users should be able to change their data 
*/
userService.put = (data, callback) => {
    const phone = dataValidation.isValidPhone(data.payload.phone);
    if (phone) {
        const firstName = dataValidation.isValidString(data.payload.firstName);
        const lastName = dataValidation.isValidString(data.payload.lastName);
        const password = dataValidation.isValidString(data.payload.password);

        if (firstName || lastName || password) {
            dataHandler.read('users', phone, (errorR, user) => {
                if (!errorR && user) {
                    user = firstName ? Object.assign(user, { firstName }) : user;
                    user = lastName ? Object.assign(user, { lastName }) : user;
                    user = password ? Object.assign(user, { hashedPassword : helpers.hash(password) }) : user;

                    dataHandler.update('users', phone, user, (errorU) => {
                        if (!errorU) { 
                            callback(200, false);
                        } else { 
                            callback(500, {Error: 'Could not update the user'});
                        }
                    });   
                } else {
                    callback(400, {Error: 'Missing user to update'});
                }
            });
        } else {
            callback(400, {Error: 'Missing required field to update'});
        }

    } else {
        callback(400, {Error: 'Missing required field'});
    }
};

/*
* Required - phone
* @TODO: Only authenticate users should be able to change their data 
* @TODO: When user deletes his data all related files should be deleted
*/
userService.delete = (data, callback) => {
    const phone = dataValidation.isValidPhone(data.queryStringObject.phone);
    if (phone) {
        dataHandler.read('users', phone, (errorR, user) => {
            if (!errorR && user) {
                dataHandler.delete('users', phone, (errorD) => {
                    if (!errorD) {
                        callback(200, false);
                    } else {
                        callback(500, 'Could not delete the user');
                    }
                });
            } else {
                callback(404, {Error: 'Could not find the user'});
            }
        });
    } else {
        callback(404, {Error: 'Missing required field'});
    }
};

module.exports = userService;