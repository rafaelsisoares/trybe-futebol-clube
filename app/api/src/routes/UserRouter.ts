import { Router } from 'express';
import checkLoginInput from '../middlewares/checkLoginInput';

import UserController from '../controllers/UserController';
import checkToken from '../middlewares/checkToken';

const router = Router();
const userController = new UserController();

router.post('/', checkLoginInput, (req, res) => userController.login(req, res));
router.get('/role', checkToken, (req, res) => userController.getRole(req, res));

export default router;
