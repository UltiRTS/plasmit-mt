const {parentPort} = require('node:worker_threads');
const {DataManager} = require('../db/dataManager');
const {dbConfig}= require('../config');

const knexConf = dbConfig[dbConfig.useDB];

const dbm = new DataManager(knexConf);

parentPort.on('message', (msg) => {

});
