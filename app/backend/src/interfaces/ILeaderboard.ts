export default interface ILeaderboard {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: Promise<number>;
  totalDraws: Promise<number>;
  totalLosses: Promise<number>;
  goalsFavor: Promise<number>;
  goalsOwn: Promise<number>;
}

export interface ILeaderboardExtended extends ILeaderboard {
  goalsBalance: number;
  efficiency: number;
}
