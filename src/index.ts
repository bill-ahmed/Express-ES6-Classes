import { BaseController } from './BaseController';
import { route } from './route';
import { useMiddleware } from './useMiddleware';
import buildController from './utils/buildController';

export { buildController, route, useMiddleware, BaseController }
export default buildController;