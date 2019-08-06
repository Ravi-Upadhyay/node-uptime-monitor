/*
* Configuration: This file contains all configuration settings of the project,
* It handles: 
* ____________________________________________________________________________
* 1.) Environment 
* ____________________________________________________________________________
*/

const environments = {};

// Staging (default) environment
environments.staging = {
    port : 3000,
    envName : 'staging',
};

// Production environment
environments.production = {
    port : 5000,
    envName : 'production',
};


const currentEnvironment = (process.env.NODE_ENV) ? process.env.NODE_ENV.toLowerCase() : '';
const configuration = (environments.hasOwnProperty(currentEnvironment)) ? environments[currentEnvironment] : environments.staging;

module.exports = configuration;