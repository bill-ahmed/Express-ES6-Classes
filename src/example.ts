import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { route } from './decorators';
import buildController from './utils/buildController';


class DashboardController implements BaseController {
    PATH = '/dashboard'

    @route({
        middleware: [
            (req: Request, res: Response, n) => { res.locals.temp = [{hello: 1}];n() }, 
            (req: Request, res: Response, n) => { res.locals.temp.push({hello: 2});n() }
        ]
    })
    route_1(req: Request, res: Response, n) {
        res.status(200).send(`From route_1! ${JSON.stringify(res.locals.temp)}`);
    }

    @route({ middleware: [(req, res, n) => {n()}], type: 'post' })
    async route_2(req: Request, res: Response, n) {
        await this.sleep();
        res.status(200).send('From route_2!')
    }

    /** Sleep for 0.5 second */
    sleep() {
        return new Promise((res, rej) => {
            setTimeout(() => {console.log('Finished waiting for 1 second!'); res(true);}, 500)
        })    
        
    }
}

export default buildController(DashboardController)