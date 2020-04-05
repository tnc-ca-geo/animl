const express = require('express');
const imageRouter = require('./routes/image');

const routes = () => {
  const app = express.Router();
  imageRouter(app);

  return app;
};

module.exports = routes;
