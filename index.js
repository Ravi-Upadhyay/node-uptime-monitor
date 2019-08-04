/*
* Main file for the api
*/

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

//Setting up the server, Will responsd all the requests
const server = http.createServer((request, response) => {

    /* Get the url and parse it, 
    ** true means it will use so me queryString module while parsing */
    const parsedUrl = url.parse(request.url, true);

    /* Get the path */

    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    /* Get the query string object */

    const queryStringObject = parsedUrl.query;

    /* Get the method
    ** We are use lower case/upper case  */
    const method = request.method.toLowerCase();

    /* Get the headers */
    const headers = request.headers;

    /* Get the payload 
    ** we need string decoder to decode payload string properly 
    ** request emits one event called data, we are catching that event, get data out of it and appending it to variable
    ** Because, we might get the payload in form of streams or webstreams */ 
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    request.on('data', (data) => {
        buffer += decoder.write(data);
    });

    /* what next ? Received full payload
    ** request emits one more event called end, which means whole stream has been received
    ** we can move whole further processing inside this */
    request.on('end', () => {
        buffer += decoder.end();
        /* Send the response */
        response.end('Hello World\n');

        /* Log the request path */
        console.log(`Request received on path: ${trimmedPath }, 
        with method ${method},
        with headers ${JSON.stringify(headers)},  
        with queryString ${JSON.stringify(queryStringObject)} 
        with payload  ${buffer}`);
    });
});

//Listening the server on port 3000
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});