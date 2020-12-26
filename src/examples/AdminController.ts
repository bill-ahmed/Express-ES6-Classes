import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { get } from '../route';
import buildController from '../utils/buildController';

class AdminController extends BaseController {
    static PATH = '/'

    @get({ name: 'nested/list_all_users' })
    async listOfAllUsers() {
        setTimeout(function() { 
            this.response.status(200).send(`[${this.constructor.name}] Users page in admin route.`);
         }.bind(this), 1000);
        
    }

    @get({ name: '/deeply/nested/route/path' })
    async superLongNameForSomethingComplicated() {
        this.response.status(200).send(`[${this.constructor.name}] A deeply nested route in Admin!`);
    }
}

export default buildController(AdminController)