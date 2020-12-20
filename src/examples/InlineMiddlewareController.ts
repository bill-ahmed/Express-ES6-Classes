import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { route } from '../decorators';
import buildController from '../utils/buildController';


class InlineMiddlewareController extends BaseController {
    static PATH = '/inlineMiddleware'

    @route({
        middleware: [
            (req: Request, res: Response, n) => { res.locals.temp = [{ middleware1Ran: true }]; n() }, 
            (req: Request, res: Response, n) => { res.locals.temp.push({ middleware2Ran: 2 });  n() }
        ]
    })
    async route_1(req: Request, res: Response, n) {
        res.status(200).send(`[${this.constructor.name}] A route with some middleware, here's the data: ${JSON.stringify(res.locals.temp)}`);
    }
}

export default buildController(InlineMiddlewareController)