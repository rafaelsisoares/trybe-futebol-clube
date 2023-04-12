import { Router } from 'express';
import checkToken from '../middlewares/checkToken';
import MatchesController from '../controllers/MatchesController';
import checkTeams from '../middlewares/checkTeams';

const router = Router();
const matchesController = new MatchesController();

router.get('/', (req, res) => matchesController.findAll(req, res));
router.post('/', checkToken, checkTeams, (req, res) => matchesController.createMatch(req, res));
router.patch('/:id', checkToken, (req, res) => matchesController.updateMatch(req, res));
router.patch('/:id/finish', checkToken, (req, res) => matchesController.finishMatch(req, res));

export default router;
