import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  private _service = new MatchesService();

  async findAll(req: Request, res: Response): Promise<void | Response> {
    const { inProgress } = req.query;

    const matches = await this._service.findAll(inProgress as string);
    res.status(200).json(matches);
  }

  async finishMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const isFinished = await this._service.finishMatch(+id);

    if (!isFinished) return res.status(500).json({ message: 'Internal Server Error' });

    return res.status(200).json({ message: 'Finished' });
  }
}
