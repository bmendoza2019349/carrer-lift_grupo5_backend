import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import authRoutes from '../src/auth/auth.routes.js'
import '../src/users/initUsers.js'
import moduleRoutes from '../src/module/module.routes.js'
import courseRoutes from '../src/course/course.routes.js'
import formRoutes from '../src/Form/exam.routes.js'
import userRoutes from '../src/users/user.routes.js'
import apiLimiter from '../src/middlewares/validar-cant-peticiones.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/carrerLiftApi/v1/auth'
        this.modulePath = '/carrerLiftApi/v1/modules'
        this.coursePath = '/carrerLiftApi/v1/course'
        this.formPath = '/carrerLiftApi/v1/form'
        this.userPath = '/carrerLiftApi/v1/user'
        this.conectarDB();
        this.middlewares();
        this.routes();
    }

    async conectarDB () {
        await dbConnection();
    }


    middlewares () {
        this.app.use( express.urlencoded( { extended: false } ) );
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use( helmet() );
        this.app.use( morgan( 'dev' ) );
        //apiLimiter
        this.app.use( apiLimiter );
        this.app.use( '/uploads', express.static( 'uploads' ) )

    };


    routes () {
        this.app.use( this.authPath, authRoutes );
        this.app.use( this.modulePath, moduleRoutes );
        this.app.use( this.coursePath, courseRoutes );
        this.app.use( this.formPath, formRoutes );
        this.app.use( this.userPath, userRoutes );
    };

    listen () {
        this.app.listen( this.port, () => {
            console.log( 'Server running on port ', this.port );
        } );
    }
}

export default Server;