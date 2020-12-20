import { Router } from "express";
import { RouteKeyRoot } from "../constants";
import { BuildControllerOptions, RouteOptions } from "../types";

/** 
 * Given a controller class, construct an express router that represents it.
 * @param klass Must implement BaseController!
 */
export default function buildController(klass: any, options?: BuildControllerOptions): Router {
    let instance = new klass();
    let router = options?.router ?? Router();
    
    /** This middleware runs BEFORE all route middleware!
     * Enfore array type.
     */
    let classLevelMiddleware = Reflect.getMetadata(`${RouteKeyRoot}.${klass.name}`, klass) || []
    classLevelMiddleware = Array.isArray(classLevelMiddleware) ? classLevelMiddleware : [classLevelMiddleware]

    let basePath = options?.path ?? klass.PATH ?? ''

    for(const property in instance) {
        let meta = Reflect.getMetadata(`${RouteKeyRoot}.${property}`, instance, property) as RouteOptions

        // If this property is a route
        if(typeof meta !== 'undefined') {
            // 
            // Create new instance for this route to avoid polluting
            // Side-effect is that it allows the user to keep state
            // between requests...may need a fix for this?
            //
            let new_instance = new klass();

            let uriPath;
            let routePath = meta.index ? '' : meta.name ?? property;

            // Clean out leading / character
            if(routePath.startsWith('/')) routePath = routePath.substr(1);

            uriPath = `${basePath}/${routePath}`;

            let methodCall = new_instance[property] as Function;

            let routeTypes = meta.type          || 'get';

            // If middleware is single element, make it an array. If not provided, default to empty array.
            let middleware = Array.isArray(meta.middleware) ? meta.middleware : meta.middleware ? [meta.middleware] : []

            /** User can provide multiple route types */
            if(!Array.isArray(routeTypes)) routeTypes = [routeTypes];

            /** Scope the method call to the instance, so helper functions/properties can be used */
            routeTypes.forEach(routeType => {
                router[routeType].call(router, uriPath, [ ...classLevelMiddleware, ...middleware], (...args) => methodCall.call(instance, ...args))
            })
            
        }
    }

    return router;
}