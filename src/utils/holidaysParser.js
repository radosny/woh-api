'use strict';

const map = require('lodash.map');

exports.parseHolidays = holidays => (
    Promise.resolve(holidays.reduce((acc, {date}) => {
        acc.push(date);
        return acc;
    }, [])
));

exports.parseCountries = countries => (
    Promise.resolve(
        map(countries, (country, key) => (
            {
                id: key,
                text: country
            }
        )))
);
