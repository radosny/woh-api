'use strict';

const request = require('co-request');
const restify = require('restify');
const parallel = require('co-parallel');

const log = require('./log')(module.id);

const countriesUrls = [
    'http://daybase.eu/zeit/api/getRegions/107/2/false',
    'http://daybase.eu/zeit/api/getRegions/106/2/false'
];
const getUrlForHolidays = (countryId, year) => `http://daybase.eu/zeit/api/getEvents/${year}/2/${countryId}/1/true/true/true`;

exports.getHolidays = function *(countryId, year) {
    log.info('getHolidays::', ...arguments);
    const holidaysListResp = yield request(getUrlForHolidays(countryId, year));
    if (!holidaysListResp.body) {
        throw new restify.NotFoundError({message: 'Holidays not found for specified request'});
    }
    try {
        return JSON.parse(holidaysListResp.body);
    } catch (e) {
        log.error('getHolidays::parsing-fail', holidaysListResp.body);
        throw e;
    }
}

function *getCountry(url, retryCount = 0) {
    log.info('getCountry::', url);
    const countriesListResp = yield request(url);
    if (countriesListResp.statusCode >= 500) {
        log.error('getCountry::fail', url);
        yield new Promise(resolve => setTimeout(resolve, 5000));
        if (retryCount < 5) {
            return yield getCountry(url, retryCount + 1);
        } else {
            log.error('getCountry::fail-retry');
            throw new restify.InternalServerError({message: 'Countries not available'});
        }
    } else if (countriesListResp.statusCode >= 400 && countriesListResp.statusCode < 500 || !countriesListResp.body) {
        throw new restify.NotFoundError({message: 'Countries not found'});
    } else {
        try {
            return JSON.parse(countriesListResp.body);
        } catch (e) {
            log.error('getCountry::parsing-fail', countriesListResp.body);
            throw e;
        }
    }
}

exports.getCountries = function *() {
    const reqs = countriesUrls.map(getCountry);
    const res = yield parallel(reqs);
    return res.reduce((acc, val) => (
        acc.concat(val.List)
    ), []).reduce((acc, {id, text}) => {
        acc.push({id, text});
        return acc;
    }, []);
};
