'use strict';

const restify = require('restify');
const helmet = require('helmet');
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

    server.pre(({body, url}, res, next) => {
        log.debug('request:', url, body);
        next();
    });

    server.pre(restify.pre.sanitizePath());
    server.use(restify.fullResponse());
    server.use(restify.gzipResponse());
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(helmet.noCache());
    server.use(helmet.xssFilter());
    server.use(helmet.hidePoweredBy());

    baseRouter.applyRoutes(server, '/v1/calendar');

    return server;
};
