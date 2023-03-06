import { ModelStatic } from 'sequelize';
import MatchesModel from '../database/models/MatchesModel';
import TeamModel from '../database/models/TeamModel';
import { ILeaderboardExtended } from '../interfaces/ILeaderboard';

export default class LeaderboardService {
  private _team: ModelStatic<TeamModel> = TeamModel;
  private _matches: ModelStatic<MatchesModel> = MatchesModel;
  private _points = 0;
  private _allMatches: MatchesModel[] = [];

  private async getAllMatches(): Promise<void> {
    this._allMatches = await this._matches.findAll({
      where: { inProgress: false },
    });
  }

  private filterMatches(id: number, query: 'homeTeamId' | 'awayTeamId') {
    return this._allMatches.filter(
      ({ homeTeamId, awayTeamId }) =>
        (query === 'homeTeamId' ? homeTeamId === id : awayTeamId === id),
    );
  }

  private getPoints(params: number, query: 'V' | 'D'): void {
    this._points += query === 'V' ? params * 3 : params;
  }

  private getVictories(id: number, query: 'homeTeamId' | 'awayTeamId'): number {
    const targetMatches = this.filterMatches(id, query);

    const winMatches = targetMatches.filter(
      ({ homeTeamGoals, awayTeamGoals }) => (
        query === 'homeTeamId'
          ? homeTeamGoals > awayTeamGoals
          : awayTeamGoals > homeTeamGoals
      ),
    ).length;

    this.getPoints(winMatches, 'V');

    return winMatches;
  }

  private getDraws(id: number, query: 'homeTeamId' | 'awayTeamId'): number {
    const targetMatches = this.filterMatches(id, query);

    const drawMatches = targetMatches.filter(
      ({ homeTeamGoals, awayTeamGoals }) => (
        query === 'homeTeamId'
          ? homeTeamGoals === awayTeamGoals
          : awayTeamGoals === homeTeamGoals
      ),
    ).length;

    this.getPoints(drawMatches, 'D');
    return drawMatches;
  }

  private getLosses(id: number, query: 'homeTeamId' | 'awayTeamId'): number {
    const matches = this.filterMatches(id, query);

    return matches.filter(
      ({ homeTeamGoals, awayTeamGoals }) => (
        query === 'homeTeamId'
          ? homeTeamGoals < awayTeamGoals
          : awayTeamGoals < homeTeamGoals
      ),
    ).length;
  }

  private getGoalsFavor(
    id: number,
    query: 'homeTeamId' | 'awayTeamId',
  ): number {
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

  private static calculateEfficiency(points: number, games: number): number {
    const efficiency = (points / (games * 3)) * 100;
    return +efficiency.toFixed(2);
  }

  private static getGoalsBalance(gp: number, gc: number): number {
    return gp - gc;
  }

  private static sortByGoalsOwn(
    team1: ILeaderboardExtended,
    team2: ILeaderboardExtended,
  ): ILeaderboardExtended {
    return team1.goalsOwn > team2.goalsOwn ? team2 : team1;
  }

  private static sortByGoalsFavor(
    team1: ILeaderboardExtended,
    team2: ILeaderboardExtended,
  ): ILeaderboardExtended {
    if (team1.goalsFavor === team2.goalsFavor) {
      return LeaderboardService.sortByGoalsOwn(team1, team2);
    }

    return team1.goalsFavor < team2.goalsFavor
      ? team2
      : team1;
  }

  private static sortByGoalsBalance(
    team1: ILeaderboardExtended,
    team2: ILeaderboardExtended,
  ): ILeaderboardExtended {
    if (team1.goalsBalance === team2.goalsBalance) {
      return LeaderboardService.sortByGoalsFavor(team1, team2);
    }

    return team1.goalsBalance < team2.goalsBalance
      ? team2
      : team1;
  }

  private static sortByVictories(
    team1: ILeaderboardExtended,
    team2: ILeaderboardExtended,
  ): ILeaderboardExtended {
    if (team1.totalVictories === team2.totalVictories) {
      return LeaderboardService.sortByGoalsBalance(team1, team2);
    }

    return team1.totalVictories < team2.totalVictories
      ? team2
      : team1;
  }

  private static sortLeaderboard(
    leaderboard: ILeaderboardExtended[],
  ): ILeaderboardExtended[] {
    const table = leaderboard;
    let team: ILeaderboardExtended | null = null;
    for (let i = 0; i < table.length; i += 1) {
      for (let j = 0; j < (table.length - i - 1); j += 1) {
        if (table[j].totalPoints === table[j + 1].totalPoints) {
          team = LeaderboardService.sortByVictories(table[j], table[j + 1]);
        }

        if (table[j].totalPoints < table[j + 1].totalPoints
          || team === table[j + 1]) {
          const swap = table[j];
          table[j] = table[j + 1];
          table[j + 1] = swap;
        }
      }
    }

    return table.sort((a, b) => b.totalPoints - a.totalPoints);
  }

  async leaderboard(query: 'homeTeamId' | 'awayTeamId'): Promise<ILeaderboardExtended[]> {
    await this.getAllMatches();
    const teams = await this._team.findAll();

    const leaderboard: ILeaderboardExtended[] = teams.map(({ id, teamName: name }, i) => {
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
        goalsBalance: this.getGoalsFavor(id, query) - this.getGoalsOwn(id, query),
        efficiency: LeaderboardService.calculateEfficiency(this._points, leaderboard[i].totalGames),
      };
    });

    return LeaderboardService.sortLeaderboard(leaderboard);
  }

  async generalLeaderboard(): Promise<ILeaderboardExtended[]> {
    const home = await this.leaderboard('homeTeamId');
    const away = await this.leaderboard('awayTeamId');

    const general: ILeaderboardExtended[] = home.map((team, i) => ({
      name: team.name,
      totalGames: team.totalGames + away[i].totalGames,
      totalVictories: team.totalVictories + away[i].totalVictories,
      totalDraws: team.totalDraws + away[i].totalDraws,
      totalLosses: team.totalLosses + away[i].totalLosses,
      goalsFavor: team.goalsFavor + away[i].goalsFavor,
      goalsOwn: team.goalsOwn + away[i].goalsOwn,
      totalPoints: team.totalPoints + away[i].totalPoints,
      goalsBalance: LeaderboardService.getGoalsBalance(general[i].goalsFavor, general[i].goalsOwn),
      efficiency: LeaderboardService.calculateEfficiency(
        general[i].totalPoints,
        general[i].totalGames,
      ),
    }));

    return LeaderboardService.sortLeaderboard(general);
  }
}
