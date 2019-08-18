/*
* LIBRARAY: To handle data for this project, We will be using filesystem to store the data. 
* _________________________________________________________________________________________
* 1. Open and close the files in .data directory
* 2. Create and write to the files
* 3. Read the existing files
* 4. Update the existing files
* 5. Delete the existing files
* _________________________________________________________________________________________
*/

// External/Node/3rdParty Dependencies
const fs = require('fs');
const path = require('path');

// Global declarations
let errors = {};
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
                            callback(errors.couldNotClose);
                        }
                    });
                } else {
                    callback(errors.couldNotWrite);
                }
            });
        } else {
            callback(errors.couldNotOpen);
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
                                    callback(errors.couldNotClose);
                                }
                            });
                        } else {
                            callback(errors.couldNotWrite);
                        }
                    });
                } else {
                    callback(errors.couldNotTrun);
                }
            });
        } else {
            callback(errors.couldNotOw);
        }
    });
};

// Delete the existing file.
dataHandler.delete = (dir, file, callback) => {
    const completePath = `${dataHandler.baseDataDir}${dir}/${file}.json`;
    fs.unlink(completePath, (errorD) => {
        if(!errorD) {

        } else {
            callback(errors.couldNotDel);
        }
    });
};

// ERRORS: Errors that might occur during CRUD operations
errors = {
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
    couldNotOw  : {
        code    : '0012',
        message : 'Could not open file to update, it might not exist',
    },
    couldNotTrun: {
        code    : '0015',
        message : 'Could not truncate file'
    },
    couldNotDel : {
        code    : '0018',
        message : 'Could not delete the file'
    }
};

module.exports = dataHandler;