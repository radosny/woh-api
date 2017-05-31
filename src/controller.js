'use strict';

const {reduce} = require('lodash');
const {dao} = require('./dao');
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

exports.discovery = function *discovery() {
    return routes;
};

exports.getCountries = function *getCountries() {
    return yield dao.instance.getCountries();
};

exports.getHolidays = function *getHolidays(req) {
    const {params: {year, countryId}} = req;
    return yield dao.instance.getHolidays(countryId, year);
};
