import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { route } from '../decorators';
import buildController from '../utils/buildController';


class BasicController implements BaseController {
    PATH = '/basic'

    @route({ index: true })
    async index(req: Request, res: Response, n) {
        res.status(200).send(`[${this.constructor.name}] index is working!`);
    }
}

export default buildController(BasicController)