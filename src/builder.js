'use strict';

const co = require('co');

const log = require('./log')(module.id);
const api = require('./api');
const {dao, localDao} = require('./dao');
const {createCountries} = require('./dao/RemoteDao');

const buildCountries = co.wrap(function *() {
    log.info('buildCountries');
    return yield api.getCountries();
});

exports.fetchInitialData = () => {
    buildCountries()
    .then(countriesList => {
        co(function *() {
            return (yield createCountries(countriesList));
        }).then(addedCountries => {
            log.info('buildCountries::length', addedCountries.length);
        });
    }).catch(e => {
        log.error(e);
        log.info('Switching dao after error');
        dao.changeDaoType(localDao);
    });
};
