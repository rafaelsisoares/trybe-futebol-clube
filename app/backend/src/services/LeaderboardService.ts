import { ModelStatic } from 'sequelize';
import MatchesModel from '../database/models/MatchesModel';
import TeamModel from '../database/models/TeamModel';
import ILeaderboard from '../interfaces/ILeaderboard';

export default class LeaderboardService {
  private _team: ModelStatic<TeamModel> = TeamModel;
  private _matches: ModelStatic<MatchesModel> = MatchesModel;
  private _points = 0;
  private _allMatches: MatchesModel[] = [];

  private async getAllMatches(): Promise<void> {
    this._allMatches = await this._matches.findAll();
  }

  private filterMatches(id: number, query: 'homeTeamId' | 'awayTeamId') {
    return this._allMatches.filter(({ homeTeamId, awayTeamId, inProgress }) => (
      query === 'homeTeamId' ? homeTeamId === id : awayTeamId === id
    ) && inProgress === false);
  }

  private getPoints(params: number, query: 'V' | 'D'): void {
    this._points += query === 'V' ? params * 3 : params;
  }

  private getVictories(id: number, query: 'homeTeamId' | 'awayTeamId'): number {
    const targetMatches = this.filterMatches(id, query);

    const winMatches = targetMatches
      .filter(({ homeTeamGoals, awayTeamGoals }) => homeTeamGoals > awayTeamGoals)
      .length;

    this.getPoints(winMatches, 'V');

    return winMatches;
  }

  private getDraws(id: number, query: 'homeTeamId' | 'awayTeamId'): number {
    const targetMatches = this.filterMatches(id, query);

    const drawMatches = targetMatches
      .filter(({ homeTeamGoals, awayTeamGoals }) => homeTeamGoals === awayTeamGoals)
      .length;

    this.getPoints(drawMatches, 'D');
    return drawMatches;
  }

  private getLosses(id: number, query: 'homeTeamId' | 'awayTeamId'): number {
    const matches = this.filterMatches(id, query);

    return matches
      .filter(({ homeTeamGoals, awayTeamGoals }) => homeTeamGoals < awayTeamGoals)
      .length;
  }

  private getGoalsFavor(id: number, query: 'homeTeamId' | 'awayTeamId'): number {
    const matches = this.filterMatches(id, query);
    return matches.reduce((total, { homeTeamGoals, awayTeamGoals }) => {
      if (query === 'homeTeamId') return total + homeTeamGoals;

      return total + awayTeamGoals;
    }, 0);
  }

  private getGoalsOwn(id: number, query: 'homeTeamId' | 'awayTeamId'): number {
    const matchs = this.filterMatches(id, query);
    return matchs.reduce((total, { homeTeamGoals, awayTeamGoals }) => {
      if (query === 'homeTeamId') return total + awayTeamGoals;

      return total + homeTeamGoals;
    }, 0);
  }

  async leaderboard(query: 'homeTeamId' | 'awayTeamId'): Promise<ILeaderboard[]> {
    await this.getAllMatches();
    const teams = await this._team.findAll();

    return teams.map(({ id, teamName: name }) => {
      this._points = 0;
      return {
        name,
        totalGames: this.filterMatches(id, query).length,
        totalVictories: this.getVictories(id, query),
        totalDraws: this.getDraws(id, query),
        totalLosses: this.getLosses(id, query),
        goalsFavor: this.getGoalsFavor(id, query),
        goalsOwn: this.getGoalsOwn(id, query),
        totalPoints: this._points,
      };
    });
  }
}
