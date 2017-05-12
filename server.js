const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blogPostRouter');

// Log HTTP layer
app.use(morgan('common'));

// Send all blog-posts requests to the router
app.use('/blog-posts', blogPostRouter);


// Server start stop and listen

let server;

function runServer() {
  const port = process.env.PORT
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Server is listening on ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) runServer().catch(err => console.error(err));

module.exports = {app, runServer, closeServer};