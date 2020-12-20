import 'reflect-metadata';
import { RouteKeyRoot } from "./constants";
import { MiddlewareSignature } from "./types";

/** Assign middleware to all routes within this class.
 * @param middleware The middleware to assign.
 * 
 * **NOTE**: Any middleware defined here will run _BEFORE_ all route-level middleware!
 * 
 */
export function useMiddleware(middleware: MiddlewareSignature | MiddlewareSignature[]) {
    return function(constructor: any) {
        Reflect.defineMetadata(`${RouteKeyRoot}.${constructor.name}`, middleware, constructor)

        return constructor;
    }
}