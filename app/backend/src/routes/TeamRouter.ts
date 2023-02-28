import { Router } from 'express';
import TeamController from '../controllers/TeamController';

const router = Router();
const teamController = new TeamController();

router.get('/', (req, res) => teamController.findAll(req, res));
router.get('/:id', (req, res) => teamController.findById(req, res));

export default router;
