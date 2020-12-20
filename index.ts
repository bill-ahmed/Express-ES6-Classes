import 'reflect-metadata';
import express from "express";

import buildController from './src/buildController';
import { MiddlewareKeyRoot } from './src/constants';
import TestClass from './src/test';

function main() {

    // console.log("befire route_1", instance)
    // instance.route_1();
    // console.log("after route_1", instance)

    // https://stackoverflow.com/questions/51170130/check-if-property-is-decorated-with-specific-annotation-typescript
    /** Loop through each function in Class
     *      if function is using middleware decorator (see below)
     *          run the function for initial setup
     * 
     */
    var app = express();
    let router = buildController(TestClass)
    app.use(router);

    app.listen(3000, () => {
        console.warn('App listening!')
    })
}

main();