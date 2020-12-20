import test from 'ava';
import request from 'supertest';
import express from 'express';

import { route } from '../../../src';
import buildController from '../../../src/utils/buildController';

const app = express();

test('is able to call helper INSTANCE methods in same class', async t => {
    class HelperInstanceMethod {
        @route()
        async index(req, res) { res.json({ num: this.getMagicNumber() }) }

        getMagicNumber() { return 42; }
    }

    let router = buildController(HelperInstanceMethod, { path: '/route1' });
    app.use(router);

    let resp = await request(app).get('/route1/index').expect(200, { num: 42 });
    t.is(resp.ok, true)
})

test('is able to call helper STATIC methods in same class', async t => {
    class HelperStaticMethod {
        @route()
        async index(req, res) { res.json({ num: HelperStaticMethod.getPI() }) }

        static getPI() { return Math.PI; }
    }

    let router = buildController(HelperStaticMethod, { path: '/route2' });
    app.use(router);

    let resp = await request(app).get('/route2/index').expect(200, { num: Math.PI });
    t.is(resp.ok, true)
})

test('is able to call helper async methods in same class', async t => {
    class HelperAsyncMethod {
        @route()
        async index(req, res) { res.json({ num: await this.getMagicNumber() }) }

        /** Sleep for 1 second and return a number */
        getMagicNumber() { 
            return new Promise((resolve, reject) => {
                setTimeout(() => { resolve(33) }, 1000)
            })
        }
    }

    let router = buildController(HelperAsyncMethod, { path: '/route3' });
    app.use(router);

    let resp = await request(app).get('/route3/index').expect(200, { num: 33 });
    t.is(resp.ok, true)
})