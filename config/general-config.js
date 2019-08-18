/*
* CONFIGURATION: This file contains all configuration settings of the project,
* It handles: 
* ____________________________________________________________________________
* 1.) Environment Configuration
* ____________________________________________________________________________
*/

const environments = {};

// Staging (default) environment
environments.staging = {
    httpPort    : 3000,
    httpsPort   : 3001,
    envName     : 'staging',
};

// Production environment
environments.production = {
    httpPort    : 5000,
    httpsPort   : 5001,
    envName     : 'production',
};


const currentEnvironment = (process.env.NODE_ENV) ? process.env.NODE_ENV.toLowerCase() : '';
const configuration = (environments.hasOwnProperty(currentEnvironment)) ? environments[currentEnvironment] : environments.staging;

module.exports = configuration;