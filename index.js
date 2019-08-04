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
    let payload = '';
    request.on('data', (data) => {
        payload += decoder.write(data);
    });

    /* what next ? Received full payload
    ** request emits one more event called end, which means whole stream has been received
    ** we can move whole further processing inside this */
    request.on('end', () => {
        
        //need to end the payload
        payload += decoder.end();

        const data = {
            trimmedPath,
            method,
            headers,
            queryStringObject,
            payload
        };

        const handler = router.hasOwnProperty(trimmedPath) ? router[trimmedPath] : handlers.notFound;

        handler(data,(stausCode, responsePayload) => {
            statusCode = typeof(stausCode) === 'number' ? stausCode : 200;
            responsePayload = typeof(responsePayload) === 'object' ? responsePayload : {};

            /* Send the response */
            response.writeHead(stausCode);
            response.end(JSON.stringify(responsePayload));
        });

        /* Log the request path */
        console.log(`Request received:  ${JSON.stringify(data)}`);
    });
});

//Listening the server on port 3000
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

//Handlers to handle, based on routing
const handlers = {};

handlers.sample = (data, callback) => {
    callback(200, { authentication: true });
};

//To handle if router path does not exist, 404
handlers.notFound = (data, callback) => {
    callback(404);
};

//Route to map different handlers
const router = {
    sample : handlers.sample,
};