const moment = require('moment');
const DeploymentModel = require('../../models/deployment');


const createDeploymentRecord = (config) => new DeploymentModel(config);

// check for deployment date range overlap
async function checkDeploymentConflict(depConfig) {
  const currDeps = await DeploymentModel.find({ 
    'camera.serialNumber': depConfig.camera.serialNumber,
  });
  if (!currDeps) { return false; }
  let newDep = {
    start: moment(depConfig.start),
    end: depConfig.end ? moment(depConfig.end) : moment()
  };
  return currDeps.some(currDep => {
    currDep.end = currDep.end ? currDep.end : moment();
    let lastStart = newDep.start > currDep.start ? newDep.start: currDep.start;
    let firstEnd = newDep.end < currDep.end ? newDep.end : currDep.end;
    return lastStart <= firstEnd;
  });
};


module.exports = {
  createDeploymentRecord,
  checkDeploymentConflict,
}