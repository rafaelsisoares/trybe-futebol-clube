import { NextFunction, Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default function checkTeams(req: Request, res: Response, next: NextFunction) {
  const { homeTeamId, awayTeamId } = req.body;
  const teamService = new TeamService();

  if (homeTeamId === awayTeamId) {
    return res.status(422).json({
      message: 'It is not possible to create a match with two equal teams',
    });
  }

  const homeTeam = teamService.findById(homeTeamId);
  const awayTeam = teamService.findById(awayTeamId);

  if (!homeTeam || !awayTeam) {
    return res.status(404).json({ message: 'There is no team with such id!' });
  }

  return next();
}
