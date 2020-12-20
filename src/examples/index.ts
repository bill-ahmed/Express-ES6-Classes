import express from "express";
import BasicController from "./BasicController";
import EnforcedType from "./EnforcedTypeController";
import InlineMiddleware from "./InlineMiddlewareController";

function main() {
    var app = express();

    app.use(BasicController);
    app.use(EnforcedType);
    app.use(InlineMiddleware);

    app.listen(3000, () => {
        console.info('App listening!')
    })
}

main();