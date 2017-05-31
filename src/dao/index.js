'use strict';

const {RemoteDao} = require('./RemoteDao');
const {LocalDao} = require('./LocalDao');

class Dao {
    constructor(daoInstance) {
        this.daoInstance = daoInstance;
    }
    changeDaoType(daoInstance) {
        this.daoInstance = daoInstance;
    }
    get instance() {
        return this.daoInstance;
    }
}

const localDao = new LocalDao();
const remoteDao = new RemoteDao();
const dao = new Dao(remoteDao);

module.exports = {
    localDao,
    remoteDao,
    dao
};
