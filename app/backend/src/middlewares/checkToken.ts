import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import 'dotenv/config';
import { IUser } from '../interfaces/IUser';

const { JWT_SECRET } = process.env;

export default function checkToken(req: Request, res: Response) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const result = jwt.verify(authorization, JWT_SECRET as jwt.Secret);
    const { role } = result as IUser;
    return res.status(200).json({ role });
  } catch ({ message }) {
    console.error(message);
    res.status(401).json({ message: 'Token must be a valid token' });
  }
}
