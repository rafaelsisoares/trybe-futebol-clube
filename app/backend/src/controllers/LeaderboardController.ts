import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  private _service = new LeaderboardService();

  async getHomeLeaderboard(_req: Request, res: Response): Promise<Response> {
    const leaderboard = await this._service.leaderboard('homeTeamId');
    return res.status(200).json(leaderboard);
  }

  async getAwayLeaderboard(_req: Request, res: Response): Promise<Response> {
    const leaderboard = await this._service.leaderboard('awayTeamId');
    return res.status(200).json(leaderboard);
  }
}
