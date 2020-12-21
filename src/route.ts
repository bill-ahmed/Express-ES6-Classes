import 'reflect-metadata';
import { RouteKeyRoot } from "./constants";
import { RouteOptions } from "./types";

/** Define function as a route endpoint. */
export const route = (options?: RouteOptions) => {
    return function(target: Object /** Object */, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(`${RouteKeyRoot}.${propertyKey}`, options ?? {}, target, propertyKey);

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