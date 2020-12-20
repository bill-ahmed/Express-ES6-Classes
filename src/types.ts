import { NextFunction, Request, Response } from "express";

export type RouterMethod = 'all' | 'get' | 'put' | 'post' | 'patch' | 'delete' | 'use'
export type MiddlewareSignature = (req?: Request, res?: Response, nextFunction?: NextFunction) => any

export interface RouteOptions {
    /** List of middleware to run for this route. */
    middleware?: MiddlewareSignature[]

    /** The HTTP method, e.g. `get`, `post`, `delete`, etc.
     * For a full list: 
     *  * https://expressjs.com/en/api.html#router.METHOD
     *  
     *  * https://www.restapitutorial.com/lessons/httpmethods.html#:~:text=The%20primary%20or%20most%2Dcommonly,but%20are%20utilized%20less%20frequently.
     * 
     * If not defined, will default to `get`.
     */
    type?: RouterMethod
}