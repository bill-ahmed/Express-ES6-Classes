import test from 'ava';

import request from 'supertest';
import express from 'express';

import { all, get, post, put, route, use } from '../../../src';
import buildController from '../../../src/utils/buildController';

/** Test HTTP method types for routes */

class GetOnly {
	static PATH = '/route_1'

	@route()
	async index(req, res) { res.sendStatus(200); }
}

class PostOnly {
	static PATH = '/route_2'

	@route({ type: 'post' })
	async index(req, res) { res.sendStatus(200); }
}

class PutAndPatchAndDelete {
	static PATH = '/route_3'

	@route({ type: ['put', 'patch', 'delete'] })
	async index(req, res) { res.sendStatus(200); }
}

class Aliases {
	static PATH = '/route_4'

	@get()
	async get(req, res) { res.sendStatus(200); }

	@put()
	async put(req, res) { res.sendStatus(200); }

	@post()
	async post(req, res) { res.sendStatus(200); }

	@all()
	async all(req, res) { res.sendStatus(200); }

	@use()
	async use(req, res) { res.sendStatus(200); }
}

const app = express();

test('creates GET route if type is not defined', async t => {
	let router = buildController(GetOnly);
	app.use(router);

	let r_1 = await request(app).get('/route_1/index').expect(200);

	let r_2 = await request(app).post('/route_1/index').expect(404);
	let r_3 = await request(app).patch('/route_1/index').expect(404);
	let r_4 = await request(app).delete('/route_1/index').expect(404);

	// Should only respond OK to GET request
	t.is(r_1.ok, true)

	t.is(r_2.ok, false);
	t.is(r_3.ok, false);
	t.is(r_4.ok, false);
});

test('creates POST route', async t => {
	let router = buildController(PostOnly);
	app.use(router);

	let r_1 = await request(app).post('/route_2/index').expect(200);

	let r_2 = await request(app).get('/route_2/index').expect(404);
	let r_3 = await request(app).patch('/route_2/index').expect(404);
	let r_4 = await request(app).delete('/route_2/index').expect(404);

	// Should only respond OK to POST request
	t.is(r_1.ok, true)

	t.is(r_2.ok, false);
	t.is(r_3.ok, false);
	t.is(r_4.ok, false);
});

test('creates routes for PUT, PATCH and DELETE', async t => {
	let router = buildController(PutAndPatchAndDelete);
	app.use(router);

	let r_1 = await request(app).get('/route_3/index').expect(404);

	let r_2 = await request(app).put('/route_3/index').expect(200);
	let r_3 = await request(app).patch('/route_3/index').expect(200);
	let r_4 = await request(app).delete('/route_3/index').expect(200);

	// Should NOT respond to GET
	t.is(r_1.ok, false)

	t.is(r_2.ok, true);
	t.is(r_3.ok, true);
	t.is(r_4.ok, true);
});

test('aliases work correctly', async t => {
	let router = buildController(Aliases);
	app.use(router);

	// Validate all of the aliased routes
	[
		await request(app).get('/route_4/get').expect(200),
		await request(app).put('/route_4/put').expect(200),
		await request(app).post('/route_4/post').expect(200),

		// 'all' should respond to any method type
		await request(app).get('/route_4/all').expect(200),
		await request(app).put('/route_4/all').expect(200),
		await request(app).post('/route_4/all').expect(200),
		await request(app).patch('/route_4/all').expect(200),
		await request(app).delete('/route_4/all').expect(200),

		// 'use' should respond to any method type
		await request(app).get('/route_4/use').expect(200),
		await request(app).put('/route_4/use').expect(200),
		await request(app).post('/route_4/use').expect(200),
		await request(app).patch('/route_4/use').expect(200),
		await request(app).delete('/route_4/use').expect(200),

	].forEach(req => { t.is(req.ok, true) })
})