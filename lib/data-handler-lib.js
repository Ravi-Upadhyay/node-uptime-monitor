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
                            callback(errors.writeErrors.couldNotClose);
                        }
                    });
                } else {
                    callback(errors.writeErrors.couldNotWrite);
                }
            });
        } else {
            callback(errors.writeErrors.couldNotOpen);
        }
    });
};

// Possible Errors while writing to the file.
errors.writeErrors = {
    couldNotOpen    : {
        code    : 0001,
        message : 'Could not open file, file might be already exists',
    },
    couldNotWrite   : {
        code    : 0005,
        message : 'Could not write to the file',
    },
    couldNotClose   : {
        code    : 0010,
        message : 'Unable to close the file',
    },
};

module.exports = dataHandler;