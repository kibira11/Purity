"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "./supabase";
import { useAuth } from "./auth";

export interface StudyGroupRow {
  id: string;
  name: string;
  code: string;
  study_id: string;
  created_by: string;
  role: "leader" | "member";
}

export interface GroupMember {
  user_id: string;
  name: string;
  role: "leader" | "member";
  sessions: number[];
}

export interface GroupPost {
  id: string;
  group_id: string;
  session: number;
  user_id: string;
  author: string;
  kind: "answer" | "prayer";
  body: string;
  created_at: string;
}

async function loadMyGroup(uid: string): Promise<StudyGroupRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data: mem, error } = await sb.from("group_members").select("group_id, role").eq("user_id", uid).maybeSingle();
  if (error) throw new Error(error.message);
  if (!mem) return null;
  const { data: g, error: gErr } = await sb
    .from("study_groups")
    .select("id, name, code, study_id, created_by")
    .eq("id", mem.group_id)
    .single();
  if (gErr) throw new Error(gErr.message);
  return { ...g, role: mem.role as "leader" | "member" };
}

export function useMyStudyGroup() {
  const { user, enabled } = useAuth();
  const [group, setGroup] = useState<StudyGroupRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setGroup(null);
      return;
    }
    setLoading(true);
    try {
      setGroup(await loadMyGroup(user.id));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load group");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!enabled) return;
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    const t = window.setInterval(refresh, 60000);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.clearInterval(t);
    };
  }, [enabled, refresh]);

  return { group, error, loading, refresh };
}

export async function createStudyGroup(name: string, studyId: string): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error("Online accounts are not connected.");
  const { data, error } = await sb.rpc("create_study_group", { p_name: name, p_study_id: studyId });
  if (error) throw new Error(error.message);
  return data as string;
}

export async function joinStudyGroup(code: string): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error("Online accounts are not connected.");
  const { data, error } = await sb.rpc("join_study_group", { p_code: code });
  if (error) throw new Error(error.message);
  return data as string;
}

export async function leaveStudyGroup(groupId: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Online accounts are not connected.");
  const { error } = await sb.rpc("leave_study_group", { p_group_id: groupId });
  if (error) throw new Error(error.message);
}

export async function fetchGroupBundle(groupId: string, studyId: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Online accounts are not connected.");
  const { data: members, error: mErr } = await sb.from("group_members").select("user_id, role").eq("group_id", groupId);
  if (mErr) throw new Error(mErr.message);
  const ids = (members ?? []).map((m) => m.user_id);
  const [prof, prog, posts] = await Promise.all([
    sb.from("profiles").select("id, name").in("id", ids),
    sb.from("study_progress").select("user_id, sessions").eq("study_id", studyId).in("user_id", ids),
    sb
      .from("group_posts")
      .select("id, group_id, session, user_id, kind, body, created_at")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false })
      .limit(80),
  ]);
  if (prof.error) throw new Error(prof.error.message);
  if (prog.error) throw new Error(prog.error.message);
  if (posts.error) throw new Error(posts.error.message);

  const names: Record<string, string> = {};
  for (const p of prof.data ?? []) names[p.id] = (p as { name?: string }).name ?? "";

  const sessions: Record<string, number[]> = {};
  for (const r of prog.data ?? []) sessions[r.user_id] = r.sessions ?? [];

  const roster: GroupMember[] = (members ?? []).map((m) => ({
    user_id: m.user_id,
    name: names[m.user_id] || "Friend",
    role: m.role as "leader" | "member",
    sessions: sessions[m.user_id] ?? [],
  }));

  const mappedPosts: GroupPost[] = (posts.data ?? []).map((p) => ({
    ...p,
    author: names[p.user_id] || "Friend",
  })) as GroupPost[];

  return { roster, posts: mappedPosts };
}

export async function postToGroup(
  groupId: string,
  session: number,
  kind: "answer" | "prayer",
  body: string,
) {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  const me = s.session?.user.id;
  if (!sb || !me) throw new Error("Sign in first.");
  const { error } = await sb.from("group_posts").insert({ group_id: groupId, session, user_id: me, kind, body });
  if (error) throw new Error(error.message);
}

export async function deleteGroupPost(id: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Online accounts are not connected.");
  const { error } = await sb.from("group_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}