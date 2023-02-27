import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

export default class TeamModel extends Model {
  declare id: number;
  declare teamName: string;
}

TeamModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: STRING,
}, {
  timestamps: false,
  underscored: true,
  modelName: 'teams',
  sequelize: db,
});
