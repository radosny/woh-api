'use strict';

const log = require('./log')('module.id');
const config = require('./config').get();
const server = require('./server');
const {handleBaseException} = require('./utils');

const app = server.create();
handleBaseException(app);

// require('./builder');

app.listen({
    port: config.SERVER_PORT
}, function () {
    log.info(`${app.name} listening at ${app.url}`);
});
