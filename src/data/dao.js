'use strict';

const parallel = require('co-parallel');
const log = require('../log')(module.id);
const config = require('../config').get();
const db = require('monk')(config.DB_URL);

function *insertCountry(countries, country) {
    return (yield countries.insert(country));
}

exports.createCountries = function *createCountries(countriesList) {
    log.info('createCountries');
    const countries = db.create('countries');

    const countriesToInsert = countriesList.map(insertCountry.bind(null, countries));
    return (yield parallel(countriesToInsert));
};
