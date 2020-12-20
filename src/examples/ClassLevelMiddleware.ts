import { Request, Response } from 'express';
import { useMiddleware, route } from '../decorators';
import buildController from '../utils/buildController';

@useMiddleware((req, res, n) => { res.locals.count = 0; n() }) /** Can also be an array of middleware! */
class ClassLevelMiddlewareController {
    static PATH = '/classLevelMiddleware'

    @route({ middleware: (req, res, n) => { res.locals.count++; n(); } }) /** Count was provided by class-level middleware since it always runs first! */
    async route_1(req: Request, res: Response, n) {
        res.status(200).send(
            `[${this.constructor.name}] This is an example of a root class-level middleware.<br/><br/>
            Count: ${res.locals.count}
            `
        );
    }
}

export default buildController(ClassLevelMiddlewareController)