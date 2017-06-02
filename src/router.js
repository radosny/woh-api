'use strict';

const co = require('co');
const restify = require('restify');
const Router = require('restify-router').Router;

const log = require('./log')(module.id);
const controller = require('./controller');
const router = new Router();

const wrapHandler = function (controllerGenerator) {
    const wrappedController = co.wrap(controllerGenerator);
    return function (req, res) {
        wrappedController(req, res)
            .then(result => {
                res.json(result);
            })
            .catch(e => {
                log.error(e);
                const code = e.statusCode;
                const msg = e.message;
                if (code && msg) {
                    res.send(code, new Error(msg));
                } else {
                    res.send(new restify.errors.InternalServerError());
                }
            });
    };
};

router.get('/', wrapHandler(controller.discovery));
router.get('/countries', wrapHandler(controller.getCountries));
router.get('/holidays/:year/:countryId', wrapHandler(controller.getHolidays));

module.exports = router;
