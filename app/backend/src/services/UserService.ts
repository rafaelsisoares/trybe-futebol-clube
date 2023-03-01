import { ModelStatic } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import UserModel from '../database/models/UserModel';
import { ILogin } from '../interfaces/IUser';
import generateToken from '../utils/generateToken';
import loginDataSchema from './validators/schemas';

export default class UserService {
  private _model: ModelStatic<UserModel> = UserModel;

  async login(data: ILogin) {
    const { email, password } = data;

    const { error } = loginDataSchema.validate(data);
    if (error) {
      throw new Error('Invalid email or password');
    }

    const result = await this._model.findOne({
      where: { email },
    });

    if (!result) throw new Error('Invalid email or password');

    if (!bcrypt.compareSync(password, result.dataValues.password)) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(result.dataValues);
    return token;
  }
}
