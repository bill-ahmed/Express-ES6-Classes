import test from 'ava';

import request from 'supertest';
import express from 'express';

import { route } from '../../../src';
import buildController from '../../../src/utils/buildController';

const app = express();

test('create route at function name when index not provided', async t => {
    class NoIndexRoute {
        static PATH = '/route1'

        @route()
        async index(req, res) { res.sendStatus(200); }
    }

    let router = buildController(NoIndexRoute);
    app.use(router);

    let resp = await request(app).get('/route1/index').expect(200);
    let resp_2 = await request(app).get('/route1').expect(404);

    t.is(resp.ok, true);
    t.is(resp_2.ok, false);
})

test('creates route at index when provided correct flag', async t => {
    class IndexRoute {
        static PATH = '/route2'

        @route({ index: true })
        async something(req, res) { res.sendStatus(200); }
    }

    
    let router = buildController(IndexRoute);
    app.use(router);

    let resp = await request(app).get('/route2').expect(200);
    let resp_2 = await request(app).get('/route2/something').expect(404);

    t.is(resp.ok, true);
    t.is(resp_2.ok, false);
})