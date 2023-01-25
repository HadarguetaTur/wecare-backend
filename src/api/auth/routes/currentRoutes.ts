import express, { Router } from 'express'
import { authMiddleware } from 'src/middlewares/auth-middelware';
import { CurrentUser } from '../controllers/current-user';

class CurrentUserRoutes {
    private router: Router
    constructor() {
        this.router = express.Router();
    }
    public routes(): Router {  
        this.router.post('/currentuser',authMiddleware.checkAuthentication, CurrentUser.prototype.read);
        return this.router;
    }
}


export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes()