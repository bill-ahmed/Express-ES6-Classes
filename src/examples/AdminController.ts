import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { route } from '../decorators';
import buildController from '../utils/buildController';

class AdminController extends BaseController {
    static PATH = '/'

    @route({ name: 'nested/list_all_users' })
    async listOfAllUsers(req: Request, res: Response, n) {
        res.status(200).send(`[${this.constructor.name}] Users page in admin route.`);
    }

    @route({ name: '/deeply/nested/route/path' })
    async superLongNameForSomethingComplicated(req: Request, res: Response, n) {
        res.status(200).send(`[${this.constructor.name}] A deeply nested route in Admin!`);
    }
}

export default buildController(AdminController)