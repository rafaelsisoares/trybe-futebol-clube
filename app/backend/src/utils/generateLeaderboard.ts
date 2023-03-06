import ITeam from '../interfaces/ITeam';
import { ILeaderboardExtended, TQuery } from '../interfaces/ILeaderboard';
import { IMatch } from '../interfaces/IMatch';

let totalPoints = 0;
let filteredMatches: IMatch[] = [];

const filterMatches = (id: number, matches: IMatch[], query: TQuery) => {
  filteredMatches = matches.filter(
    ({ homeTeamId, awayTeamId }) =>
      (query === 'homeTeamId' ? homeTeamId === id : awayTeamId === id),
  );
};

const getPoints = (params: number, query: 'V' | 'D'): void => {
  totalPoints += query === 'V' ? params * 3 : params;
};

const getVictories = (query: TQuery): number => {
  const winMatches = filteredMatches.filter(
    ({ homeTeamGoals, awayTeamGoals }) => (
      query === 'homeTeamId'
        ? homeTeamGoals > awayTeamGoals
        : awayTeamGoals > homeTeamGoals
    ),
  ).length;

  getPoints(winMatches, 'V');

  return winMatches;
};

const getDraws = (query: TQuery): number => {
  const drawMatches = filteredMatches.filter(
    ({ homeTeamGoals, awayTeamGoals }) => (
      query === 'homeTeamId'
        ? homeTeamGoals === awayTeamGoals
        : awayTeamGoals === homeTeamGoals
    ),
  ).length;

  getPoints(drawMatches, 'D');
  return drawMatches;
};

const getLosses = (query: TQuery): number => filteredMatches.filter(
  ({ homeTeamGoals, awayTeamGoals }) => (
    query === 'homeTeamId'
      ? homeTeamGoals < awayTeamGoals
      : awayTeamGoals < homeTeamGoals
  ),
).length;

const getGoalsFavor = (query: TQuery): number => filteredMatches
  .reduce((total, { homeTeamGoals, awayTeamGoals }) => {
    if (query === 'homeTeamId') return total + homeTeamGoals;

    return total + awayTeamGoals;
  }, 0);

const getGoalsOwn = (query: TQuery): number => filteredMatches
  .reduce((total, { homeTeamGoals, awayTeamGoals }) => {
    if (query === 'homeTeamId') return total + awayTeamGoals;

    return total + homeTeamGoals;
  }, 0);

const calculateEfficiency = (pts: number, games: number): number => {
  const efficiency = (pts / (games * 3)) * 100;
  return +efficiency.toFixed(2);
};

const getGoalsBalance = (gp: number, gc: number): number => gp - gc;

const getLeaderboard = (matches: IMatch[], teams: ITeam[], query?: TQuery) => {
  const leaderboard: ILeaderboardExtended[] = teams.map(({ id, teamName: name }) => {
    filterMatches(id, matches, query);
    totalPoints = 0;
    return {
      name,
      totalGames: filteredMatches.length,
      totalVictories: getVictories(query),
      totalDraws: getDraws(query),
      totalLosses: getLosses(query),
      goalsFavor: getGoalsFavor(query),
      goalsOwn: getGoalsOwn(query),
      totalPoints,
      goalsBalance: getGoalsBalance(getGoalsFavor(query), getGoalsOwn(query)),
      efficiency: calculateEfficiency(totalPoints, filteredMatches.length),
    };
  });

  return leaderboard;
};

const completeGeneral = (arr: ILeaderboardExtended[]): ILeaderboardExtended[] => {
  const leaderboard = arr;
  leaderboard.forEach((team, i) => {
    leaderboard[i].goalsBalance = getGoalsBalance(
      team.goalsFavor,
      team.goalsOwn,
    );
    leaderboard[i].efficiency = calculateEfficiency(
      team.totalPoints,
      team.totalGames,
    );
  });

  return leaderboard;
};

const getGeneralLeaderboard = (matches: IMatch[], teams: ITeam[]): ILeaderboardExtended[] => {
  const home = getLeaderboard(matches, teams, 'homeTeamId');
  const away = getLeaderboard(matches, teams, 'awayTeamId');

  const general = home.map((team, i) => ({
    name: team.name,
    totalGames: team.totalGames + away[i].totalGames,
    totalVictories: team.totalVictories + away[i].totalVictories,
    totalDraws: team.totalDraws + away[i].totalDraws,
    totalLosses: team.totalLosses + away[i].totalLosses,
    goalsFavor: team.goalsFavor + away[i].goalsFavor,
    goalsOwn: team.goalsOwn + away[i].goalsOwn,
    totalPoints: team.totalPoints + away[i].totalPoints,
    goalsBalance: 0,
    efficiency: 0,
  }));

  return completeGeneral(general);
};

export {
  getLeaderboard,
  getGeneralLeaderboard,
};
