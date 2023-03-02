import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private _service = new MatchesService();

  async findAll(req: Request, res: Response) {
    const matches = await this._service.findAll();
    res.status(200).json(matches);
  }
}
