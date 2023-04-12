import { Request, Response } from 'express';
import TeamService from '../services/TeamService';

export default class TeamController {
  private _service = new TeamService();

  async findAll(_req: Request, res: Response) {
    const teams = await this._service.findAll();
    res.status(200).json(teams);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const team = await this._service.findById(+id);
      res.status(200).json(team);
    } catch ({ message }) {
      res.status(404).json({ message });
    }
  }
}
