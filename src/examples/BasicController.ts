import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { route } from '../route';
import buildController from '../utils/buildController';

class BasicController extends BaseController {
    static PATH = '/basic'

    @route({ index: true })
    async index() {
        this.response.status(200).send(`[${this.constructor.name}] This is an example of a root (index) route. Helper message: ${this.helper1()}`);
    }

    helper1() {
        return 'helper works!'
    }
}

export default buildController(BasicController)