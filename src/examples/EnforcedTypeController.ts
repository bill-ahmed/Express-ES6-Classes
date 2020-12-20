import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { route } from '../decorators';
import buildController from '../utils/buildController';


class EnforcedTypeController implements BaseController {
    PATH = '/enforcedType'

    @route({ type: 'post' })
    async route_1(req: Request, res: Response, n) {
        await this.sleep();
        res.status(200).send(`[${this.constructor.name}] route_1 is working!`)
    }

    /** Sleep for 0.5 second */
    sleep() {
        return new Promise((res, rej) => {
            setTimeout(() => {console.log('Finished waiting for 1 second!'); res(true);}, 500)
        })    
    }
}

export default buildController(EnforcedTypeController)