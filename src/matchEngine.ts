import type { Player } from "./types/player";
import type { Team } from "./types/team";
import * as tuning from "./matchEngineTuning";

export type PossessionAction = "pass" | "shoot" | "dribble";

export interface MatchScore {
  home: number;
  away: number;
}

export interface PossessionState {
  possessionIndex: number;
  secondsRemaining: number;
  offenseKey: "home" | "away";
  defenseKey: "home" | "away";
  ballHandlerIndex: number;
  score: MatchScore;
}

export interface SimMetrics {
  possessions: number;
  fga: number;
  fgm: number;
  assists: number;
  turnoverLikeFailures: number;
}

export interface PossessionResult {
  action: PossessionAction;
  madeShot: boolean;
  points: 0 | 2 | 3;
  assisted: boolean;
  turnoverLikeFailure: boolean;
  nextState: PossessionState;
}

export interface MatchContext {
  home: Team;
  away: Team;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

export const createSeededRng = (seed: number): (() => number) => {
  let state = (seed >>> 0) || 1;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

export const getPlayerOvr = (player: Player): number =>
  average([
    player.attributes.shooting,
    player.attributes.finishing,
    player.attributes.vision,
    player.attributes.handle,
    player.attributes.athleticism,
    player.attributes.defense,
    player.attributes.rebounding,
    player.attributes.bbiq,
    player.attributes.stamina,
  ]);

export const calculateTeamOvr = (team: Team): number =>
  Math.round(average(team.roster.map(getPlayerOvr)));

const getScoreDiff = (state: PossessionState): number => state.score.home - state.score.away;

const weightedChoice = (
  options: Array<{ action: PossessionAction; weight: number }>,
  rng: () => number,
): PossessionAction => {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  const target = rng() * total;
  let accumulator = 0;
  for (const option of options) {
    accumulator += option.weight;
    if (target <= accumulator) {
      return option.action;
    }
  }
  return options[options.length - 1].action;
};

export const chooseAction = (
  ballHandler: Player,
  state: PossessionState,
  rng: () => number,
): PossessionAction => {
  const scoreDiff = Math.abs(getScoreDiff(state));
  const isLateGame = state.secondsRemaining <= 120;
  const isHighPressure = isLateGame && scoreDiff <= 8;
  const baseWeights: Record<PossessionAction, number> = tuning.baseActionWeights;
  const archetypeAdjust = tuning.archetypeWeightAdjustments[ballHandler.archetype];

  const pressureAdjust: Record<PossessionAction, number> = isHighPressure
    ? tuning.highPressureAdjustments
    : tuning.lowPressureAdjustments;

  const options: Array<{ action: PossessionAction; weight: number }> = ([
    "pass",
    "shoot",
    "dribble",
  ] as PossessionAction[]).map((action) => ({
    action,
    weight: clamp(baseWeights[action] + archetypeAdjust[action] + pressureAdjust[action], 5, 95),
  }));

  return weightedChoice(options, rng);
};

const getDefenseValue = (defenseTeam: Team): number =>
  average(
    defenseTeam.roster.map((player) => average([player.attributes.defense, player.attributes.bbiq])),
  );

const getEnergyModifier = (stamina: number): number => (stamina - 50) * tuning.energyModifierScale;
const getBbiqModifier = (bbiq: number): number => (bbiq - 50) * tuning.bbiqModifierScale;

const getVariance = (bbiq: number, rng: () => number): number => {
  // Lower BBIQ means larger uncertainty ("fog of war").
  const spread = tuning.varianceBaseSpread + ((99 - bbiq) / 99) * tuning.varianceBbiqSpread;
  return (rng() * 2 - 1) * spread;
};

const getShotMakeProbability = (shotScore: number): number =>
  clamp(
    tuning.shotMakeBase + shotScore / tuning.shotMakeDivisor,
    tuning.shotMakeMin,
    tuning.shotMakeMax,
  );

const getFailureProbability = (actionScore: number): number =>
  clamp(
    tuning.failureBase - actionScore / tuning.failureDivisor,
    tuning.failureMin,
    tuning.failureMax,
  );

const getOffenseAndDefense = (
  context: MatchContext,
  state: PossessionState,
): { offenseTeam: Team; defenseTeam: Team } =>
  state.offenseKey === "home"
    ? { offenseTeam: context.home, defenseTeam: context.away }
    : { offenseTeam: context.away, defenseTeam: context.home };

const getRandomTeammateIndex = (ballHandlerIndex: number, rng: () => number): number => {
  const teammates = [0, 1, 2, 3, 4].filter((index) => index !== ballHandlerIndex);
  const idx = Math.floor(rng() * teammates.length);
  return teammates[idx];
};

const getShotPoints = (shooter: Player, rng: () => number): 2 | 3 => {
  const threePointChance = clamp(
    (shooter.attributes.shooting - tuning.threePointOffset) / tuning.threePointDivisor,
    tuning.threePointMin,
    tuning.threePointMax,
  );
  return rng() <= threePointChance ? 3 : 2;
};

const swapPossession = (state: PossessionState, elapsedSeconds: number): PossessionState => ({
  ...state,
  possessionIndex: state.possessionIndex + 1,
  secondsRemaining: Math.max(0, state.secondsRemaining - elapsedSeconds),
  offenseKey: state.offenseKey === "home" ? "away" : "home",
  defenseKey: state.offenseKey,
  ballHandlerIndex: state.ballHandlerIndex,
});

const addPoints = (state: PossessionState, offenseKey: "home" | "away", points: 2 | 3): MatchScore => {
  if (offenseKey === "home") {
    return { ...state.score, home: state.score.home + points };
  }
  return { ...state.score, away: state.score.away + points };
};

export const simulatePossession = (
  context: MatchContext,
  state: PossessionState,
  rng: () => number,
): PossessionResult => {
  const { offenseTeam, defenseTeam } = getOffenseAndDefense(context, state);
  const ballHandler = offenseTeam.roster[state.ballHandlerIndex];
  const defenseValue = getDefenseValue(defenseTeam);
  const action = chooseAction(ballHandler, state, rng);

  let madeShot = false;
  let points: 0 | 2 | 3 = 0;
  let assisted = false;
  let turnoverLikeFailure = false;

  if (action === "shoot") {
    const shotScore =
      average([ballHandler.attributes.shooting, ballHandler.attributes.finishing]) +
      getEnergyModifier(ballHandler.attributes.stamina) +
      getBbiqModifier(ballHandler.attributes.bbiq) -
      defenseValue -
      getVariance(ballHandler.attributes.bbiq, rng);

    madeShot = rng() <= getShotMakeProbability(shotScore);
    if (madeShot) {
      points = getShotPoints(ballHandler, rng);
    }
  } else if (action === "pass") {
    const targetIndex = getRandomTeammateIndex(state.ballHandlerIndex, rng);
    const receiver = offenseTeam.roster[targetIndex];
    const actionScore =
      average([ballHandler.attributes.vision, ballHandler.attributes.handle, ballHandler.attributes.bbiq]) +
      getEnergyModifier(ballHandler.attributes.stamina) -
      defenseValue -
      getVariance(ballHandler.attributes.bbiq, rng);

    const passFailure = rng() <= getFailureProbability(actionScore);
    if (passFailure) {
      turnoverLikeFailure = true;
    } else {
      const receiverShotScore =
        average([receiver.attributes.shooting, receiver.attributes.finishing]) +
        getEnergyModifier(receiver.attributes.stamina) +
        getBbiqModifier(receiver.attributes.bbiq) -
        defenseValue -
        getVariance(receiver.attributes.bbiq, rng);

      madeShot = rng() <= getShotMakeProbability(receiverShotScore);
      assisted = madeShot;
      if (madeShot) {
        points = getShotPoints(receiver, rng);
      }
    }
  } else {
    const actionScore =
      average([ballHandler.attributes.handle, ballHandler.attributes.athleticism, ballHandler.attributes.bbiq]) +
      getEnergyModifier(ballHandler.attributes.stamina) -
      defenseValue -
      getVariance(ballHandler.attributes.bbiq, rng);

    const dribbleFailure = rng() <= getFailureProbability(actionScore);
    if (dribbleFailure) {
      turnoverLikeFailure = true;
    } else {
      const finishScore =
        average([ballHandler.attributes.finishing, ballHandler.attributes.athleticism]) +
        getEnergyModifier(ballHandler.attributes.stamina) +
        getBbiqModifier(ballHandler.attributes.bbiq) -
        defenseValue -
        getVariance(ballHandler.attributes.bbiq, rng);
      madeShot = rng() <= getShotMakeProbability(finishScore);
      if (madeShot) {
        points = 2;
      }
    }
  }

  const elapsedSeconds = Math.floor(
    tuning.minEventSeconds + rng() * (tuning.maxEventSeconds - tuning.minEventSeconds + 1),
  );
  const updatedScore =
    points === 2 || points === 3 ? addPoints(state, state.offenseKey, points) : state.score;
  const nextState = swapPossession({ ...state, score: updatedScore }, elapsedSeconds);

  return {
    action,
    madeShot,
    points,
    assisted,
    turnoverLikeFailure,
    nextState,
  };
};

export const initializePossession = (
  context: MatchContext,
  rng: () => number,
  secondsRemaining = 20 * 60,
): PossessionState => {
  const homeOvr = calculateTeamOvr(context.home);
  const awayOvr = calculateTeamOvr(context.away);
  const homeControlChance = clamp(homeOvr / (homeOvr + awayOvr), 0.35, 0.65);
  const homeHasBall = rng() <= homeControlChance;
  return {
    possessionIndex: 1,
    secondsRemaining,
    offenseKey: homeHasBall ? "home" : "away",
    defenseKey: homeHasBall ? "away" : "home",
    ballHandlerIndex: Math.floor(rng() * 5),
    score: { home: 0, away: 0 },
  };
};

export const runPossessionBatch = (
  context: MatchContext,
  possessions: number,
  seed: number,
): { finalState: PossessionState; metrics: SimMetrics } => {
  const rng = createSeededRng(seed);
  let state = initializePossession(context, rng);
  const metrics: SimMetrics = {
    possessions: 0,
    fga: 0,
    fgm: 0,
    assists: 0,
    turnoverLikeFailures: 0,
  };

  for (let i = 0; i < possessions && state.secondsRemaining > 0; i += 1) {
    const result = simulatePossession(context, state, rng);
    metrics.possessions += 1;
    if (!result.turnoverLikeFailure) {
      metrics.fga += 1;
    }
    if (result.madeShot) {
      metrics.fgm += 1;
    }
    if (result.assisted) {
      metrics.assists += 1;
    }
    if (result.turnoverLikeFailure) {
      metrics.turnoverLikeFailures += 1;
    }
    state = {
      ...result.nextState,
      ballHandlerIndex: Math.floor(rng() * 5),
    };
  }

  return { finalState: state, metrics };
};
