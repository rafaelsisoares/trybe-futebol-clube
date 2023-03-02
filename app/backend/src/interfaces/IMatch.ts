interface IMatch {
  id: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

interface IMatchWithTeamName extends IMatch {
  homeTeam: {
    teamName: string;
  }
  awayTeam: {
    teamName: string;
  }
}

export {
  IMatch,
  IMatchWithTeamName,
};
