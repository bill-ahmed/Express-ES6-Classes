import 'reflect-metadata';
import { RouteKeyRoot } from "./constants";
import { RouteOptions } from "./types";

export const route = (options?: RouteOptions) => {
    return function(target: Object /** Object */, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(`${RouteKeyRoot}.${propertyKey}`, options ?? {}, target, propertyKey);

        return descriptor;
    }
}