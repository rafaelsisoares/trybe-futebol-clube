import { ILeaderboardExtended } from '../interfaces/ILeaderboard';

const sortByGoalsOwn = (
  team1: ILeaderboardExtended,
  team2: ILeaderboardExtended,
): ILeaderboardExtended => (team1.goalsOwn > team2.goalsOwn ? team2 : team1);

const sortByGoalsFavor = (
  team1: ILeaderboardExtended,
  team2: ILeaderboardExtended,
): ILeaderboardExtended => {
  if (team1.goalsFavor === team2.goalsFavor) {
    return sortByGoalsOwn(team1, team2);
  }

  return team1.goalsFavor < team2.goalsFavor
    ? team2
    : team1;
};

const sortByGoalsBalance = (
  team1: ILeaderboardExtended,
  team2: ILeaderboardExtended,
): ILeaderboardExtended => {
  if (team1.goalsBalance === team2.goalsBalance) {
    return sortByGoalsFavor(team1, team2);
  }

  return team1.goalsBalance < team2.goalsBalance
    ? team2
    : team1;
};

const sortByVictories = (
  team1: ILeaderboardExtended,
  team2: ILeaderboardExtended,
): ILeaderboardExtended => {
  if (team1.totalVictories === team2.totalVictories) {
    return sortByGoalsBalance(team1, team2);
  }

  return team1.totalVictories < team2.totalVictories
    ? team2
    : team1;
};

const sortLeaderboard = (
  leaderboard: ILeaderboardExtended[],
): ILeaderboardExtended[] => {
  const table = leaderboard;
  let team: ILeaderboardExtended | null = null;
  for (let i = 0; i < table.length; i += 1) {
    for (let j = 0; j < (table.length - i - 1); j += 1) {
      if (table[j].totalPoints === table[j + 1].totalPoints) {
        team = sortByVictories(table[j], table[j + 1]);
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
};

export default sortLeaderboard;
