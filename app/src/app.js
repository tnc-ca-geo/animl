const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
const routes = require('./api');
const deploymentUtils = require('./services/deployments/utils');
const mlUtils = require('./services/ml/utils');

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
async function createDeployment(depConfig) {
  const conflict = await deploymentUtils.checkDeploymentConflict(depConfig);
  if (!conflict) {
    const deployment = deploymentUtils.createDeploymentRecord(depConfig);
    deployment.save();
  }
};

async function createMLModel(modelConfig) {
  const currModel = await mlUtils.getModel(modelConfig);
  if (!currModel.length) {
    const model = mlUtils.createModelRecord(modelConfig);
    model.save();
  }
};

config.deployments.forEach(dep => createDeployment(dep));
config.models.forEach(model => createMLModel(model));






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
