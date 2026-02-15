import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  CareerStatus,
  LeagueLevel,
  type CareerActions,
  type CareerState,
} from "../types/career";
import type { Player } from "../types/player";

type CareerStore = CareerState & CareerActions;

const defaultPlayer: Player = {
  id: "",
  name: "",
  age: 0,
  BankBalance: 0,
  Morale: 0,
  Position: "PG",
  archetype: "Slasher",
  attributes: {
    shooting: 0,
    finishing: 0,
    vision: 0,
    handle: 0,
    athleticism: 0,
    defense: 0,
    rebounding: 0,
    bbiq: 0,
    stamina: 0,
  },
  gameStats: {
    points: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    blocks: 0,
    fga: 0,
    fgm: 0,
  },
};

const initialCareerState: CareerState = {
  player: defaultPlayer,
  leagueLevel: LeagueLevel.MIDDLE_SCHOOL,
  status: CareerStatus.ACTIVE,
  currentYear: 2026,
  seasonNumber: 1,
  currentWeek: 1,
  teamId: null,
  isGoatPath: false,
};

export const useCareerStore = create<CareerStore>()(
  persist(
    (set, get) => ({
      ...initialCareerState,
      advanceWeek: () => {
        set((state) => ({ currentWeek: state.currentWeek + 1 }));
      },
      advanceSeason: () => {
        set((state) => ({
          seasonNumber: state.seasonNumber + 1,
          currentWeek: 1,
        }));
      },
      updateLeagueLevel: (level) => {
        set(() => ({ leagueLevel: level }));
      },
      updateStatus: (status) => {
        set(() => ({ status }));
      },
      setCurrentWeek: (week) => {
        set(() => ({ currentWeek: week }));
      },
      setTeam: (teamId) => {
        set(() => ({ teamId }));
      },
      setGoatPath: (isGoatPath) => {
        set(() => ({ isGoatPath }));
      },
      setCurrentYear: (year) => {
        set(() => ({ currentYear: year }));
      },
      hydrateCareer: (state) => {
        set(() => ({ ...state }));
      },
      resetCareer: (state) => {
        set(() => ({ ...state }));
      },
    }),
    {
      name: "leaguebound-career-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        player: state.player,
        leagueLevel: state.leagueLevel,
        status: state.status,
        currentYear: state.currentYear,
        seasonNumber: state.seasonNumber,
        currentWeek: state.currentWeek,
        teamId: state.teamId,
        isGoatPath: state.isGoatPath,
      }),
    },
  ),
);
