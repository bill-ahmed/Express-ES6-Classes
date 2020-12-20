export interface BaseController {
    /** The root path for the controller.
     * If not specified, will default to the root '/'.
     */
    PATH: string;
    [x: string]: any
}