import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { route } from '../decorators';
import buildController from '../utils/buildController';


class EnforcedTypeController extends BaseController {
    static PATH = '/enforcedType'

    @route({ type: 'post' })
    async route_1(req: Request, res: Response, n) {
        await this.sleep();
        res.status(200).send(`[${this.constructor.name}] You can only use POST here!`)
    }

    /** Sleep for 0.5 second */
    sleep() {
        return new Promise((res, rej) => {
            setTimeout(
                () => {
                    res(1);
                }, 500)
        })    
    }
}

export default buildController(EnforcedTypeController)