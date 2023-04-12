import { Model, INTEGER, STRING } from 'sequelize';
import { IUser } from '../../interfaces/IUser';
import db from '.';

export default class UserModel extends Model implements IUser {
  declare id: number;
  declare username: string;
  declare role: string;
  declare email: string;
  declare password: string;
}

UserModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: STRING,
  role: STRING,
  email: STRING,
  password: STRING,
}, {
  sequelize: db,
  timestamps: false,
  underscored: true,
  modelName: 'users',
});
