"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Walk = "walked" | "wavered" | "fell" | "na";

export interface MilestoneProgress {
  gameWon?: boolean;
  sealed?: boolean;
  challengeDone?: boolean;
  updatedAt: string;
}

export interface Checkin {
  id: string;
  date: string; // YYYY-MM-DD
  mind: Walk;
  purity: Walk;
  substances: Walk;
  note?: string;
  noteShared?: boolean;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  milestoneId?: string;
  prompt?: string;
  body: string;
  shared: boolean;
}

export interface AppState {
  v: 1;
  name: string;
  milestones: Record<string, MilestoneProgress>;
  checkins: Record<string, Checkin>; // keyed by date
  journal: Record<string, JournalEntry>;
  plans: Record<string, number[]>;
  stonesSeen: string[];
  armor: string[];
  hydrated: boolean;
}

export type Action =
  | { type: "hydrate"; state: Partial<AppState> }
  | { type: "merge"; state: Partial<AppState> }
  | { type: "setName"; name: string }
  | { type: "milestone"; id: string; patch: Partial<Omit<MilestoneProgress, "updatedAt">> }
  | { type: "checkin"; checkin: Checkin }
  | { type: "journal"; entry: JournalEntry }
  | { type: "journalDelete"; id: string }
  | { type: "plan"; plan: string; days: number[] }
  | { type: "stoneSeen"; id: string }
  | { type: "armor"; pieces: string[] };

const STORAGE_KEY = "purity:v1";

const initial: AppState = {
  v: 1,
  name: "",
  milestones: {},
  checkins: {},
  journal: {},
  plans: {},
  stonesSeen: [],
  armor: [],
  hydrated: false,
};

const newer = (a?: string, b?: string) => (a ?? "") >= (b ?? "");

/** Merge two states, preferring whichever entity was updated most recently. */
function mergeStates(a: AppState, b: Partial<AppState>): AppState {
  const out: AppState = { ...a };
  if (b.name && !a.name) out.name = b.name;
  if (b.milestones) {
    out.milestones = { ...a.milestones };
    for (const [id, p] of Object.entries(b.milestones)) {
      const mine = out.milestones[id];
      if (!mine) out.milestones[id] = p;
      else
        out.milestones[id] = newer(mine.updatedAt, p.updatedAt)
          ? { ...p, ...mine, gameWon: mine.gameWon || p.gameWon, sealed: mine.sealed || p.sealed }
          : { ...mine, ...p, gameWon: mine.gameWon || p.gameWon, sealed: mine.sealed || p.sealed };
    }
  }
  if (b.checkins) {
    out.checkins = { ...a.checkins };
    for (const [d, c] of Object.entries(b.checkins)) {
      const mine = out.checkins[d];
      if (!mine || !newer(mine.updatedAt, c.updatedAt)) out.checkins[d] = c;
    }
  }
  if (b.journal) {
    out.journal = { ...a.journal };
    for (const [id, e] of Object.entries(b.journal)) {
      const mine = out.journal[id];
      if (!mine || !newer(mine.updatedAt, e.updatedAt)) out.journal[id] = e;
    }
  }
  if (b.plans) {
    out.plans = { ...a.plans };
    for (const [id, days] of Object.entries(b.plans)) {
      out.plans[id] = Array.from(new Set([...(out.plans[id] ?? []), ...days])).sort((x, y) => x - y);
    }
  }
  if (b.stonesSeen) out.stonesSeen = Array.from(new Set([...a.stonesSeen, ...b.stonesSeen]));
  if (b.armor) out.armor = Array.from(new Set([...a.armor, ...b.armor]));
  return out;
}

export function reducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString();
  switch (action.type) {
    case "hydrate":
      return { ...mergeStates(initial, action.state), hydrated: true };
    case "merge":
      return mergeStates(state, action.state);
    case "setName":
      return { ...state, name: action.name };
    case "milestone": {
      const prev = state.milestones[action.id] ?? { updatedAt: now };
      return {
        ...state,
        milestones: { ...state.milestones, [action.id]: { ...prev, ...action.patch, updatedAt: now } },
      };
    }
    case "checkin":
      return { ...state, checkins: { ...state.checkins, [action.checkin.date]: action.checkin } };
    case "journal":
      return { ...state, journal: { ...state.journal, [action.entry.id]: action.entry } };
    case "journalDelete": {
      const { [action.id]: _gone, ...rest } = state.journal;
      void _gone;
      return { ...state, journal: rest };
    }
    case "plan":
      return { ...state, plans: { ...state.plans, [action.plan]: action.days } };
    case "stoneSeen":
      return state.stonesSeen.includes(action.id)
        ? state
        : { ...state, stonesSeen: [...state.stonesSeen, action.id] };
    case "armor":
      return { ...state, armor: Array.from(new Set([...state.armor, ...action.pieces])) };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/* Date helpers                                                        */
/* ------------------------------------------------------------------ */

export const todayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const shiftDay = (key: string, delta: number) => {
  const [y, m, d] = key.split("-").map(Number);
  return todayKey(new Date(y, m - 1, d + delta));
};

/** Consecutive days with an honest check-in. A fall does not break it: honesty is the point. */
export function honestStreak(checkins: Record<string, Checkin>) {
  let key = todayKey();
  if (!checkins[key]) key = shiftDay(key, -1); // today not yet checked in: don't punish
  let n = 0;
  while (checkins[key]) {
    n++;
    key = shiftDay(key, -1);
  }
  return n;
}

/** Days since the last recorded fall (or since first check-in if none). null = no data. */
export function daysInTheLight(checkins: Record<string, Checkin>) {
  const dates = Object.keys(checkins).sort();
  if (!dates.length) return null;
  const falls = dates.filter((d) => {
    const c = checkins[d];
    return c.purity === "fell" || c.substances === "fell";
  });
  const from = falls.length ? falls[falls.length - 1] : dates[0];
  const [y, m, d] = from.split("-").map(Number);
  const start = new Date(y, m - 1, d).getTime();
  const days = Math.floor((Date.now() - start) / 86400000);
  return { days: Math.max(0, days), sinceFall: falls.length > 0 };
}

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type Listener = (action: Action, next: AppState) => void;

interface StoreValue {
  state: AppState;
  act: (action: Action) => void;
  /** Subscribe to every local change (used by cloud sync). Returns unsubscribe. */
  subscribe: (fn: Listener) => () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const stateRef = useRef(state);
  const listeners = useRef(new Set<Listener>());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load from this device
  useEffect(() => {
    let saved: Partial<AppState> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      /* ignore corrupt storage */
    }
    dispatch({ type: "hydrate", state: saved });
    setReady(true);
  }, []);

  // Save to this device
  useEffect(() => {
    if (!ready || !state.hydrated) return;
    try {
      const { hydrated: _h, ...persist } = state;
      void _h;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch {
      /* storage full or blocked */
    }
  }, [state, ready]);

  const act = useCallback((action: Action) => {
    const next = reducer(stateRef.current, action);
    stateRef.current = next;
    dispatch(action);
    if (action.type !== "hydrate" && action.type !== "merge") {
      listeners.current.forEach((fn) => fn(action, next));
    }
  }, []);

  const subscribe = useCallback((fn: Listener) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);

  const value = useMemo(() => ({ state, act, subscribe }), [state, act, subscribe]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <ProgressProvider>");
  return ctx;
}
