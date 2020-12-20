import test from 'ava';

import request from 'supertest';
import express from 'express';

import { route } from '../../../src';
import buildController from '../../../src/utils/buildController';

const app = express();

test('uses function name as route path', async t => {
    class NoNameOverride {
        @route()
        async endpointName(req, res) { res.sendStatus(200); }
    }

    let router = buildController(NoNameOverride, { path: '/route1' })
    app.use(router)

    let resp = await request(app).get('/route1/endpointName').expect(200);
    t.is(resp.ok, true);
})

test('uses given name as route path', async t => {
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

test('handle leading / character', async t => {
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