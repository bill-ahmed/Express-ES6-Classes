import { NextFunction, Request, Response } from 'express';

export abstract class BaseController {
    /** The root path for the controller.
     * If not specified, will default to the root '/'.
     */
    static PATH: string = '/';

    request: Request;
    response: Response;
    next: NextFunction;
    params: any;

    helpers: any;
    
    [x: string]: any
}