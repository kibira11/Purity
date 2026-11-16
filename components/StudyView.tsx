"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BibleStudy, StudySession } from "@/lib/types";
import type { VerseData } from "@/lib/verses";
import { useStore } from "@/lib/store";
import { contextLink, Verse } from "./Verse";
import { IconArrow, IconBack, IconCheck } from "./Icons";
import { Book, type BookHandle, type BookPage } from "./book/Book";
import { Rich } from "./Rich";
import type { GroupMember, GroupPost } from "@/lib/groups";
import { deleteGroupPost, postToGroup } from "@/lib/groups";
import { useAuth } from "@/lib/auth";
import { groupCovenant } from "@/content/together";

function sessionAnswerKey(session: number, field: string) {
  return `s${session}-${field}`;
}

function SessionPage({
  session,
  verses,
  answers,
  onAnswer,
  onDone,
  done,
}: {
  session: StudySession;
  verses: Record<string, VerseData>;
  answers: Record<string, string>;
  onAnswer: (key: string, value: string) => void;
  onDone: () => void;
  done: boolean;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm font-semibold text-night/70">Read {session.passage}</p>
      <a
        href={contextLink(session.passage)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost !min-h-0 !py-2"
      >
        Open passage
      </a>
      {verses[session.keyVerse] && <Verse data={verses[session.keyVerse]} size="sm" />}
      <div className="paper px-5 py-4">
        <p className="eyebrow">Open</p>
        <p className="mt-1 text-night/85">
          <Rich text={session.open} />
        </p>
      </div>
      <QuestionList title="Observe" items={session.observe} session={session.n} prefix="obs" answers={answers} onAnswer={onAnswer} />
      <QuestionList title="Reflect" items={session.reflect} session={session.n} prefix="ref" answers={answers} onAnswer={onAnswer} />
      <label className="block">
        <span className="eyebrow">Apply</span>
        <textarea
          className="field mt-2 min-h-[4.5rem]"
          value={answers[sessionAnswerKey(session.n, "apply")] ?? ""}
          onChange={(e) => onAnswer(sessionAnswerKey(session.n, "apply"), e.target.value)}
          placeholder={session.apply}
        />
      </label>
      <div className="night-panel stars px-5 py-4 text-linen/90">
        <p className="eyebrow !text-dawn">Pray</p>
        <p className="mt-2 scripture text-linen">{session.pray}</p>
      </div>
      {session.leaderNote && (
        <p className="text-sm text-night/65">
          <strong>Leader:</strong> {session.leaderNote}
        </p>
      )}
      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
        <input type="checkbox" className="h-5 w-5 accent-[#c8903f]" checked={done} onChange={onDone} />
        Session complete
      </label>
    </div>
  );
}

function QuestionList({
  title,
  items,
  session,
  prefix,
  answers,
  onAnswer,
}: {
  title: string;
  items: string[];
  session: number;
  prefix: string;
  answers: Record<string, string>;
  onAnswer: (key: string, value: string) => void;
}) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-2 space-y-3">
        {items.map((q, i) => {
          const key = sessionAnswerKey(session, `${prefix}-${i}`);
          return (
            <li key={key}>
              <p className="text-sm font-semibold text-night/80">{q}</p>
              <textarea
                className="field mt-1.5 min-h-[3.5rem] text-sm"
                value={answers[key] ?? ""}
                onChange={(e) => onAnswer(key, e.target.value)}
                aria-label={q}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function StudyIndex({
  items,
}: {
  items: { id: string; title: string; blurb: string; sessions: number }[];
}) {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      {items.map((s) => (
        <div key={s.id} className="paper flex flex-col px-6 py-6">
          <p className="eyebrow">{s.sessions} sessions</p>
          <p className="mt-1 font-display text-3xl">{s.title}</p>
          <p className="mt-2 flex-1 text-night/75">{s.blurb}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href={`/study/${s.id}`} className="btn btn-gold">
              Study alone
            </Link>
            <Link href={`/groups?study=${s.id}`} className="btn btn-ghost">
              With a group
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudySoloView({ study, verses }: { study: BibleStudy; verses: Record<string, VerseData> }) {
  const { state, act } = useStore();
  const prog = state.studies[study.id];
  const sessions = useMemo(() => new Set(prog?.sessions ?? []), [prog?.sessions]);
  const answers = prog?.answers ?? {};
  const firstOpen = study.sessions.find((s) => !sessions.has(s.n))?.n ?? study.sessions[0].n;
  const bookRef = useRef<BookHandle>(null);

  const save = useCallback(
    (nextSessions: number[], nextAnswers: Record<string, string>) => {
      act({ type: "study", study: study.id, sessions: nextSessions, answers: nextAnswers });
    },
    [act, study.id],
  );

  const onAnswer = useCallback(
    (key: string, value: string) => {
      save(Array.from(sessions), { ...answers, [key]: value });
    },
    [answers, save, sessions],
  );

  const toggleSession = useCallback(
    (n: number) => {
      const next = new Set(sessions);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      save(Array.from(next).sort((a, b) => a - b), answers);
    },
    [answers, save, sessions],
  );

  const pages: BookPage[] = useMemo(
    () =>
      study.sessions.map((session) => ({
        id: `session-${session.n}`,
        title: session.title,
        eyebrow: `Session ${session.n}`,
        content: (
          <SessionPage
            session={session}
            verses={verses}
            answers={answers}
            onAnswer={onAnswer}
            onDone={() => toggleSession(session.n)}
            done={sessions.has(session.n)}
          />
        ),
      })),
    [answers, onAnswer, sessions, study.sessions, toggleSession, verses],
  );

  const done = sessions.size;
  const cover = (
    <>
      <p className="eyebrow text-center">{study.sessions.length} sessions</p>
      <h1 className="mt-2 text-center text-4xl">{study.title}</h1>
      <p className="mx-auto mt-4 max-w-md text-center text-night/75">{study.blurb}</p>
      <p className="mt-4 text-center text-sm text-night/65">
        {done} of {study.sessions.length} complete · answers stay on this device unless you sign in
      </p>
    </>
  );

  const backCover = (
    <div className="text-center">
      <h2 className="text-3xl">{done === study.sessions.length ? "Study complete" : "Well walked"}</h2>
      <p className="mt-2 text-night/70">Want company on the road? Start or join a group.</p>
      <Link href="/groups" className="btn btn-gold mt-5">
        Study groups <IconArrow width={16} height={16} />
      </Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/study" className="inline-flex items-center gap-1.5 text-sm text-night/70 hover:text-night">
        <IconBack width={16} height={16} /> All studies
      </Link>
      <Book
        ref={bookRef}
        bookId={`study-${study.id}`}
        pages={pages}
        cover={cover}
        backCover={backCover}
        initialPageId={`session-${firstOpen}`}
      />
    </div>
  );
}

export function StudyGroupView({
  study,
  verses,
  groupId,
  groupName,
  code,
  roster,
  posts: initialPosts,
  isLeader,
  onRefresh,
}: {
  study: BibleStudy;
  verses: Record<string, VerseData>;
  groupId: string;
  groupName: string;
  code: string;
  roster: GroupMember[];
  posts: GroupPost[];
  isLeader: boolean;
  onRefresh: () => void;
}) {
  const { user } = useAuth();
  const [session, setSession] = useState(study.sessions[0].n);
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState("");
  const [kind, setKind] = useState<"answer" | "prayer">("answer");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setPosts(initialPosts), [initialPosts]);

  const current = study.sessions.find((s) => s.n === session) ?? study.sessions[0];
  const thread = posts.filter((p) => p.session === session);

  const send = async () => {
    if (!draft.trim()) return;
    try {
      await postToGroup(groupId, session, kind, draft.trim());
      setDraft("");
      onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not post");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-10">
      <header>
        <p className="eyebrow">Group · {code}</p>
        <h1 className="mt-2 text-4xl">{groupName}</h1>
        <p className="mt-2 text-night/75">{study.title}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {roster.map((m) => (
            <li key={m.user_id} className="chip" title={`Finished ${m.sessions.length} sessions`}>
              {m.name}
              {m.role === "leader" ? " · leader" : ""}
              {m.sessions.includes(session) ? (
                <IconCheck width={14} height={14} className="text-olive-deep" />
              ) : null}
            </li>
          ))}
        </ul>
      </header>

      {isLeader && (
        <details className="paper px-5 py-4">
          <summary className="cursor-pointer font-semibold">Group covenant (read aloud)</summary>
          <ul className="mt-3 space-y-3 text-sm text-night/80">
            {groupCovenant.map((c) => (
              <li key={c.title}>
                <strong>{c.title}.</strong> {c.text}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="flex flex-wrap gap-2">
        {study.sessions.map((s) => (
          <button
            key={s.n}
            type="button"
            className={`rounded-full px-3 py-1 text-sm font-semibold ${session === s.n ? "bg-night text-linen" : "bg-night/10 text-night"}`}
            onClick={() => setSession(s.n)}
          >
            {s.n}. {s.title}
          </button>
        ))}
      </div>

      <SessionPage
        session={current}
        verses={verses}
        answers={{}}
        onAnswer={() => {}}
        onDone={() => {}}
        done={false}
      />

      <section className="paper px-5 py-5">
        <h2 className="text-2xl">Discussion</h2>
        <p className="mt-1 text-sm text-night/65">Share insights, not graphic detail. Pray for one another.</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className={`chip ${kind === "answer" ? "!bg-dawn/50" : ""}`}
            onClick={() => setKind("answer")}
          >
            Answer
          </button>
          <button
            type="button"
            className={`chip ${kind === "prayer" ? "!bg-dawn/50" : ""}`}
            onClick={() => setKind("prayer")}
          >
            Prayer
          </button>
        </div>
        <textarea className="field mt-3 min-h-[4rem]" value={draft} onChange={(e) => setDraft(e.target.value)} />
        {error && <p className="mt-2 text-sm text-clay-deep">{error}</p>}
        <button type="button" className="btn btn-night mt-3" onClick={send}>
          Post
        </button>
        <ul className="mt-6 space-y-3">
          {thread.map((p) => (
            <li key={p.id} className="rounded-xl border border-night/10 bg-parchment px-4 py-3">
              <p className="text-xs font-semibold text-night/60">
                {p.author} · {p.kind} · {new Date(p.created_at).toLocaleString()}
              </p>
              <p className="mt-1 text-night/85">{p.body}</p>
              {(p.user_id === user?.id || isLeader) && (
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-clay-deep"
                  onClick={async () => {
                    await deleteGroupPost(p.id);
                    onRefresh();
                  }}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}