import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import UserModel from '../database/models/UserModel';
import { ILogin } from '../interfaces/IUser';
import generateToken from '../utils/generateToken';
import loginDataSchema from './validators/schemas';
import decodeToken from '../utils/decodeToken';

export default class UserService {
  private _model: ModelStatic<UserModel> = UserModel;

  async login(data: ILogin) {
    const { email, password } = data;

    const { error } = loginDataSchema.validate(data);

    const result = await this._model.findOne({
      where: { email },
    });

    if (error || !result || !bcrypt.compareSync(password, result.dataValues.password)) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(result.dataValues);
    return token;
  }

  async getRole(token: string) {
    const payload = await decodeToken(token);
    const user = await this._model.findOne({ where: { id: payload.id } });
    if (!user) return null;
    return user.role;
  }
}
