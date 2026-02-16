import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Compiler } from "inkjs/full";
import { useCareerStore } from "../store/useCareerStore";
import type { PlayerAttributes } from "../types/player";

const ATTRIBUTE_KEYS: ReadonlyArray<keyof PlayerAttributes> = [
  "shooting",
  "finishing",
  "vision",
  "handle",
  "athleticism",
  "defense",
  "rebounding",
  "bbiq",
  "stamina",
];

const ACTION_PREFIX = "ACTION:";

export interface InkChoice {
  index: number;
  text: string;
}

export interface InkStoryState {
  lines: string[];
  tags: string[];
  choices: InkChoice[];
  canContinue: boolean;
}

interface UpdateAttributeAction {
  type: "updateAttribute";
  attributeKey: keyof PlayerAttributes;
  amount: number;
}

type ParsedAction = UpdateAttributeAction;

interface InkStoryLike {
  canContinue: boolean;
  currentTags: string[];
  currentChoices: Array<{ text: string }>;
  Continue(): string;
  ChooseChoiceIndex(index: number): void;
}

const isAttributeKey = (value: string): value is keyof PlayerAttributes =>
  ATTRIBUTE_KEYS.includes(value as keyof PlayerAttributes);

const parseActionTag = (tag: string): ParsedAction | null => {
  const trimmedTag = tag.trim();
  if (!trimmedTag.startsWith(ACTION_PREFIX)) {
    return null;
  }

  const actionBody = trimmedTag.slice(ACTION_PREFIX.length).trim().replace(/\\\|/g, "|");
  const parts = actionBody.split("|").map((part) => part.trim());
  if (parts.length !== 3) {
    throw new Error(`Invalid ACTION tag format: "${tag}"`);
  }

  const [actionType, key, rawValue] = parts;
  if (actionType !== "updateAttribute") {
    throw new Error(`Unsupported ACTION type "${actionType}" in tag "${tag}"`);
  }

  if (!isAttributeKey(key)) {
    throw new Error(`Unknown attribute key "${key}" in tag "${tag}"`);
  }

  const amount = Number(rawValue);
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid ACTION value "${rawValue}" in tag "${tag}"`);
  }

  return {
    type: "updateAttribute",
    attributeKey: key,
    amount,
  };
};

const applyAction = (action: ParsedAction): void => {
  if (action.type === "updateAttribute") {
    useCareerStore.getState().updateAttribute(action.attributeKey, action.amount);
  }
};

const processTags = (tags: string[]): void => {
  for (const tag of tags) {
    const action = parseActionTag(tag);
    if (action) {
      applyAction(action);
    }
  }
};

const toChoices = (story: InkStoryLike): InkChoice[] =>
  story.currentChoices.map((choice, index) => ({
    index,
    text: choice.text,
  }));

const normalizeInkSourceForCompiler = (inkSource: string): string => {
  const escapedActionTags = inkSource.replace(
    /^(\s*#\s*ACTION:\s*updateAttribute)\s+\|\s+(.+?)\s+\|\s+(.+)\s*$/gm,
    "$1 \\| $2 \\| $3",
  );

  const firstNonEmptyLine = escapedActionTags
    .split(/\r?\n/)
    .find((line) => line.trim().length > 0);

  if (firstNonEmptyLine?.trim().startsWith("-> ")) {
    return escapedActionTags;
  }

  return `-> coach_aside\n\n${escapedActionTags}`;
};

export class InkManager {
  private readonly story: InkStoryLike;

  public constructor(story: InkStoryLike) {
    this.story = story;
  }

  public continueStory(): InkStoryState {
    const lines: string[] = [];
    const tags: string[] = [];

    while (this.story.canContinue) {
      const line = this.story.Continue().trim();
      if (line.length > 0) {
        lines.push(line);
      }

      const currentTags = [...this.story.currentTags];
      if (currentTags.length > 0) {
        tags.push(...currentTags);
        processTags(currentTags);
      }
    }

    return {
      lines,
      tags,
      choices: toChoices(this.story),
      canContinue: this.story.canContinue,
    };
  }

  public chooseOption(index: number): InkStoryState {
    if (!Number.isInteger(index) || index < 0 || index >= this.story.currentChoices.length) {
      throw new Error(`Choice index ${index} is out of range.`);
    }

    this.story.ChooseChoiceIndex(index);
    return this.continueStory();
  }
}

const createStoryFromInkSource = (inkSource: string): InkStoryLike => {
  const compiler = new Compiler(inkSource) as {
    Compile(): InkStoryLike;
    errors?: string[];
    warnings?: string[];
  };
  try {
    return compiler.Compile();
  } catch (error) {
    const errors = compiler.errors?.join("\n");
    const warnings = compiler.warnings?.join("\n");
    const details = [errors, warnings].filter(Boolean).join("\n");
    const message = details.length > 0 ? `${(error as Error).message}\n${details}` : (error as Error).message;
    throw new Error(message);
  }
};

const defaultInkPath = fileURLToPath(new URL("./practice_coach.ink", import.meta.url));
const narrativeDirectoryPath = fileURLToPath(new URL("./", import.meta.url));

export const loadPracticeCoachInkManager = (inkPath = defaultInkPath): InkManager => {
  const inkSource = readFileSync(inkPath, "utf8");
  const normalizedInkSource = normalizeInkSourceForCompiler(inkSource);
  const story = createStoryFromInkSource(normalizedInkSource);
  return new InkManager(story);
};

export const loadNarrativeInkManager = (fileName: string): InkManager => {
  const sanitizedName = fileName.trim();
  if (sanitizedName.length === 0) {
    throw new Error("Narrative file name must not be empty.");
  }

  const inkPath = resolve(narrativeDirectoryPath, sanitizedName);
  return loadPracticeCoachInkManager(inkPath);
};
