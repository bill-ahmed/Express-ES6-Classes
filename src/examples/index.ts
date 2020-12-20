import express from "express";
import BasicController from "./BasicController";
import EnforcedType from "./EnforcedTypeController";
import InlineMiddleware from "./InlineMiddlewareController";
import MultipleRouteTypes from "./MultipleRouteTypes";

function main() {
    var app = express();

    app.use(BasicController);
    app.use(EnforcedType);
    app.use(InlineMiddleware);
    app.use(MultipleRouteTypes);

    app.listen(3000, () => {
        console.info('App listening!')
    })
}

main();