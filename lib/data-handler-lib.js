/*
* LIBRARAY: To handle data for this project, We will be using filesystem to store the data. 
* _________________________________________________________________________________________
* 1. Open and close the files in .data directory
* 2. Write to the files
* _________________________________________________________________________________________
*/

// External/Node/3rdParty Dependencies
const fs = require('fs');
const path = require('path');

// Global declarations
const errors = {};
const dataHandler = {};
dataHandler.baseDataDir = path.join(__dirname, '/../.data/');

// Creating and writing new file. JSON data
dataHandler.create = (dir, file, data, callback) => {
    
    const completePath = `${dataHandler.baseDataDir}${dir}/${file}.json`;
    fs.open(completePath, 'wx', (errorO, fileDescriptor) => {
        if (!errorO && fileDescriptor){
            const stringData = JSON.stringify(data);
            
            fs.writeFile(fileDescriptor, stringData, (errorW) => {
                if(!errorW) {
                    
                    fs.close(fileDescriptor, (errorC) => {
                        if(!errorC) {
                            callback(false);
                        } else {
                            callback(errors.createErrors.couldNotClose);
                        }
                    });
                } else {
                    callback(errors.createErrors.couldNotWrite);
                }
            });
        } else {
            callback(errors.createErrors.couldNotOpen);
        }
    });
};

// Reading existing file
dataHandler.read = (dir, file, callback) => {
    const completePath = `${dataHandler.baseDataDir}${dir}/${file}.json`;
    fs.readFile(completePath, 'utf8', (error, data) => {
        callback(error, data);
    });
};

// Updating existing file.
dataHandler.update = (dir, file, data, callback) => {
    const completePath = `${dataHandler.baseDataDir}${dir}/${file}.json`;
    fs.open(completePath, 'r+', (error, fileDescriptor) => {
        if(!error && fileDescriptor) {
            const stringData = JSON.stringify(data);

            // Truncate the file to delete existing content
            fs.truncate(fileDescriptor, (errorT) => {
                if(!errorT) {
                    fs.writeFile(fileDescriptor, stringData, (errorW) => {
                        if(!errorW) {
                            fs.close(fileDescriptor, (errorC) => {
                                if(!errorC) {
                                    callback(false);
                                } else {
                                    callback(errors.createErrors.couldNotClose);
                                }
                            });
                        } else {
                            callback(errors.createErrors.couldNotWrite);
                        }
                    });
                } else {
                    callback(errors.updateErrors.couldNotTrun);
                }
            });
        } else {
            callback(errors.updateErrors.couldNotOw);
        }
    });
};

// Possible Errors while writing to the file.
errors.createErrors = {
    couldNotOpen    : {
        code    : '0003',
        message : 'Could not open file, file might be already exists',
    },
    couldNotWrite   : {
        code    : '0006',
        message : 'Could not write to the file',
    },
    couldNotClose   : {
        code    : '0009',
        message : 'Unable to close the file',
    },
};

errors.updateErrors = {
    couldNotOw  : {
        code    : '0012',
        message : 'Could not open file to update, it might not exist',
    },
    couldNotTrun: {
        code    : '0015',
        message : 'Could not truncate file'
    },
};

module.exports = dataHandler;