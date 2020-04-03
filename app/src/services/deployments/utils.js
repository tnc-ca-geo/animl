const moment = require('moment');
const DeploymentModel = require('../../models/deployment');


// Check for deployment date range overlap
async function checkDeploymentConflict(depConfig) {
  const sn = depConfig.camera.serialNumber;
  const currDeps = await DeploymentModel.find({ 'camera.serialNumber': sn });
  if (!currDeps) { return false; }
  let newDep = {
    start: moment(depConfig.start, 'YYYY-MM-DD'),
    end: depConfig.end ? moment(depConfig.end, 'YYYY-MM-DD') : moment()
  };
  return currDeps.some(currDep => {
    currDep.end = currDep.end ? currDep.end : moment();
    let lastStart = newDep.start > currDep.start ? newDep.start: currDep.start;
    let firstEnd = newDep.end < currDep.end ? newDep.end : currDep.end;
    return lastStart <= firstEnd;
  });
};

const createDeploymentRecord = (config) => new DeploymentModel(config);


module.exports = {
  createDeploymentRecord,
  checkDeploymentConflict,
}