import { NextFunction, Request, Response } from "express";

export type MiddlewareSignature = (req?: Request, res?: Response, nextFunction?: NextFunction) => any

export interface RouteOptions {
    middleware?: MiddlewareSignature[]
    type?: String
}