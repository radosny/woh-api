'use strict';

const {reduce} = require('lodash');
const dao = require('./dao');
let routes = [];

exports.addRoutesForDiscovery = router => {
    routes = reduce(router, (acc, reqMethod) => {
        const paths = reqMethod.reduce((pathAcc, route) => {
            pathAcc.push({
                path: route.spec.path,
                method: route.method
            });
            return pathAcc;
        }, []);
        acc.push(...paths);
        return acc;
    }, []);
};

exports.discovery = function *discovery(req, res) {
    return routes;
};

exports.getCountries = function *getCountries() {
    return yield dao.getCountries();
};

exports.getHolidays = function *getHolidays(req) {
    const {params: {year, countryId}} = req;
    return yield dao.getHolidays(parseInt(countryId, 10), parseInt(year, 10));
    /**
     const {params:{year, countryId}} = req;
     return yield dao.getHolidays(countryId, year);
     /*
};
