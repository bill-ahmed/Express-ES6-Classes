import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { get, route } from '../route';
import buildController from '../utils/buildController';

class BasicController extends BaseController {
    static PATH = '/basic'

    @route({ index: true })
    async index() {
        this.response.status(200).send(`[${this.constructor.name}] This is an example of a root (index) route. Helper message: ${this.helper1()}`);
    }

    @get(':id')
    async other() {
        this.response.status(200).send(`Requested user with ID: ${this.params.id}`);
    }

    helper1() {
        return `Helper works! ${new Date()}`
    }
}

export default buildController(BasicController)