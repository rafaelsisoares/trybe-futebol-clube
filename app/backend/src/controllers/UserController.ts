import { Request, Response } from 'express';

import UserService from '../services/UserService';

export default class UserController {
  private _service = new UserService();

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const token = await this._service.login(req.body);
      return res.status(200).json({ token });
    } catch ({ message }) {
      return res.status(401).json({ message });
    }
  }

  async getRole(req: Request, res: Response): Promise<Response> {
    const { authorization } = req.headers;

    const role = await this._service.getRole(authorization as string);
    return res.status(200).json({ role });
  }
}
