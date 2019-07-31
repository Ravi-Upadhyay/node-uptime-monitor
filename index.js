/*
* Main file for the api
*/

//Dependencies
const http = require('http');

//Setting up the server
const server = http.createServer((request, response) => {
    response.end('Hello World\n');
});

//Listening the server on port 3000
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});