"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { studyById } from "@/content/studies";
import { versesFor } from "@/lib/verses";
import { useMyStudyGroup, fetchGroupBundle } from "@/lib/groups";
import { StudyGroupView } from "@/components/StudyView";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import { IconBack } from "@/components/Icons";

export default function GroupRoomPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();
  const { group, refresh } = useMyStudyGroup();
  const [roster, setRoster] = useState<Awaited<ReturnType<typeof fetchGroupBundle>>["roster"]>([]);
  const [posts, setPosts] = useState<Awaited<ReturnType<typeof fetchGroupBundle>>["posts"]>([]);
  const [meta, setMeta] = useState<{ name: string; code: string; study_id: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    try {
      const { data: g, error } = await sb
        .from("study_groups")
        .select("name, code, study_id")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!g) {
        setErr("Group not found.");
        return;
      }
      setMeta(g);
      const bundle = await fetchGroupBundle(id, g.study_id);
      setRoster(bundle.roster);
      setPosts(bundle.posts);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load group");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (group && group.id !== id) router.replace(`/groups/${group.id}`);
  }, [group, id, router]);

  if (!meta) {
    return <div className="px-5 py-16 text-night/70">{err || "Opening the room…"}</div>;
  }

  const study = studyById(meta.study_id);
  if (!study) return <div className="px-5 py-16 text-night/70">This study is missing from the app.</div>;

  const verses = versesFor(study.sessions.map((s) => s.keyVerse));

  return (
    <>
      <div className="mx-auto max-w-3xl px-5 pt-8">
        <Link href="/groups" className="inline-flex items-center gap-1.5 text-sm text-night/70 hover:text-night">
          <IconBack width={16} height={16} /> Groups
        </Link>
      </div>
      <StudyGroupView
        study={study}
        verses={verses}
        groupId={id}
        groupName={meta.name}
        code={meta.code}
        roster={roster}
        posts={posts}
        isLeader={group?.role === "leader"}
        onRefresh={async () => {
          await load();
          await refresh();
        }}
      />
    </>
  );
}