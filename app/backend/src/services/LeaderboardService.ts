import { ModelStatic } from 'sequelize';
import MatchesModel from '../database/models/MatchesModel';
import TeamModel from '../database/models/TeamModel';
import ILeaderboard from '../interfaces/ILeaderboard';

export default class LeaderboardService {
  private _team: ModelStatic<TeamModel> = TeamModel;
  private _matches: ModelStatic<MatchesModel> = MatchesModel;
  private _points = 0;

  private getPoints(params: number, query: 'V' | 'D'): void {
    this._points += query === 'V' ? params * 3 : params;
  }

  private async getVictories(id: number, query: 'homeTeamId' | 'awayTeamId'): Promise<number> {
    const matches = await this._matches.findAll({
      where: { [query]: id },
    });

    const winMatches = matches
      .filter(({ homeTeamGoals, awayTeamGoals }) => homeTeamGoals > awayTeamGoals)
      .length;

    this.getPoints(winMatches, 'V');

    return winMatches;
  }

  private async getDraws(id: number, query: 'homeTeamId' | 'awayTeamId'): Promise<number> {
    const matches = await this._matches.findAll({
      where: { [query]: id },
    });

    const drawMatches = matches
      .filter(({ homeTeamGoals, awayTeamGoals }) => homeTeamGoals === awayTeamGoals)
      .length;

    this.getPoints(drawMatches, 'D');
    return drawMatches;
  }

  private async getLosses(id: number, query: 'homeTeamId' | 'awayTeamId'): Promise<number> {
    const matches = await this._matches.findAll({
      where: { [query]: id },
    });

    return matches
      .filter(({ homeTeamGoals, awayTeamGoals }) => homeTeamGoals < awayTeamGoals)
      .length;
  }

  private async getGoalsFavor(id: number, query: 'homeTeamId' | 'awayTeamId'): Promise<number> {
    const matches = await this._matches.findAll({ where: { id } });
    return matches.reduce((total, { homeTeamGoals, awayTeamGoals }) => {
      if (query === 'homeTeamId') return total + homeTeamGoals;

      return total + awayTeamGoals;
    }, 0);
  }

  private async getGoalsOwn(id: number, query: 'homeTeamId' | 'awayTeamId'): Promise<number> {
    const matchs = await this._matches.findAll({ where: { id } });
    return matchs.reduce((total, { homeTeamGoals, awayTeamGoals }) => {
      if (query === 'homeTeamId') return total + awayTeamGoals;

      return total + homeTeamGoals;
    }, 0);
  }

  async leaderboard(query: 'homeTeamId' | 'awayTeamId'): Promise<ILeaderboard[]> {
    const teams = await this._team.findAll();
    const matches = await this._matches.findAll();
    return teams.map(({ id, teamName: name }) => ({
      name,
      totalPoints: this._points,
      totalGames: matches.filter((match) => (query.includes('homeTeamId')
        ? match.homeTeamId === id
        : match.awayTeamId === id)).length,
      totalVictories: this.getVictories(id, query),
      totalDraws: this.getDraws(id, query),
      totalLosses: this.getLosses(id, query),
      goalsFavor: this.getGoalsFavor(id, query),
      goalsOwn: this.getGoalsOwn(id, query),
    }));
  }
}
