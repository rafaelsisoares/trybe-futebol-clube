import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import TeamModel from './TeamModel';

export default class MatchesModel extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatchesModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  homeTeamId: {
    type: INTEGER,
    references: {
      model: 'teams',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },

  homeTeamGoals: INTEGER,

  awayTeamId: {
    type: INTEGER,
    references: {
      model: 'teams',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },

  awayTeamGoals: INTEGER,

  inProgress: BOOLEAN,
}, {
  timestamps: false,
  underscored: true,
  modelName: 'matches',
  sequelize: db,
});

MatchesModel.belongsTo(TeamModel, { foreignKey: 'homeTeamId' });
MatchesModel.belongsTo(TeamModel, { foreignKey: 'awayTeamId' });

TeamModel.hasMany(MatchesModel, { foreignKey: 'homeTeamId' });
TeamModel.hasMany(MatchesModel, { foreignKey: 'awayTeamId' });
