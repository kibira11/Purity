"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "./auth";
import { getSupabase } from "./supabase";
import { useStore, type Action, type AppState, type Checkin, type JournalEntry, type MilestoneProgress, type Walk } from "./store";

/* ------------------------------------------------------------------ */
/* Tiny status store so the Account page can show what is happening     */
/* ------------------------------------------------------------------ */

type Status = { phase: "off" | "idle" | "syncing" | "synced" | "error"; message?: string; at?: string };
let status: Status = { phase: "off" };
const listeners = new Set<() => void>();
const setStatus = (s: Status) => {
  status = { ...s, at: new Date().toISOString() };
  listeners.forEach((l) => l());
};
export function useSyncStatus(): Status {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => status,
    () => ({ phase: "off" }) as Status,
  );
}

/* ------------------------------------------------------------------ */
/* Row mapping                                                          */
/* ------------------------------------------------------------------ */

const progressRow = (uid: string, id: string, p: MilestoneProgress) => ({
  user_id: uid,
  milestone_id: id,
  game_won: !!p.gameWon,
  sealed: !!p.sealed,
  challenge_done: !!p.challengeDone,
  updated_at: p.updatedAt,
});

const checkinRow = (uid: string, c: Checkin) => ({
  user_id: uid,
  day: c.date,
  mind: c.mind,
  purity: c.purity,
  substances: c.substances,
  note: c.note ?? null,
  note_shared: !!c.noteShared,
  updated_at: c.updatedAt,
});

const journalRow = (uid: string, e: JournalEntry) => ({
  id: e.id,
  user_id: uid,
  milestone_id: e.milestoneId ?? null,
  prompt: e.prompt ?? null,
  body: e.body,
  shared: e.shared,
  created_at: e.createdAt,
  updated_at: e.updatedAt,
});

const planRow = (uid: string, plan: string, days: number[]) => ({
  user_id: uid,
  plan_id: plan,
  days,
  updated_at: new Date().toISOString(),
});

async function check<T extends { error: { message: string } | null }>(p: PromiseLike<T>) {
  const res = await p;
  if (res.error) throw new Error(res.error.message);
  return res;
}

/* ------------------------------------------------------------------ */
/* Pull + push                                                          */
/* ------------------------------------------------------------------ */

async function pull(sb: SupabaseClient, uid: string): Promise<Partial<AppState>> {
  const [prog, chk, jr, plans, prof] = await Promise.all([
    check(sb.from("milestone_progress").select("*").eq("user_id", uid)),
    check(sb.from("checkins").select("*").eq("user_id", uid)),
    check(sb.from("journal_entries").select("*").eq("user_id", uid)),
    check(sb.from("plan_progress").select("*").eq("user_id", uid)),
    check(sb.from("profiles").select("name").eq("id", uid).maybeSingle()),
  ]);

  const milestones: AppState["milestones"] = {};
  for (const r of prog.data ?? []) {
    milestones[r.milestone_id] = {
      gameWon: r.game_won,
      sealed: r.sealed,
      challengeDone: r.challenge_done,
      updatedAt: r.updated_at,
    };
  }
  const checkins: AppState["checkins"] = {};
  for (const r of chk.data ?? []) {
    checkins[r.day] = {
      id: `${r.user_id}-${r.day}`,
      date: r.day,
      mind: r.mind as Walk,
      purity: r.purity as Walk,
      substances: r.substances as Walk,
      note: r.note ?? undefined,
      noteShared: r.note_shared,
      updatedAt: r.updated_at,
    };
  }
  const journal: AppState["journal"] = {};
  for (const r of jr.data ?? []) {
    journal[r.id] = {
      id: r.id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      milestoneId: r.milestone_id ?? undefined,
      prompt: r.prompt ?? undefined,
      body: r.body,
      shared: r.shared,
    };
  }
  const plansState: AppState["plans"] = {};
  for (const r of plans.data ?? []) plansState[r.plan_id] = r.days ?? [];

  const profData = prof.data as { name?: string } | null;
  return { name: profData?.name ?? "", milestones, checkins, journal, plans: plansState };
}

