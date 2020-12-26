import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { RouteKeyRoot } from "./constants";
import { RouteOptions } from "./types";

/** Define function as a route endpoint. */
export const route = (options?: RouteOptions) => {
    return function(target: Object /** Object */, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        // Make sure this is used on a function!
        if(typeof originalMethod !== 'function') { return; }

        Reflect.defineMetadata(`${RouteKeyRoot}.${propertyKey}`, options ?? {}, target, propertyKey);

        descriptor.value = function(req: Request, res: Response, next: NextFunction) {
            /** Bring into scope for easier access
             * This will also provide other methods in the route access to this!
             */
            this.request = req;
            this.response = res;
            this.next = next;

            this.params = req.params;

            originalMethod.apply(this, [req, res, next])
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