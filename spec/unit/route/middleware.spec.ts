import test from 'ava';

import request from 'supertest';
import express from 'express';

import { route } from '../../../src';
import buildController from '../../../src/utils/buildController';

const app = express();

test('creates route with no middleware', async t => {
    class NoMiddleware {
        static PATH = '/route1';
    
        @route()
        async index(req, res) { res.json({ num: -1 }); }
    }

    let router = buildController(NoMiddleware);
    app.use(router);

    let resp = await request(app).get('/route1/index').expect(200, { num: -1 })

    t.is(resp.ok, true)
})

test('creates route with one middleware', async t => {
    class SingleMiddleware {
        static PATH = '/route2';
    
        @route({ middleware: (req, res, n) => { res.locals.num = 0; n(); } })
        async index(req, res) { res.json({ num: res.locals.num }); }
    }

    let router = buildController(SingleMiddleware);
    app.use(router);

    let resp = await request(app).get('/route2/index').expect({ num: 0 })
    t.is(resp.ok, true)
})

test('creates route with multiple middleware', async t => {
    class MultipleMiddleware {
        static PATH = '/route3';
    
        @route({ 
            middleware: [
                (req, res, n) => { res.locals.num = 0; n(); },
                (req, res, n) => { res.locals.num++; n(); }
            ] 
        })
        async index(req, res) { res.json({ num: res.locals.num }); }
    }

    let router = buildController(MultipleMiddleware);
    app.use(router);

    let resp = await request(app).get('/route3/index').expect({ num: 1 })
    t.is(resp.ok, true)
})

test('creates multiple routes with different middleware', async t => {
    class RoutesWithDifferentMiddleware {
        static PATH = '/route4';
    
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

    let router = buildController(RoutesWithDifferentMiddleware);
    app.use(router);

    let resp_1 = await request(app).get('/route4/index').expect({ num: 3 })
    let resp_2 = await request(app).get('/route4/another').expect({ num: 5 })

    t.is(resp_1.ok, true)
    t.is(resp_2.ok, true)
})