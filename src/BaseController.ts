import { Request, Response, NextFunction } from 'express';

/** 
 * 
 * This class **does not** implement any functionality, 
 * extend this for intellisense with your editor 
 * of choice!
 *  
 */
export abstract class BaseController {
    /** The root path for the controller.
     * If not specified, will default to the root '/'.
     */
    static PATH: string = '/';

    req: Request;
    res: Response;

    request: Request;
    response: Response;
    next: NextFunction;

    locals: any;
    params: any;
    query: any;
    
    [x: string]: any
}