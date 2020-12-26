import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { RouteKeyRoot } from "./constants";
import { RouteOptions } from "./types";

/** Define function as a route endpoint. */
export function route(options?: RouteOptions) {
    return function(target: Object /** Object */, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        // Keep track of instance-specific methods
        // Static methods are already taken care of by this design
        var ctxMethods;

        // Make sure this is used on a function!
        if(typeof originalMethod !== 'function') { return; }
        Reflect.defineMetadata(`${RouteKeyRoot}.${propertyKey}`, options ?? {}, target, propertyKey);

        descriptor.value = function(req: Request, res: Response, next: NextFunction) {
            // Populate instance methods the first time if we don't already have them
            // Closure-magic
            if(!ctxMethods) ctxMethods = getMethods(this);

            /** 
             * Bring these into scope for easier access.
             * This will also provide helper methods in the class access to this!
             */
            const ctx = {
                request: req,
                response: res,
                next: next,

                locals: res.locals,
                params: req.params,
                query: req.query,

                /** Add remaining method calls of instance so it's available in the scope */
                ...ctxMethods
            }

            originalMethod.bind(ctx).apply(this, [req, res, next])
        }
        return descriptor;
    }
}

/** Define method as a GET route. Shorthand for `route({ type: 'get' })`
 * @alias route
*/
export const get = (options?: RouteOptions) => {
    return route({ ...options, type: 'get' });
}

/** Define method as a POST route. Shorthand for `route({ type: 'post' })`
 * @alias route
*/
export const post = (options?: RouteOptions) => {
    return route({ ...options, type: 'post' });
}

/** Define method as a PUT route. Shorthand for `route({ type: 'put' })`
 * @alias route
*/
export const put = (options?: RouteOptions) => {
    return route({ ...options, type: 'put' });
}

/** Will respond to all HTTP methods. Shorthand for `route({ type: 'all' })`
 * @alias route
*/
export const all = (options?: RouteOptions) => {
    return route({ ...options, type: 'all' });
}

/** Similar to `all`. Shorthand for `route({ type: 'use' })`
 * @alias route
*/
export const use = (options?: RouteOptions) => {
    return route({ ...options, type: 'use' });
}

/** Get all functions defined in an object */
function getMethods(object) {
    let result = {};

    for(const property in object) {
        let prop = object[property]
        if(typeof prop === 'function') {
            result[property] = prop;
        }
    }
    return result;
} 