import express from "express";
import AdminController from "./AdminController";
import BasicController from "./BasicController";
import ClassLevelMiddleware from "./ClassLevelMiddleware";
import EnforcedType from "./EnforcedTypeController";
import InlineMiddleware from "./InlineMiddlewareController";
import MultipleRouteTypes from "./MultipleRouteTypes";

function main() {
    var app = express();

    app.use(BasicController);
    app.use(EnforcedType);

    app.use(InlineMiddleware);
    app.use(ClassLevelMiddleware);
    
    app.use(MultipleRouteTypes);

    app.use('/admin', AdminController);

    app.listen(3000, () => {
        console.info('App listening!')
    })
}

main();