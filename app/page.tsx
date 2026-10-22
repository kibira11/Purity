import Link from "next/link";
import { stages } from "@/content/stages";
import { StageScene } from "@/components/StageScene";
import { Reveal } from "@/components/Section";
import { Logo } from "@/components/SiteHeader";
import { IconArrow, IconBook, IconLamp, IconPlay, IconTogether, IconWing, IconMap } from "@/components/Icons";

const pillars = [
  {
    Icon: IconBook,
    title: "The Word",
    text: "Scripture explaining Scripture. Every step is anchored in the Bible and woven through it, so it makes sense and it sticks.",
  },
  {
    Icon: IconLamp,
    title: "The mind",
    text: "Honest science on habits, the brain and the hormones, from researchers who study how people really change.",
  },
  {
    Icon: IconMap,
    title: "The body",
    text: "Sleep, sunlight, breath, movement, fasting. Your body is not the enemy. It is a temple, and it can help carry you.",
  },
  {
    Icon: IconTogether,
    title: "A friend beside you",
    text: "Pair up, share progress, check in, pray. Journals stay private. Nobody should walk out of Egypt alone.",
  },
  {
    Icon: IconPlay,
    title: "Play that transforms",
    text: "Rebuild verses, connect the golden thread, rehearse hard moments at the crossroads. Learning by doing.",
  },
  {
    Icon: IconWing,
    title: "A Flee button",
    text: "One tap, always there. Breathing, a ten-minute urge timer, a verse, a message to your friend.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-night-deep text-linen">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #12152b 0%, #2b3060 38%, #7a5a7e 62%, #d98f6d 82%, #f4d596 100%)",
          }}
        />
        <div className="stars absolute inset-0 opacity-80 [mask-image:linear-gradient(to_bottom,black_30%,transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 sm:h-[22rem]">
          <StageScene stage="jordan" className="h-full w-full" title="" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#d98f6d]/70 to-transparent" />
        </div>

        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Logo light />
          <nav aria-label="Main" className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/journey" className="hidden rounded-full px-4 py-2 text-linen/85 hover:bg-white/10 sm:block">
              Journey
            </Link>
            <Link href="/questions" className="hidden rounded-full px-4 py-2 text-linen/85 hover:bg-white/10 sm:block">
              Questions
            </Link>
            <Link href="/partner" className="hidden rounded-full px-4 py-2 text-linen/85 hover:bg-white/10 sm:block">
              Together
            </Link>
            <Link href="/login" className="btn btn-ghost-light !min-h-0 !px-4 !py-1.5">
              Sign in
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[84vh] max-w-4xl flex-col items-center justify-center px-5 pb-56 pt-10 text-center sm:pb-80">
          <p className="eyebrow animate-rise !text-dawn" style={{ animationDelay: "0.2s" }}>
            A walk out of bondage, together
          </p>
          <h1
            className="animate-rise mt-5 text-[3.3rem] leading-[0.98] text-dawn-pale sm:text-[5.6rem]"
            style={{ animationDelay: "0.5s" }}
          >
            The Journey
            <br />
            to Purity
          </h1>
          <p
            className="animate-rise mt-7 max-w-xl text-lg text-linen/90 sm:text-xl"
            style={{ animationDelay: "0.9s" }}
          >
            Eight stages from Egypt to Zion. Scripture, science and the body, a friend beside you, and a light
            that grows with every step.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "1.3s" }}>
            <Link href="/journey" className="btn btn-gold text-lg">
              Begin the journey <IconArrow width={20} height={20} />
            </Link>
            <Link href="#why" className="btn btn-ghost-light">
              Why this exists
            </Link>
          </div>
          <p className="animate-rise mt-12 max-w-md font-scripture text-[1.05rem] italic text-linen/85" style={{ animationDelay: "1.7s" }}>
            &ldquo;Blessed are the pure in heart: for they shall see God.&rdquo;
            <span className="mt-1 block text-sm not-italic text-dawn">Matthew 5:8</span>
          </p>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="mx-auto max-w-3xl scroll-mt-10 px-5 py-20 text-center">
        <Reveal>
          <p className="eyebrow">Why this exists</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">We are a generation that grew up inside the chains</h2>
          <div className="ornament my-6">
            <span aria-hidden>&#10022;</span>
          </div>
          <div className="prose-journey text-[1.12rem] text-night/85">
            <p>
              Pornography, masturbation, fornication, alcohol, weed, and a hundred quieter ways to numb out are all
              around us, and many of us are not watching from the outside. We are in it, and we are tired.
            </p>
            <p>
              This is not a lecture. It is a road. It is built around a story God Himself told: a people in slavery,
              a lamb, a sea that parts, a long walk, a river, and a land. Every step opens a passage of Scripture,
              the best of what psychology knows about changing habits, one thing to do with your body, one thing to
              do today, and a game that helps it sink in.
            </p>
            <p>
              <strong>Be free. Stay free. Help someone else out.</strong> That is the whole story.
            </p>
          </div>
        </Reveal>
      </section>

      {/* STAGES */}
      <section className="bg-night py-20 text-linen">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow !text-dawn">The route</p>
            <h2 className="mt-3 text-4xl !text-dawn-pale sm:text-5xl">From night to dawn in eight stages</h2>
            <p className="mt-4 text-linen/75">
              The sky on the map brightens as you walk. Each stage ends with a stone of remembrance, set where you
              crossed.
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((s, i) => (
              <li key={s.id}>
                <Reveal delay={(i % 4) * 0.12}>
                  <Link
                    href={`/journey/${s.id}`}
                    className="group block overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition-transform duration-700 hover:-translate-y-1"
                  >
                    <StageScene
                      stage={s.id}
                      className="aspect-[16/10] w-full transition-transform duration-[1800ms] group-hover:scale-[1.04]"
                    />
                    <div className="px-4 pb-5 pt-4">
                      <p className="text-xs font-bold tracking-[0.2em] text-dawn">STAGE {s.number}</p>
                      <p className="mt-1 font-display text-2xl text-dawn-pale">{s.name}</p>
                      <p className="text-sm text-linen/70">{s.subtitle}</p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">What is inside</p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Everything you need to walk it well</h2>
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(({ Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={(i % 3) * 0.1} className="paper h-full px-6 py-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-night text-dawn">
                  <Icon />
                </span>
                <h3 className="mt-4 text-[1.7rem]">{title}</h3>
                <p className="mt-2 text-[0.98rem] text-night/75">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24">
        <Reveal className="night-panel stars mx-auto max-w-3xl px-8 py-14 text-center">
          <h2 className="text-4xl !text-dawn-pale sm:text-5xl">Today the Lord can deliver your life</h2>
          <p className="mx-auto mt-4 max-w-md text-linen/80">
            You do not need to be ready. You only need to take the first step out of the house.
          </p>
          <Link href="/journey" className="btn btn-gold mt-8 text-lg">
            Begin the journey <IconArrow width={20} height={20} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
