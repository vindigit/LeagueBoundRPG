import type { Player } from "./player";

export enum LeagueLevel {
  MIDDLE_SCHOOL = "MIDDLE_SCHOOL",
  HIGH_SCHOOL = "HIGH_SCHOOL",
  COLLEGE = "COLLEGE",
  PRO = "PRO",
}

export enum CareerStatus {
  ACTIVE = "ACTIVE",
  INJURED = "INJURED",
  RETIRED = "RETIRED",
  AMATEUR_LOCKED = "AMATEUR_LOCKED",
}

export interface CareerState {
  player: Player;
  leagueLevel: LeagueLevel;
  status: CareerStatus;
  currentYear: number;
  seasonNumber: number;
  currentWeek: number;
  teamId: string | null;
  isGoatPath: boolean;
}

export interface CareerActions {
  advanceWeek(): void;
  advanceSeason(): void;
  updateLeagueLevel(level: LeagueLevel): void;
  updateStatus(status: CareerStatus): void;
  setCurrentWeek(week: number): void;
  setTeam(teamId: string | null): void;
  setGoatPath(isGoatPath: boolean): void;
  setCurrentYear(year: number): void;
  hydrateCareer(state: CareerState): void;
  resetCareer(state: CareerState): void;
}
