import { ModelStatic } from 'sequelize';
import TeamModel from '../database/models/TeamModel';
import MatchesModel from '../database/models/MatchesModel';
import { IMatch } from '../interfaces/IMatch';
import IMatchInput from '../interfaces/IMatchInput';

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

  async finishMatch(id: number): Promise<boolean> {
    const [match] = await this._model.update(
      {
        inProgress: false,
      },
      {
        where: { id },
      },
    );

    if (match !== 1) return false;

    return true;
  }

  async updateMatch(id: number, data: IMatchInput): Promise<IMatch> {
    const { homeTeamGoals, awayTeamGoals } = data;
    await this._model.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
    const updatedMatch = await this._model.findOne({ where: { id } });
    return updatedMatch as IMatch;
  }
}
