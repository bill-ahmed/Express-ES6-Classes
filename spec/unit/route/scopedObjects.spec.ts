import test from 'ava';
import request from 'supertest';
import express from 'express';

import { BaseController, get } from '../../../src';
import buildController from '../../../src/utils/buildController';

const app = express();

test('is able to access request and response objects via `this`', async t => {
    class Controller extends BaseController {
        @get()
        async index() { this.response.json({ num: this.request.query.n }); }
    }

    let router = buildController(Controller, { path: '/route1' });
    app.use(router);

    let resp = await request(app).get('/route1/index?n=23').expect(200, { num: '23' });
    t.is(resp.ok, true)
});