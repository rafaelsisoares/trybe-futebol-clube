import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/IUser';

const { JWT_SECRET } = process.env;

export default function decodeToken(token: string): IUser {
  const payload = jwt.verify(token, JWT_SECRET as jwt.Secret);
  return payload as IUser;
}
