"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "./supabase";
import { useAuth } from "./auth";
import type { Walk } from "./store";

export interface Partnership {
  code: string;
  status: "pending" | "active";
  partnerId: string | null;
  iCreated: boolean;
}

export interface PartnerCheckin {
  day: string;
  mind: Walk;
  purity: Walk;
  substances: Walk;
  note: string | null;
}

export interface PartnerJournal {
  id: string;
  prompt: string | null;
  body: string;
  milestone_id: string | null;
  updated_at: string;
}

export interface Note {
  id: string;
  from_user: string;
  to_user: string;
  kind: "encouragement" | "prayer" | "sos";
  body: string;
  created_at: string;
  read_at: string | null;
}

export interface PartnerData {
  name: string;
  sealed: string[];
  checkins: PartnerCheckin[];
  journal: PartnerJournal[];
  plans: Record<string, number[]>;
}

export interface PartnerBundle {
  partnership: Partnership | null;
  partner: PartnerData | null;
  notes: Note[];
}

async function load(uid: string): Promise<PartnerBundle> {
  const sb = getSupabase();
  if (!sb) return { partnership: null, partner: null, notes: [] };

  const { data: rows, error } = await sb.from("partnerships").select("*").limit(1);
  if (error) throw new Error(error.message);
  const row = rows?.[0];
  if (!row) return { partnership: null, partner: null, notes: [] };

  const partnerId: string | null = row.status === "active" ? (row.user_a === uid ? row.user_b : row.user_a) : null;
  const partnership: Partnership = { code: row.code, status: row.status, partnerId, iCreated: row.user_a === uid };
  if (!partnerId) return { partnership, partner: null, notes: [] };

  const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const [prof, prog, chk, jr, pl, notes] = await Promise.all([
    sb.from("profiles").select("name").eq("id", partnerId).maybeSingle(),
    sb.from("milestone_progress").select("milestone_id,sealed").eq("user_id", partnerId),
    sb.from("partner_checkins").select("day,mind,purity,substances,note").gte("day", since).order("day", { ascending: false }),
    sb
      .from("journal_entries")
      .select("id,prompt,body,milestone_id,updated_at")
      .eq("user_id", partnerId)
      .eq("shared", true)
      .order("updated_at", { ascending: false })
      .limit(20),
    sb.from("plan_progress").select("plan_id,days").eq("user_id", partnerId),
    sb.from("notes").select("*").order("created_at", { ascending: false }).limit(40),
  ]);

  const plans: Record<string, number[]> = {};
  for (const r of pl.data ?? []) plans[r.plan_id] = r.days ?? [];

  return {
    partnership,
    partner: {
      name: (prof.data as { name?: string } | null)?.name ?? "",
      sealed: (prog.data ?? []).filter((r) => r.sealed).map((r) => r.milestone_id),
      checkins: (chk.data ?? []) as PartnerCheckin[],
      journal: (jr.data ?? []) as PartnerJournal[],
      plans,
    },
    notes: (notes.data ?? []) as Note[],
  };
}

/** Loads the pairing, the friend's shared view, and notes. Refreshes when the tab regains focus. */
export function usePartner() {
  const { user } = useAuth();
  const [bundle, setBundle] = useState<PartnerBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setBundle(await load(user.id));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setBundle(null);
      return;
    }
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    const t = window.setInterval(refresh, 45000);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.clearInterval(t);
    };
  }, [user, refresh]);

  return { bundle, error, loading, refresh };
}

export async function createInvite(): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error("Online accounts are not connected.");
  const { data, error } = await sb.rpc("create_partnership");
  if (error) throw new Error(error.message);
  return data as string;
}

export async function joinWithCode(code: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Online accounts are not connected.");
  const { error } = await sb.rpc("join_partnership", { p_code: code });
  if (error) throw new Error(error.message);
}

export async function leavePartnership() {
  const sb = getSupabase();
  if (!sb) throw new Error("Online accounts are not connected.");
  const { error } = await sb.rpc("leave_partnership");
  if (error) throw new Error(error.message);
}

export async function sendNote(toUser: string, kind: Note["kind"], body: string) {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  const me = s.session?.user.id;
  if (!sb || !me) throw new Error("Sign in first.");
  const { error } = await sb.from("notes").insert({ from_user: me, to_user: toUser, kind, body });
  if (error) throw new Error(error.message);
}

export async function markNotesRead(ids: string[]) {
  const sb = getSupabase();
  if (!sb || !ids.length) return;
  await sb.from("notes").update({ read_at: new Date().toISOString() }).in("id", ids);
}
