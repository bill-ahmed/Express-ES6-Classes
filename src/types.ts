import { NextFunction, Request, Response, Router } from "express";

export type RouterMethod = 'all' | 'get' | 'put' | 'post' | 'patch' | 'delete' | 'use'
export type MiddlewareSignature = (req?: Request, res?: Response, nextFunction?: NextFunction) => any

export type RouteOptions = {
    /** List of middleware to run for this route. */
    middleware?: MiddlewareSignature | MiddlewareSignature[],

    /** The HTTP method, e.g. `get`, `post`, `delete`, `['get', 'post']` etc.
     * For a full list: 
     *  * https://expressjs.com/en/api.html#router.METHOD
     *  
     *  * https://www.restapitutorial.com/lessons/httpmethods.html#:~:text=The%20primary%20or%20most%2Dcommonly,but%20are%20utilized%20less%20frequently.
     * 
     * If not defined, will default to `get`.
     */
    type?: RouterMethod | RouterMethod[],

    /** Override the name of this route. By default the function name is used.
     * @example ```@route({ name: 'list_all_users' })```
     * @example ```@route({ name: '/nested/list_all_users' })```
     */
    name?: string,

    /** Whether this should be treated as the index route for controller path */
    index?: boolean
}

export type BuildControllerOptions = {
    /** To override PATH defined in the controller. */
    path?: string,

    /** If you want to specify your own Express Router. */
    router?: Router
}