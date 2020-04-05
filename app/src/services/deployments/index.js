const moment = require('moment');
const DeploymentModel = require('../../models/deployment');
// const utils = require('./utils');
// const config = require('../../config');

class DeploymentService {
  constructor(config) {
    this.config = config;
  }

  async getDeployment() {
    // TODO
  }

  async saveDeployment() {
    try {
      const conflict = await this.checkDeploymentConflict();
      if (!conflict) {
        const newDeployment = new DeploymentModel(this.config);
        newDeployment.save();
      }
    } catch (e) {
      throw new Error('Error saving model record');
    }
  }

  // check for deployment date range overlap
  async checkDeploymentConflict() {
    const sn = this.config.camera.serialNumber;
    const currDeps = await DeploymentModel.find({ 'camera.serialNumber': sn });
    if (!currDeps) {
      return false;
    }
    let newDep = {
      start: moment(this.config.start, 'YYYY-MM-DD'),
      end: this.config.end ? moment(this.config.end, 'YYYY-MM-DD') : moment(),
    };
    return currDeps.some((currDep) => {
      currDep.end = currDep.end ? currDep.end : moment();
      let lastStart =
        newDep.start > currDep.start ? newDep.start : currDep.start;
      let firstEnd = newDep.end < currDep.end ? newDep.end : currDep.end;
      return lastStart <= firstEnd;
    });
  }
}

module.exports = DeploymentService;
