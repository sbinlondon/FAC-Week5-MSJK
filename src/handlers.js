const fs = require('fs');
const path = require('path');
const makeRequests = require('./wait-for-data');

const contentType = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

const errorHandler = (status, res, err) => {
  if (status === 404) {
    fs.readFile(path.join(__dirname, '..', 'public', '404.html'), (error404, file404) => {
      if (error404) {
        errorHandler(500, res, err);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(file404);
      }
    });
  } else {
    res.writeHead(status, { 'Content-Type': 'text/plain' });
    res.end('server error');
  }
};

const homeRoute = (req, res) => {
  fs.readFile(
    path.join(__dirname, '..', 'public', 'index.html'),
    (err, file) => {
      if (err) {
        errorHandler(500, res, err);
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(file);
    },
  );
};
let combinedData = [];

const waitForData = (res, data) => {
  combinedData.push(data);
  if (combinedData.length === 2) {
    const returnedObject = {};
    combinedData.forEach((item) => {
      const key = Object.keys(item);
      returnedObject[key] = item[key];
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(returnedObject));
  }
};

const returnEmptySearch = (res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('{}');
};

const resultsRoute = (req, res) => {
  const query = req.url.split('=')[1];
  combinedData = [];
  if (query) {
    makeRequests(res, query, waitForData);
  } else {
    returnEmptySearch(res);
  }
};

const otherRoute = (req, res) => {
  const filename = path.basename(req.url);
  const filetype = path.extname(filename);
  fs.readFile(path.join(__dirname, '..', 'public', filename), (err, file) => {
    if (err) {
      // if path does not correspond to a file in the public folder
      if (err.code === 'ENOENT') {
        errorHandler(404, res, err);
      } else {
        errorHandler(500, res, err);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType[filetype] });
      res.end(file);
    }
  });
};

module.exports = { homeRoute, otherRoute, resultsRoute };
