import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { RouteKeyRoot } from "./constants";
import { RouteOptions } from "./types";
import { type } from 'os';

/** Define function as a route endpoint. */
export function route(options?: RouteOptions | string) {
    return function(target: Object /** Object */, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        // Keep track of instance-specific methods
        // Static methods are already taken care of by this design
        var ctxMethods;

        // Make sure this is used on a function!
        if(typeof originalMethod !== 'function') { return; }

        // When given a string option, we assume it's a paramter that's part of the URL
        // Example if options === ':id' and function name 'users' --> '/users/:id'
        if(typeof options === 'string') {
            // Clean out leading / character
            if(options.startsWith('/')) options = options.substr(1);
            
            options = { name: `${propertyKey}/${options}` }
        }

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
                req,
                res,
                next,

                /** @alias req */
                request: req,    

                /** @alias res */
                response: res,

                locals: res.locals,
                params: req.params,
                query: req.query,

                /** Add remaining method calls of instance so it's available in the scope */
                ...ctxMethods
            }

            originalMethod.apply(ctx, [req, res, next])
        }
        return descriptor;
    }
}

/** Define method as a GET route. Shorthand for `route({ type: 'get' })`
 * @alias route
*/
export const get = (options?: RouteOptions | string) => {
    return route(typeof options === 'string' ? options : { ...options, type: 'get' });
}

/** Define method as a POST route. Shorthand for `route({ type: 'post' })`
 * @alias route
*/
export const post = (options?: RouteOptions | string) => {
    return route(typeof options === 'string' ? options : { ...options, type: 'post' });
}

/** Define method as a PUT route. Shorthand for `route({ type: 'put' })`
 * @alias route
*/
export const put = (options?: RouteOptions | string) => {
    return route(typeof options === 'string' ? options : { ...options, type: 'put' });
}

/** Define method as a PUT route. Shorthand for `route({ type: 'delete' })`
 * @alias route
*/
export const del = (options?: RouteOptions | string) => {
    return route(typeof options === 'string' ? options : { ...options, type: 'delete' });
}

/** Will respond to all HTTP methods. Shorthand for `route({ type: 'all' })`
 * @alias route
*/
export const all = (options?: RouteOptions | string) => {
    return route(typeof options === 'string' ? options : { ...options, type: 'all' });
}

/** Similar to `all`. Shorthand for `route({ type: 'use' })`
 * @alias route
*/
export const use = (options?: RouteOptions | string) => {
    return route(typeof options === 'string' ? options : { ...options, type: 'use' });
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