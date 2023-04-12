import { NextFunction, Request, Response } from 'express';
import decodeToken from '../utils/decodeToken';

export default function checkToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    decodeToken(authorization);
    return next();
  } catch ({ message }) {
    console.error(message);
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
}
