'use strict';

const restify = require('restify');
const seppuku = require('seppuku');
const log = require('./log')(module.id);
const baseRouter = require('./router');

exports.create = function create() {
    const server = restify.createServer({
        name: 'woh-api'
    });

    server.use(seppuku(server, {
        trapExceptions: false,
        exitCode: 1
    }));

    server.on('uncaughtException', (req, res, route, err) => {
        log.error(err);
        if (res._header) {
            res.end();
        } else {
            res.send(new restify.ServiceUnavailableError());
        }
    });

    server.pre((req, res, next) => {
        log.debug({req}, 'request');
        next();
    });

    server.pre(restify.pre.sanitizePath());
    server.use(restify.fullResponse());
    server.use(restify.gzipResponse());
    server.use(restify.bodyParser({mapParams: false}));
    server.use(restify.queryParser({mapParams: false}));

    baseRouter.applyRoutes(server, '/v1/calendar');

    return server;
};
