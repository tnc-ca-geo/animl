const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { logger } = require('./logger');
const config = require('./config');
const mongoose = require('mongoose');
const routes = require('./api');
const DeploymentService = require('./services/deployment');
const MLService = require('./services/ml');

let app = express();

if (process.env.NODE_ENV != 'test') {
  mongoose
    .connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((e) => logger.error('database connection error - ', e));
  mongoose.set('useFindAndModify', false);
  mongoose.connection.on('error', (e) => {
    logger.error('database error - ', e);
  });
}

app.use(express.static('../frontend/build'));
app.use(
  morgan('combined', { stream: { write: (message) => logger.info(message) } })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(config.api.prefix, routes());

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send('error');
});

// Create a deployment and model record from config if they don't exist
// TODO: the deployment record is just for testing. remove later
config.deployments.forEach((depConfig) => {
  const deploymentService = new DeploymentService(depConfig);
  deploymentService.saveDeployment();
});
config.models.forEach((modelConfig) => {
  const mlService = new MLService({}, modelConfig.name);
  mlService.saveModel();
});

// Unhandled rejection and uncaught execption fallbacks
process.on('unhandledRejection', (reason, p) => {
  throw reason;
});

process.on('uncaughtException', (e) => {
  logger.error('There was an uncaught error', e);
  process.exit(1);
});

module.exports = app;
