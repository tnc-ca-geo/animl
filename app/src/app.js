const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
const routes = require('./api');
const DeploymentService = require('./services/deployments');
const MLService = require('./services/ml');

let app = express();

mongoose.connect(
  config.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.set('useFindAndModify', false);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static('../frontend/build'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(config.api.prefix, routes());

// Create a deployment and model record from config if they don't exist
// TODO: the deployment record is just for testing. remove later
config.deployments.forEach(depConfig => {
  const deploymentService = new DeploymentService(depConfig);
  deploymentService.saveDeployment();
});
config.models.forEach(modelConfig => {
  const mlService = new MLService({}, modelConfig.name);
  mlService.saveModel();
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
