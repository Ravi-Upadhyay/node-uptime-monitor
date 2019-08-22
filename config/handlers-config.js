/* 
* CONFIGURATION - HANDLERS
* This file contains all handlers. Different handlers will be called
* based on different PATHS when SERVER will get the reques
* ____________________________________________________________________
* HANDLERS:
* 0. NOTFOUND(../xxx)   - Default Handler, To handle where the path does'nt exist in our
*                         configuration    
* 1. PING (../ping)     - This service is only to check whether this server is live or not
* 2. USER MANAGEMENT    - This service manages users (Add, Get, Update and Delete)
*    (../users)
* ____________________________________________________________________
*/

// Dependencies
const dataValidation = require('../lib/data-validation-lib');
const userService = require('../services/user-management-serv');

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
        userService[data.method](data, callback);
    } else {
        callback(405);
    }
}

//To handle if router path does not exist, 404
handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;