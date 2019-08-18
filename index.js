/*
* Main file for the api
*/

//Dependencies Node/3rd party
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

//Dependencies Local
const config = require('./config');

//Global Declarations
const httpsServerOptions = {
    key : fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
};

//Setting up the http server, Will responsd all the requests 
const httpServer = http.createServer((request, response) => {
    serverProcessor(request, response);
});

//Listening the http server
httpServer.listen(config.httpPort, () => {
    console.log(`Server is listening on port: ${config.httpPort}, environment: ${config.envName}`);
});

//Setting up the https server, Will responsd all the requests 
const httpsServer = https.createServer(httpsServerOptions, (request, response) => {
    serverProcessor(request, response);
});

//Listening the https server
httpsServer.listen(config.httpsPort, () => {
    console.log(`Server is listening on port: ${config.httpsPort}, environment: ${config.envName}`);
});

//Logic to process the requests after initiating the server, Common processing
const serverProcessor = (request, response) => {
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
           response.setHeader('Content-Type', 'application/json');
           response.writeHead(stausCode);
           response.end(JSON.stringify(responsePayload));
       });

       /* Log the request path */
       console.log(`Request received:  ${JSON.stringify(data)}`);
   });    
};

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