async function pushAll(sb: SupabaseClient, uid: string, s: AppState) {
  const ops: PromiseLike<{ error: { message: string } | null }>[] = [];
  const prog = Object.entries(s.milestones).map(([id, p]) => progressRow(uid, id, p));
  if (prog.length) ops.push(sb.from("milestone_progress").upsert(prog));
  const chk = Object.values(s.checkins).map((c) => checkinRow(uid, c));
  if (chk.length) ops.push(sb.from("checkins").upsert(chk));
  const jr = Object.values(s.journal).map((e) => journalRow(uid, e));
  if (jr.length) ops.push(sb.from("journal_entries").upsert(jr));
  const pl = Object.entries(s.plans).map(([id, d]) => planRow(uid, id, d));
  if (pl.length) ops.push(sb.from("plan_progress").upsert(pl));
  if (s.name) ops.push(sb.from("profiles").update({ name: s.name }).eq("id", uid));
  await Promise.all(ops.map((o) => check(o)));
}

async function pushAction(sb: SupabaseClient, uid: string, a: Action, next: AppState) {
  switch (a.type) {
    case "milestone": {
      const p = next.milestones[a.id];
      if (p) await check(sb.from("milestone_progress").upsert(progressRow(uid, a.id, p)));
      break;
    }
    case "checkin":
      await check(sb.from("checkins").upsert(checkinRow(uid, a.checkin)));
      break;
    case "journal":
      await check(sb.from("journal_entries").upsert(journalRow(uid, a.entry)));
      break;
    case "journalDelete":
      await check(sb.from("journal_entries").delete().eq("id", a.id).eq("user_id", uid));
      break;
    case "plan":
      await check(sb.from("plan_progress").upsert(planRow(uid, a.plan, a.days)));
      break;
    case "setName":
      await check(sb.from("profiles").update({ name: a.name }).eq("id", uid));
      break;
    default:
      break;
  }
}

/** Mount once. When someone is signed in, keeps this device and their account in step. */
export function CloudSync() {
  const { user, enabled } = useAuth();
  const { state, act, subscribe } = useStore();
  const latest = useRef(state);
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    latest.current = state;
  }, [state]);

  // First sign-in on this device: pull, merge, then push whatever the cloud lacks.
  useEffect(() => {
    if (!enabled) return;
    const sb = getSupabase();
    if (!sb || !user || !state.hydrated || syncedFor.current === user.id) return;
    syncedFor.current = user.id;
    setStatus({ phase: "syncing" });
    (async () => {
      try {
        const remote = await pull(sb, user.id);
        act({ type: "merge", state: remote });
        await new Promise((r) => setTimeout(r, 50));
        await pushAll(sb, user.id, latest.current);
        setStatus({ phase: "synced" });
      } catch (e) {
        syncedFor.current = null;
        setStatus({ phase: "error", message: e instanceof Error ? e.message : "Sync failed" });
      }
    })();
  }, [enabled, user, state.hydrated, act]);

  // After that, push each change as it happens.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !user) {
      if (enabled) setStatus({ phase: "idle" });
      return;
    }
    return subscribe((action, next) => {
      setStatus({ phase: "syncing" });
      pushAction(sb, user.id, action, next).then(
        () => setStatus({ phase: "synced" }),
        (e) => setStatus({ phase: "error", message: e instanceof Error ? e.message : "Sync failed" }),
      );
    });
  }, [enabled, user, subscribe]);

  // Back online: send everything again.
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !user) return;
    const onOnline = () => {
      pushAll(sb, user.id, latest.current).then(
        () => setStatus({ phase: "synced" }),
        (e) => setStatus({ phase: "error", message: e instanceof Error ? e.message : "Sync failed" }),
      );
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [user]);

  return null;
}
