import { ModelStatic } from 'sequelize';
import TeamModel from '../database/models/TeamModel';
import MatchesModel from '../database/models/MatchesModel';
import { IMatch } from '../interfaces/IMatch';

export default class MatchesService {
  private _model: ModelStatic<MatchesModel> = MatchesModel;

  async findAll(query?: string | undefined): Promise<IMatch[]> {
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

    if (query) {
      const isInProgress: boolean = query === 'true';
      const filteredResult = result.filter((match: IMatch) => match.inProgress === isInProgress);
      return filteredResult;
    }

    return result;
  }
}
