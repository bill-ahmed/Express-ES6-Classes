import 'reflect-metadata';
import TestClass from './src/test';

function main() {
    let instance = new TestClass();

    console.log("befire route_1", instance)
    instance.route_1();
    console.log("after route_1", instance)

    // https://stackoverflow.com/questions/51170130/check-if-property-is-decorated-with-specific-annotation-typescript
    /** Loop through each function in Class
     *      if function is using middleware decorator (see below)
     *          run the function
     * 
     */
    console.log('using middleware', !!Reflect.getMetadata('MiddlewareDecorator', instance, 'route_1'))
}

main();