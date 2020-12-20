import { Request, Response } from 'express';
import 'reflect-metadata';
import { BaseController } from './BaseController';
import { MiddlewareKeyRoot } from './constants';


const route = (options?: { middleware?: any[] }) => {
    return function(target: any /** Object */, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(MiddlewareKeyRoot + propertyKey, {options: options ?? {} }, target, propertyKey);
        return descriptor;
}}

const buildController = (target: any): any => {
    return class extends target {
    }
}

class Test implements BaseController {
    PATH = '/dashboard'

    @route({middleware: [(req: Request, res: Response, n) => { res.locals.temp = [{hello: 1}];n() }, (req: Request, res: Response, n) => { res.locals.temp.push({hello: 2});n() }]})
    route_1(req: Request, res: Response, n) {
        res.status(200).send("From route_1!");
    }

    @route({ middleware: [(req, res, n) => {n()}] })
    async route_2(req: Request, res: Response, n) {
        await this.helper_function();
        res.status(200).send('From route_2!')
    }

    helper_function() {
        return new Promise((res, rej) => {
            setTimeout(() => {console.log('Finished waiting for 1 second!'); res(true);}, 1000)
        })    
        
    }
}

export default buildController(Test)