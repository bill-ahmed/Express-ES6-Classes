import test from 'ava';

import request from 'supertest';
import express from 'express';

import { route } from '../../../src';
import buildController from '../../../src/utils/buildController';

const app = express();

test('creates route with no middleware', async t => {
    class NoMiddleware {    
        @route()
        async index(req, res) { res.json({ num: -1 }); }
    }

    let router = buildController(NoMiddleware, { path: '/route1' });
    app.use(router);

    let resp = await request(app).get('/route1/index').expect(200, { num: -1 })

    t.is(resp.ok, true)
})

test('creates route with one middleware', async t => {
    class SingleMiddleware {    
        @route({ middleware: (req, res, n) => { res.locals.num = 0; n(); } })
        async index(req, res) { res.json({ num: res.locals.num }); }
    }

    let router = buildController(SingleMiddleware, { path: '/route2' });
    app.use(router);

    let resp = await request(app).get('/route2/index').expect({ num: 0 })
    t.is(resp.ok, true)
})

test('creates route with multiple middleware', async t => {
    class MultipleMiddleware {    
        @route({ 
            middleware: [
                (req, res, n) => { res.locals.num = 0; n(); },
                (req, res, n) => { res.locals.num++; n(); }
            ] 
        })
        async index(req, res) { res.json({ num: res.locals.num }); }
    }

    let router = buildController(MultipleMiddleware, { path: '/route3' });
    app.use(router);

    let resp = await request(app).get('/route3/index').expect({ num: 1 })
    t.is(resp.ok, true)
})

test('creates multiple routes with different middleware', async t => {
    class RoutesWithDifferentMiddleware {    
        @route({ 
            middleware: [
                (req, res, n) => { res.locals.num = 2; n(); },
                (req, res, n) => { res.locals.num++; n(); }
            ] 
        })
        async index(req, res) { res.json({ num: res.locals.num }); }
        
        @route({ 
            middleware: [
                (req, res, n) => { res.locals.num = 4; n(); },
                (req, res, n) => { res.locals.num++; n(); }
            ] 
        })
        async another(req, res) { res.json({ num: res.locals.num }); }
    }

    let router = buildController(RoutesWithDifferentMiddleware, { path: '/route4' });
    app.use(router);

    let resp_1 = await request(app).get('/route4/index').expect({ num: 3 })
    let resp_2 = await request(app).get('/route4/another').expect({ num: 5 })

    t.is(resp_1.ok, true)
    t.is(resp_2.ok, true)
})