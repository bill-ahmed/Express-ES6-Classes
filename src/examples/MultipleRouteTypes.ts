import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { route } from '../decorators';
import buildController from '../utils/buildController';


class MultipleRouteTypesController implements BaseController {
    PATH = '/multipleRouteTypes'

    @route({ type: ['get', 'delete'] })
    async route_1(req: Request, res: Response, n) {
        res.status(200).send(`[${this.constructor.name}] Can only call GET or DELETE on this route!`);
    }
}

export default buildController(MultipleRouteTypesController)