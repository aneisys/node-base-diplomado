import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import validate from '../validators/validate.js';
import { schema } from '../validators/user.validate.js';
import { authenticateToken } from '../middlewares/authenticate.middleware.js';
const router = Router();

router
    .route('/')
    .get(userController.getUsers)
    .post(validate(schema), userController.create)

router
    .route('/list/pagination')
    .get(userController.getPaginatedUsers)

router
    .route('/:id')
    .get(authenticateToken, userController.findUserById)
    .put(authenticateToken, validate(schema), userController.updateUser)
    .delete(authenticateToken, userController.deleteR)
    .patch(authenticateToken, userController.activeInactive)

export default router