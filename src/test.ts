import 'reflect-metadata';

const middlewareKey = 'MiddlewareDecorator'

const middleware = (middlewareToAdd?: any[]) => {
    return function(target: any /** Object */, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(middlewareKey, true, target, propertyKey);
        
        let originalMethod = descriptor.value;

        descriptor.value = function(...args) {
            /** Set appropriate middleware the first time around! */
            if(!this.__APPLIED_MIDDLEWARE) {
                this.__MIDDLEWARE = middlewareToAdd;
                this.__APPLIED_MIDDLEWARE = true;

                return;
            }

            originalMethod.apply(this, args);
        }
        return descriptor;
}}

const buildController = (target: any): any => {
    return class extends target {
        /** DO NOT MODIFY! */
        __IS_CONTROLLER = true
        __APPLIED_MIDDLEWARE = false;

        __MIDDLEWARE = [];
    }
}

class Test {
    @middleware(['middleware_1', 'middleware_2'])
    route_1(req: any, res: any, next: () => {}) {
        return `Got parameters: ${req}, ${res}, ${next}.`
    }

    route_2(req: any, res: any, next: () => {}) {
        this.helper_function();
        return 2
    }

    helper_function() {
        console.log("Called helper!")
    }
}

export default buildController(Test)