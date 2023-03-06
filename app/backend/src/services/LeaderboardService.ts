import { ModelStatic } from 'sequelize';
import { getGeneralLeaderboard, getLeaderboard } from '../utils/generateLeaderboard';
import MatchesModel from '../database/models/MatchesModel';
import TeamModel from '../database/models/TeamModel';
import { ILeaderboardExtended, TQuery } from '../interfaces/ILeaderboard';
import sortLeaderboard from '../utils/sortLeaderboard';
import ITeam from '../interfaces/ITeam';

export default class LeaderboardService {
  private _team: ModelStatic<TeamModel> = TeamModel;
  private _matches: ModelStatic<MatchesModel> = MatchesModel;
  private _allMatches: MatchesModel[] = [];
  private _teams: ITeam[] = [];

  constructor() {
    this.getAllTeams();
  }

  private async getAllMatches(): Promise<void> {
    this._allMatches = await this._matches.findAll({
      where: { inProgress: false },
    });
  }

  private async getAllTeams(): Promise<void> {
    this._teams = await this._team.findAll();
  }

  async leaderboard(query: TQuery): Promise<ILeaderboardExtended[]> {
    this.getAllMatches();
    const leaderboard = getLeaderboard(this._allMatches, this._teams, query);
    return sortLeaderboard(leaderboard);
  }

  async generalLeaderboard(): Promise<ILeaderboardExtended[]> {
    this.getAllMatches();
    const generalLeaderboard = getGeneralLeaderboard(this._allMatches, this._teams);
    return sortLeaderboard(generalLeaderboard);
  }
}
