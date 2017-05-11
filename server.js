const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostRouter = require('./blogPostRouter');

// Log HTTP layer
app.use(morgan('common'));

// Send all blog-posts requests to the router
app.use('/blog-posts', blogPostRouter);

app.listen(8080, () => {
  console.log('listening on 8080');
});