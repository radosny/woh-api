'use strict';

const log = require('../log')('exceptionHandler');

/**
 * Handles uncaught exceptions etc.
 * @param {Restify} app - server instance
 */
exports.handleBaseException = function handleBaseException(app) {
    process.on('uncaughtException', function (err) {
        log.error(err);
        log.error('Process uncaught exception, shutting down the server');
        app.seppuku();
    });

    process.on('SIGINT', function () {
        log.warn('SIGINT (Ctrl-C) received');
        app.seppuku();
    });

    process.on('SIGTERM', function () {
        log.warn('SIGTERM (kill) received');
        app.seppuku();
    });
}
