import { Router } from "express";
import { MiddlewareKeyRoot } from "./constants";

/** Given a controller class, construct an express router that represents it. */
export default function buildController(klass: any) {
    let instance = new klass();
    let router = Router();
    
    let basePath = instance.PATH || ''

    let class_routes = [];
    for(const property in instance) {
        let meta = Reflect.getMetadata(MiddlewareKeyRoot + property, instance, property)

        // If this property is a route
        if(typeof meta !== 'undefined') {
            // Create new instance for this route
            let new_instance = new klass();

            let uriPath = `${basePath}/${property}`;
            let middleware = meta?.options?.middleware ?? []
            let routeCall = new_instance[property];

            console.log({ uriPath, middleware, routeCall })

            router.use(uriPath, ...middleware, (...args) => routeCall.call(instance, ...args))
            class_routes.push(new_instance);
        }
    }

    return router;
}