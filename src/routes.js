import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import StateController from './app/controllers/StateController';
import CitieController from './app/controllers/CitieController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

/*
 * Unauthenticated routes
 */

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

/*
 * Authenticated routes
 */

routes.use(authMiddleware);

// Users
routes.put('/users', UserController.update);

// Files
routes.post('/files', upload.single('file'), FileController.store);

// States
routes.get('/states', StateController.index);

// Cities
routes.get('/cities', CitieController.index);

export default routes;
