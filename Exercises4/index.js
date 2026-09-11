const http = require('http');
const path = require('path');
const { readFile } = require('./file');

const hostname = 'localhost';
const port = 8082;

const server = http.createServer((request, response) => {
  console.log(request.headers);

  if (request.method === 'GET') {
    let fileUrl;
    if (request.url === '/') {
      fileUrl = '/index.html';
    } else {
      fileUrl = request.url;
    }

    const filePath = path.resolve('./public' + fileUrl);
    const fileExt = path.extname(filePath);

    if (fileExt === '.html') {
      readFile(filePath)
        .then((data) => {
          response.setHeader('Content-Type', 'text/html');
          response.statusCode = 200;
          console.log('file: ' + data);
          response.end(data);
        })
        .catch((err) => {
          console.error('Error reading file:', err);
          response.statusCode = 500;
          response.setHeader('Content-Type', 'text/html');
          response.end('<h1>Error 500: Internal Server Error</h1>');
        });
    } else {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/html');
      response.end(`<html><body><h1>Error 404: ${fileUrl} is not an HTML file</h1></body></html>`);
    }
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html');
    response.end(`<html><body><h1>Error 404: ${request.method} not supported</h1></body></html>`);
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});