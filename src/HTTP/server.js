'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOSTNAME = 'localhost';
const apiPath = './api/';
const staticPath = './static/';
const apiMethods = new Map();

const cacheFile = (file) => {
  const fileName = path.basename(file, '.js');
  const filePath = apiPath + fileName;
  const cachedFile = require.cache[require.resolve(filePath)];
  if (cachedFile) {
    apiMethods.delete(fileName);
    delete require.cache[require.resolve(filePath)];
  }
  const method = require(filePath);
  apiMethods.set(fileName, method);
};

const cacheFolder = (path) => {
  fs.readdir(path, (err, files) => {
    if (err) console.error(err);
    files.forEach(cacheFile);
  });
};

const watch = (path) => {
  fs.watch(path, (event, fileName) => {
    cacheFile(fileName);
  });
};

cacheFolder(apiPath);
watch(apiPath);

const server = http.createServer((req, res) => {
  const isApiRequest = req.url.includes('/api/');
  if (isApiRequest) {
    const [ tmp, methodKey ] = req.url.split('/').filter((el) => el);
    const method = apiMethods.get(methodKey);
    if (!method) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      let args = Buffer.concat(body).toString();
      if (args.length > 0) {
        args = JSON.parse(args);
      }
      method(...args).then(
        (result) => {
          console.log(`${method.name} call`);
          res.statusCode = 201;
          res.end(result);
        },
        (err) => {
          res.statusCode = 500;
          res.end(err);
        }
      );
    });
  } else {
    const pageFileName = req.url === '/' ? 'index.html' : req.url.substring(1);
    fs.readFile(staticPath + pageFileName, 'utf-8', (err, buffer) => {
      if (err) {
        console.error(err);
        res.statusCode = 404;
        res.end('Not Found');
      }
      res.statusCode = 200;
      res.end(buffer);
    });
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server connected http://${HOSTNAME}:${PORT}`);
});
