export type TranslationId = "KJV" | "WEB" | "ESV" | "NIV" | "NKJV";

/** A scripture reference. Text is looked up from content/verses.json (KJV/WEB) and content/modern.ts. */
export interface Ref {
  ref: string;
}

export interface ThreadItem extends Ref {
  /** One or two sentences: how this passage explains the key verse. */
  note: string;
}

export interface Voice {
  who: string;
  work: string;
  note: string;
  url?: string;
}

export interface MindBlock {
  title: string;
  body: string[];
  /** Who said it / where to read more. Kept honest and specific. */
  source: string;
  sourceUrl?: string;
}

export type GameSpec =
  | { type: "builder"; ref?: string }
  | { type: "thread" }
  | { type: "armor" }
  | { type: "crossroads"; scenario: string };

export interface Milestone {
  id: string;
  stage: string;
  slug: string;
  order: number;
  title: string;
  tagline: string;
  keyVerse: string;
  alsoRead?: string[];
  revelation: string[];
  thread: ThreadItem[];
  voices: Voice[];
  mind: MindBlock;
  body: { title: string; body: string };
  challenge: { title: string; body: string };
  reflect: string;
  game: GameSpec;
  /** id from content/art.ts */
  art?: string;
}

export interface Stage {
  id: string;
  number: number;
  name: string;
  place: string;
  subtitle: string;
  /** The Exodus/Joshua story this stage walks through. */
  story: string;
  storyRef: string;
  blurb: string;
  /** Sky gradient: top, bottom. Moves from night to dawn as the journey advances. */
  sky: [string, string];
  accent: string;
  art?: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  date: string;
  /** relative to /art */
  file: string;
  story: string;
  source: string;
  license: string;
  /** Which stage it best belongs to (optional). */
  stage?: string;
}

export interface Testimony {
  id: string;
  name: string;
  era: string;
  kind: "scripture" | "history" | "modern";
  struggle: string;
  summary: string[];
  turning: string;
  verse?: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface Question {
  id: string;
  q: string;
  short: string;
  answer: string[];
  verses: string[];
  stages: { stage: string; slug: string }[];
}

export interface StudyPlanDay {
  day: number;
  title: string;
  /** Chapter(s) to read, e.g. "Exodus 12". Linked out to a full Bible text. */
  read: string;
  /** One short verse to hold for the day. Shown inline. */
  verse: string;
  focus: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  blurb: string;
  days: StudyPlanDay[];
}
