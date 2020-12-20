import test from 'ava';
import request from 'supertest';
import express from 'express';

import { route, useMiddleware } from '../../../src';
import buildController from '../../../src/utils/buildController';

const app = express();

test('it created class-level middleware with single function', async t => {
    @useMiddleware((req, res, n) => { res.locals.num = 1; n(); })
    class SingleMiddleware {
        @route()
        index(req, res) { res.json({ num: res.locals.num }); }
    }

    let router = buildController(SingleMiddleware, { path: '/route1' });
    app.use(router)

    let resp = await request(app).get('/route1/index').expect(200, { num: 1 })
    t.is(resp.ok, true);
})

test('it creates multiple class-level middleware', async t => {
    @useMiddleware([
        (req, res, n) => { res.locals.num = 1; n(); },
        (req, res, n) => { res.locals.num += 1; n(); }
    ])
    class MultipleMiddleware {
        @route()
        index(req, res) { res.json({ num: res.locals.num }); }
    }

    let router = buildController(MultipleMiddleware, { path: '/route2' });
    app.use(router)

    let resp = await request(app).get('/route2/index').expect(200, { num: 2 })
    t.is(resp.ok, true);
})

test('class-level middleware execute before route-level middleware', async t => {
    @useMiddleware([
        (req, res, n) => { res.locals.num = 1; n(); },
        (req, res, n) => { res.locals.num += 1; n(); }
    ])
    class ClassPrecedenceMiddleware {
        @route({ middleware: (req, res, n) => { res.locals.num *= 2; n(); } })
        index(req, res) { res.json({ num: res.locals.num }); }
    }

    let router = buildController(ClassPrecedenceMiddleware, { path: '/route3' });
    app.use(router)

    let resp = await request(app).get('/route3/index').expect(200, { num: 4 })
    t.is(resp.ok, true);
})