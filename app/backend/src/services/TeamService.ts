import { ModelStatic } from 'sequelize';
import ITeam from '../interfaces/ITeam';
import TeamModel from '../database/models/TeamModel';

export default class TeamService {
  private _model: ModelStatic<TeamModel> = TeamModel;

  async findAll(): Promise<ITeam[]> {
    const result = await this._model.findAll();
    const teams: ITeam[] = result.map((team) => team.dataValues);
    return teams;
  }
}
