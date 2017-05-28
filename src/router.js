'use strict';

const Router = require('restify-router').Router;
const router = new Router();

require('./data/builder');

router.get('/', function (req, res) {
    res.send(200, 'Calendar');
});

module.exports = router;
