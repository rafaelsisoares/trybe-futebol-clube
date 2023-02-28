import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  private _service = new TeamService();

  async findAll(_req: Request, res: Response) {
    const teams = await this._service.findAll();
    res.status(200).json(teams);
  }
}
