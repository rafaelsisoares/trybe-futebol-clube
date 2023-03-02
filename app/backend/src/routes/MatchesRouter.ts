import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';

const router = Router();
const matchesController = new MatchesController();

router.get('/', (req, res) => matchesController.findAll(req, res));

export default router;