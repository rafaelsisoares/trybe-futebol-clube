import { ModelStatic } from 'sequelize';
import TeamModel from '../database/models/TeamModel';
import MatchesModel from '../database/models/MatchesModel';
import { IMatch, IMatchWithTeamName } from '../interfaces/IMatch';

export default class MatchesService {
  private _model: ModelStatic<MatchesModel> = MatchesModel;

  async findAll(): Promise<IMatch[]> {
    const result = await this._model.findAll({
      include: [
        {
          model: TeamModel, as: 'homeTeam', attributes: ['teamName'],
        },
        {
          model: TeamModel, as: 'awayTeam', attributes: ['teamName'],
        },
      ],
    });
    return result;
  }

  async findByProgress(query: boolean): Promise<IMatchWithTeamName[]> {
    const result = await this._model.findOne({
      where: { inProgress: query },
    });

    if (!result) throw new Error('Match not found');

    return result.dataValues;
  }
}
