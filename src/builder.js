'use strict';

const co = require('co');

const log = require('./log')(module.id);
const api = require('./api');
const dao = require('./dao');

const buildCountries = co.wrap(function *() {
    log.info('buildCountries');
    return yield api.getCountries();
});

exports.fetchInitialData = () => {
    buildCountries().then(countriesList => {
        co(function *() {
            return (yield dao.createCountries(countriesList));
        }).then(addedCountries => {
            log.info('buildCountries::length', addedCountries.length);
        });
    });
};
