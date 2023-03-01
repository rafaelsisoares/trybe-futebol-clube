import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

import { IUser } from '../interfaces/IUser';

const { JWT_SECRET } = process.env;

export default function generateToken(data: IUser): string {
  const { id, username, email, role } = data;

  const token = jwt.sign({ id, username, email, role }, JWT_SECRET as jwt.Secret, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });

  return token;
}
