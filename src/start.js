'use strict';

const log = require('./log')('module.id');
const config = require('./config').get();
const server = require('./server');
const {fetchInitialData} = require('./builder');
const {handleBaseException} = require('./utils');
const {addRoutesForDiscovery} = require('./controller');

const app = server.create();
handleBaseException(app);

fetchInitialData();
addRoutesForDiscovery(app.router.routes);

app.listen({
    port: config.SERVER_PORT
}, function () {
    log.info(`${app.name} listening at ${app.url}`);
});
