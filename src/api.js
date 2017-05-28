const request = require('co-request');
const co = require('co');
const parallel = require('co-parallel');

const config = require('./config').get();
const log = require('./log')(module.id);

const countriesUrls = [
    'http://daybase.eu/zeit/api/getRegions/107/2/false',
    'http://daybase.eu/zeit/api/getRegions/106/2/false'
];

function *getCountry(url) {
    log.info('getCountry::', url);
    const countriesList = yield request(url);
    if (countriesList.statusCode >= 500) {
        log.error('getCountry::fail', url);
        yield new Promise(resolve => setTimeout(resolve, 5000));
        return yield getCountry(url);
    }
    try {
        return JSON.parse(countriesList.body);
    } catch (e) {
        log.error('getCountry::parsing-fail', countriesList.body);
    }
}

exports.getCountries = function* () {
    const reqs = countriesUrls.map(getCountry);
    const res = yield parallel(reqs);
    return res.reduce((acc, val) => (
        acc.concat(val.List)
    ), []).reduce((acc, {id, text}) => {
        acc.push({id,text});
        return acc;
    }, []);
};
