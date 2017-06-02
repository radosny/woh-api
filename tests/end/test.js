'use strict';

const request = require('supertest');
const _ = require('lodash');
const assert = require('assert');
const server = require('../../src/start');

describe('GET non existing route', function () {
    it('should return not found', function (done) {
        request(server.app)
            .get('/')
            .expect(404)
            .end(done);
    });
});

describe('GET countries route', function () {
    it('should return non empty array', function (done) {
        request(server.app)
            .get('/v1/calendar/countries')
            .expect(200)
            .end(function (err, res) {
                assert.equal(_.isArray(res.body), true);
                assert.equal(res.body.length > 0, true);
                done();
            });
    });
    it('should return at least one proper country in array', function (done) {
        request(server.app)
            .get('/v1/calendar/countries')
            .expect(200)
            .end(function (err, res) {
                const id = res.body[0].id;
                const text = res.body[0].text;
                assert.equal(_.isNumber(id)
                    || _.isString(id), true);
                assert.equal(_.isString(text), true);
                done();
            });
    });
});

describe('GET holidays route', function () {
    it('should return non empty array', function (done) {
        request(server.app)
            .get('/v1/calendar/holidays/2017/81')
            .expect(200)
            .end(function (err, res) {
                assert.equal(_.isArray(res.body), true);
                assert.equal(res.body.length > 0, true);
                done();
            });
    });
    it('should return at least one proper holiday date in array', function (done) {
        request(server.app)
            .get('/v1/calendar/holidays/2017/81')
            .expect(200)
            .end(function (err, res) {
                const item = res.body[0];
                assert.equal(_.isString(item), true);
                assert.equal(_.isDate(new Date(item)), true);
                done();
            });
    });
});
