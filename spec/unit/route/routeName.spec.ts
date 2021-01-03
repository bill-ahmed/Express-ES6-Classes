import test from 'ava';

import request from 'supertest';
import express from 'express';

import { route } from '../../../src';
import buildController from '../../../src/utils/buildController';

const app = express();

test('it uses function name as route path', async t => {
    class NoNameOverride {
        @route()
        async endpointName(req, res) { res.sendStatus(200); }
    }

    let router = buildController(NoNameOverride, { path: '/route1' })
    app.use(router)

    let resp = await request(app).get('/route1/endpointName').expect(200);
    t.is(resp.ok, true);
})

test('it uses given name as route path', async t => {
    class NoNameOverride {
        @route({ name: 'differentName' })
        async endpointName(req, res) { res.sendStatus(200); }
    }

    let router = buildController(NoNameOverride, { path: '/route2' })
    app.use(router)

    let resp = await request(app).get('/route2/differentName').expect(200);
    let resp_2 = await request(app).get('/route2/endpointName').expect(404);

    t.is(resp.ok, true);
    t.is(resp_2.ok, false);
})

test('it handles leading / character', async t => {
    class NoNameOverride {
        @route({ name: '/differentName' })         /** Route name starts with '/' character, should still work! */
        async endpointName(req, res) { res.sendStatus(200); }
    }

    let router = buildController(NoNameOverride, { path: '/route3' })
    app.use(router)

    let resp = await request(app).get('/route3/differentName').expect(200);
    let resp_2 = await request(app).get('/route3/endpointName').expect(404);

    t.is(resp.ok, true);
    t.is(resp_2.ok, false);
})

test('it handles parameters in URL', async t => {
    class Paramter {
        @route('/:id')         /** Route name starts with '/' character, should still work! */
        async index(req, res) { res.sendStatus(200); }

        @route(':id')
        async another(req, res) { res.sendStatus(200); }
    }

    let router = buildController(Paramter, { path: '/route4' })
    app.use(router)

    let resp = await request(app).get('/route4/index/first_id').expect(200);
    let resp_2 = await request(app).get('/route4/index/another_id').expect(200);
    let resp_3 = await request(app).get('/route4/index').expect(404);

    let resp_4 = await request(app).get('/route4/another/another_id').expect(200);

    t.is(resp.ok, true);
    t.is(resp_2.ok, true);
    t.is(resp_3.ok, false);
    t.is(resp_4.ok, true);
});

test('it handles nested paramters in URL', async t => {
    class MultipleParamter {
        @route('/:organization/:id')         /** Route name starts with '/' character, should still work! */
        async one(req, res) { res.sendStatus(200); }

        @route('/:organization/:first_id/:another_id')
        async two(req, res) { res.sendStatus(200); }
    }

    let router = buildController(MultipleParamter, { path: '/route5' })
    app.use(router)

    let resp = await request(app).get('/route5/one/microsoft/1234').expect(200);
    let resp_2 = await request(app).get('/route5/two/apple/5555/8765').expect(200);

    t.is(resp.ok, true);
    t.is(resp_2.ok, true);
});