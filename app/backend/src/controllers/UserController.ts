import { Request, Response } from 'express';

import UserService from '../services/UserService';

export default class UserController {
  private _service = new UserService();

  async login(req: Request, res: Response) {
    try {
      const token = await this._service.login(req.body);
      res.status(200).json(token);
    } catch ({ message }) {
      res.status(400).json({ message });
    }
  }
}
