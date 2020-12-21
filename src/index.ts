import { BaseController } from './BaseController';
import { route, get, post, put, all, use } from './route';
import { useMiddleware } from './useMiddleware';
import buildController from './utils/buildController';

export { 
    route, get, post, put, all, use, 
    buildController, 
    useMiddleware, 
    BaseController 
}
export default buildController;