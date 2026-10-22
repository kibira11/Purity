import type { Question } from "@/lib/types";

/**
 * Straight answers to the questions young people actually ask.
 * Add your own: each entry needs an id, the question, a one-line short answer, the fuller answer in paragraphs,
 * the verses to show, and the journey steps that go deeper.
 */
export const questions: Question[] = [
  {
    id: "keep-way-pure",
    q: "How does a young man (or woman) keep their way pure?",
    short: "By living according to God's word: guarded, rooted in Scripture, and not alone.",
    answer: [
      "The Psalmist asks the exact question and answers it in the same breath: **by taking heed thereto according to thy word.** Purity is not mainly about avoiding things. It is about being **taken up with Someone** so that the other things lose their pull.",
      "In practice, the verses that follow show how: *with my whole heart have I sought thee* (seek God sincerely), *thy word have I hid in mine heart* (memorize Scripture), and *I will delight myself in thy statutes* (find real joy in God). Add the other half of the Bible's strategy: **flee** what you cannot fight, and **walk with others** who are on the same road.",
      "Notice that this is a lifelong walk, not a single decision. That is why the journey has eight stages, and why the check-in exists. Start with the first stage, and take the next step.",
    ],
    verses: ["Psalm 119:9", "Psalm 119:11", "Proverbs 4:23", "2 Timothy 2:22"],
    stages: [
      { stage: "egypt", slug: "what-purity-is" },
      { stage: "wilderness", slug: "a-renewed-mind" },
      { stage: "red-sea", slug: "flee-like-joseph" },
    ],
  },
  {
    id: "pure-in-heart",
    q: "What does “pure in heart” actually mean?",
    short: "Undivided: wanting God more than anything that competes with Him. Not flawless, but turned toward Him.",
    answer: [
      "In the Bible, the **heart** is the center of a person: thoughts, desires and will together. To be **pure** in heart is to be *undivided*, with one clear loyalty. It is the opposite of being double-minded (James 4:8).",
      "That is why Jesus can say *blessed are the pure in heart* and also tell us to repent when we fail: purity is a direction of the whole person, not a spotless record. David, after his terrible failure, prays *create in me a clean heart, O God.* A clean heart is a gift as well as a goal.",
      "And the reward is not a trophy. It is that they **shall see God.** Purity matters because it clears the window to the One we want most.",
    ],
    verses: ["Matthew 5:8", "Psalm 51:10", "James 4:8", "Psalm 24:3-4"],
    stages: [
      { stage: "egypt", slug: "what-purity-is" },
      { stage: "zion", slug: "clean-hands-pure-heart" },
    ],
  },
  {
    id: "porn",
    q: "What does the Bible say about pornography?",
    short: "It never uses the word, but it speaks plainly about lust, the eyes, and what we set before ourselves.",
    answer: [
      "Pornography as we know it did not exist, but the Bible's principles are clear. Jesus says that looking with lust is already adultery in the heart. Job made **a covenant with his eyes.** David vowed to set *no wicked thing before mine eyes.* And Paul says to *flee* sexual immorality.",
      "Beyond lust, pornography is a form of counterfeit intimacy: it takes the real thing God made for a covenant and turns it into a product consumed alone. It also uses real people, often exploited, as objects for our pleasure.",
      "The Bible's answer is not despair. It is a **covenant** (a decision made ahead of time), **walls** (making it hard to reach), and **replacement** (filling the mind with what is true and good), in company with others.",
    ],
    verses: ["Job 31:1", "Psalm 101:3", "Matthew 5:28", "1 Corinthians 6:18"],
    stages: [
      { stage: "red-sea", slug: "the-screen" },
      { stage: "wilderness", slug: "a-renewed-mind" },
      { stage: "jordan", slug: "confess-and-be-healed" },
    ],
  },
  {
    id: "masturbation",
    q: "Is masturbation a sin?",
    short: "The Bible does not name it. It does speak to lust, to being mastered, and to self-control, which settle most real situations.",
    answer: [
      "Honest answer: **the Bible never mentions it directly.** The story of Onan is not about it. So we should not pretend there is a verse that says otherwise.",
      "But the Bible does say that lust is sin of the heart, that we should not be *brought under the power of any* thing (1 Corinthians 6:12), and that self-control is a fruit of the Spirit. In real life, the habit is almost always tied to fantasy or pornography, and it often becomes compulsive and hidden. That is where it clearly harms.",
      "Sincere Christians land in slightly different places on the question of the act alone. What nearly all agree on: if it is driven by lust, hidden in shame, or ruling you, it needs to change. If you fall, remember: **no condemnation.** Come back the same day, and tell someone you trust.",
    ],
    verses: ["Matthew 5:28", "1 Corinthians 6:12", "Galatians 5:22-23", "Romans 6:12-13"],
    stages: [{ stage: "red-sea", slug: "alone-with-yourself" }, { stage: "passover", slug: "no-condemnation" }],
  },
  {
    id: "sex-before-marriage",
    q: "Why does the Bible say no to sex before marriage?",
    short: "Because sex is a covenant act, too good to be spent without a covenant.",
    answer: [
      "The Bible says no, not because sex is bad, but because it is **so good, and so deep**, that it belongs inside a lifelong covenant. Paul says sexual immorality is a sin *against his own body*, because sex joins two people in a way that nothing else does.",
      "Hebrews 13:4 says marriage is honorable and the marriage bed undefiled. Both halves matter. Sex inside marriage is celebrated all through Scripture. Sex outside it takes what belongs to the covenant and spends it without the promise that makes it safe.",
      "Many people also find, as the research suggests, that waiting protects trust, builds communication, and spares regret. And if it has already happened, the next question has a good answer too.",
    ],
    verses: ["1 Corinthians 6:18-20", "1 Thessalonians 4:3-8", "Hebrews 13:4", "Proverbs 5:18-19"],
    stages: [
      { stage: "red-sea", slug: "the-road-through" },
      { stage: "promised-land", slug: "courtship-and-boundaries" },
      { stage: "promised-land", slug: "the-beautiful-design" },
    ],
  },
  {
    id: "already-had-sex",
    q: "I have already had sex. Is it too late for me?",
    short: "No. Forgiveness, cleansing and a new start are real. You can walk in purity from today.",
    answer: [
      "No. Paul told the Corinthians: **such were some of you: but ye are washed, ye are sanctified, ye are justified.** The same list that includes sexual sin includes this promise.",
      "Jesus met a woman with a long and complicated sexual history at a well. He did not lower the standard and He did not shame her. He offered her living water, and she became the first evangelist in her city.",
      "Start where you are. Confess to God, receive forgiveness, tell a trusted person, and decide your next boundaries. God promises: *thou shalt forget the shame of thy youth.* Purity is not only about the past; it is about the **direction you walk from today.**",
    ],
    verses: ["1 Corinthians 6:11", "John 4:13-14", "1 John 1:9", "Isaiah 54:4"],
    stages: [
      { stage: "red-sea", slug: "the-road-through" },
      { stage: "passover", slug: "a-new-identity" },
      { stage: "promised-land", slug: "waiting-and-singleness" },
    ],
  },
  {
    id: "tempted-now",
    q: "I am being tempted right now. What do I do?",
    short: "Leave the room, breathe, speak a verse, ride the wave for ten minutes, and tell someone.",
    answer: [
      "Joseph's answer is the first: **flee.** Stand up and walk away from the screen, the room, or the person. Do not argue with temptation in its own house.",
      "Then breathe slowly, say a short verse aloud, and ride the wave: most urges peak and fade within a quarter of an hour if you do not feed them. Tell someone. Move your body. The Flee page walks you through this, step by step.",
      "God has promised a **way of escape** in every temptation. Your job is to look for the door and walk through it.",
    ],
    verses: ["1 Corinthians 10:13", "James 4:7", "2 Timothy 2:22", "Psalm 46:1"],
    stages: [
      { stage: "red-sea", slug: "flee-like-joseph" },
      { stage: "red-sea", slug: "ride-the-wave" },
    ],
  },
  {
    id: "fell-again",
    q: "I fell again. Does God still love me?",
    short: "Yes. His mercies are new every morning. Get up the same day.",
    answer: [
      "Yes, and nothing about last night changed that. *The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning.* The righteous person is not the one who never falls. It is the one who **rises again.**",
      "Notice what the accuser does after a fall: *you are finished.* Notice what God does: *there is now no condemnation,* and He draws you back. Conviction moves you toward God. Condemnation moves you away. Learn the difference.",
      "Practically: stop, tell God, tell your friend, wash, eat, rest, and look for the trigger. Then return to today's bread. A fall that is told becomes a lesson. A fall that is hidden becomes a pattern.",
    ],
    verses: ["Lamentations 3:22-23", "Proverbs 24:16", "Romans 8:1", "1 John 1:9"],
    stages: [
      { stage: "wilderness", slug: "when-you-fall" },
      { stage: "passover", slug: "no-condemnation" },
    ],
  },
  {
    id: "keep-going-back",
    q: "Why do I keep going back to it?",
    short: "Habit, brain chemistry, stress and loneliness, plus the longing God put in you for something real.",
    answer: [
      "Several things stack up. A **habit** is a loop of cue, craving and reward that becomes automatic. The brain's dopamine system drives **wanting** more than **liking**. **Stress, tiredness, loneliness and boredom** make the pull stronger. And underneath all of it is something good: a real longing for closeness, which a counterfeit never satisfies.",
      "Paul describes this struggle honestly in Romans 7: *what I would, that do I not; but what I hate, that do I.* He did not stop at the problem. He cried out and then said: *thanks be to God through Jesus Christ our Lord.* The answer is a Person and a process, not a trick.",
      "Change the cues, treat the real needs (food, rest, company), replace the habit with something better, and walk with a friend. It takes weeks, not days, and a stumble is not a restart.",
    ],
    verses: ["Romans 7:15", "Romans 7:24-25", "James 1:14-15", "Proverbs 4:23"],
    stages: [
      { stage: "wilderness", slug: "the-chemistry-of-craving" },
      { stage: "wilderness", slug: "daily-bread" },
      { stage: "red-sea", slug: "ride-the-wave" },
    ],
  },
  {
    id: "attraction-vs-lust",
    q: "Is being attracted to someone the same as lust?",
    short: "No. Attraction is natural. Lust is feeding it with possessive desire and imagination.",
    answer: [
      "Noticing that someone is beautiful is not sin. God made beauty and desire. Jesus' words are about **looking in order to lust**: turning a person into an object of fantasy and appetite.",
      "A helpful test: attraction notices and can move on; lust grabs, rehearses and takes. Attraction wants to honor the person; lust wants to use them. The first glance is often unchosen; the second look, and what we do with the thought, are choices.",
      "So do not be ashamed of being a normal human being. Be wise about what you feed, and treat everyone as a sibling in Christ (1 Timothy 5:1-2).",
    ],
    verses: ["Matthew 5:28", "1 Timothy 5:1-2", "Job 31:1", "Proverbs 6:25"],
    stages: [
      { stage: "red-sea", slug: "the-screen" },
      { stage: "jordan", slug: "brothers-and-sisters" },
    ],
  },
  {
    id: "find-a-wife",
    q: "How does a man find a wife?",
    short: "Pray, look for character, live among godly people, seek counsel, and become a man worth marrying.",
    answer: [
      "*Whoso findeth a wife findeth a good thing.* The man **finds**: he takes honorable initiative. In Genesis 24, Abraham's servant prays first, looks for kindness and hard work, and speaks to the family. Character comes before charm, and a shared faith is not optional.",
      "Do not wait to be perfect, but do work on who you are: self-control, honesty, work, faithfulness, humility. A woman of character is looking for a man of character.",
      "And remember it is a gift: *Except the LORD build the house, they labour in vain that build it.* Prepare, pray, act with honor, and trust.",
    ],
    verses: ["Proverbs 18:22", "Genesis 24:12-14", "Proverbs 31:30", "2 Corinthians 6:14"],
    stages: [
      { stage: "promised-land", slug: "how-a-man-finds-a-wife" },
      { stage: "promised-land", slug: "a-land-you-did-not-build" },
    ],
  },
  {
    id: "find-a-husband",
    q: "How does a woman find a husband, and how should she wait?",
    short: "Be faithful where you are, take counsel from wise women, look for a Boaz, and trust God with the timing.",
    answer: [
      "Ruth did not chase a husband. She was faithful in ordinary work, and a man of character noticed. Boaz protected her, honored her and went to the city gate to do things **openly and by the book.**",
      "A godly woman can hope for a man like that: one who protects, speaks plainly, involves her family and sets no pressure on her purity. And she can refuse anything less. Her worth does not depend on being chosen.",
      "Waiting is not wasted. It is a season to grow, to serve, to build friendships and to be settled in who you are, so that you can say yes to the right man from strength.",
    ],
    verses: ["Ruth 3:10-11", "Proverbs 31:25-26", "1 Peter 3:3-4", "Psalm 27:14"],
    stages: [
      { stage: "promised-land", slug: "how-a-woman-is-found" },
      { stage: "promised-land", slug: "waiting-and-singleness" },
    ],
  },
  {
    id: "friends-man-woman",
    q: "Can a young man and a young woman be close friends and stay pure?",
    short: "Yes, if they treat each other as brother and sister, with honesty, boundaries and others around.",
    answer: [
      "Paul tells Timothy to treat younger women **as sisters, in all purity.** That pattern is possible and beautiful: honor, truth, prayer and protection, without using each other.",
      "Wisdom matters: meet in public or in groups, keep messaging short and not late, do not share graphic details of your struggles with each other (keep those for a same-gender mentor), and do not make each other the center of your emotional life. If feelings change, say so honestly and ask a trusted adult for guidance.",
      "Remember the goal: to help each other follow Christ. If a friendship pulls you away from that, it needs to change.",
    ],
    verses: ["1 Timothy 5:1-2", "Romans 12:9-10", "Proverbs 4:23-27", "1 Thessalonians 5:11"],
    stages: [{ stage: "jordan", slug: "brothers-and-sisters" }, { stage: "jordan", slug: "no-one-crosses-alone" }],
  },
  {
    id: "dating-boundaries",
    q: "What are good boundaries when dating or courting?",
    short: "Decide before the moment: talk early, avoid being alone, guard the evening hours, involve others.",
    answer: [
      "*Do not stir up or awaken love until it pleases.* Desire, once awakened, wants more. So set the pace by **commitment**, not by chemistry.",
      "Practical boundaries that many couples find helpful: talk about your standards early and in daylight; avoid being alone in bedrooms or private spaces; limit late-night messages; keep alcohol out of dates; be careful with physical touch (anything that arouses is a signal to stop); bring family and friends into the relationship; and have a trusted couple who ask how it is going.",
      "If you have crossed lines, stop, repent together, and begin again with firmer walls. Grace is real, and so are boundaries.",
    ],
    verses: ["Song of Solomon 8:4", "1 Thessalonians 4:3-8", "Proverbs 4:23", "Ephesians 5:3"],
    stages: [{ stage: "promised-land", slug: "courtship-and-boundaries" }],
  },
  {
    id: "how-far",
    q: "How far is too far?",
    short: "Better question: how can I honor this person and God? Stop well before you are asking.",
    answer: [
      "The Bible does not give a list of acceptable acts. It gives a purpose: **do not wrong or use your brother or sister**, and honor God with your body. Asking *how far can I go?* usually means you are already near a line you would rather not cross.",
      "A better question is: *what would honor this person, and what protects the future we might share?* If an act is meant to lead toward sex, and you are not married, it is moving in a direction you have said you do not want to go.",
      "Practical test: would you do it in front of both sets of parents, and is it something you would be glad to remember if this relationship ended? And decide your lines **before** you are alone.",
    ],
    verses: ["1 Thessalonians 4:6-7", "Ephesians 5:3", "Romans 13:14", "Proverbs 22:3"],
    stages: [{ stage: "promised-land", slug: "courtship-and-boundaries" }],
  },
  {
    id: "alcohol",
    q: "Is it wrong to drink alcohol?",
    short: "Drunkenness is clearly wrong. Many choose none in this season, because of what it does to judgment.",
    answer: [
      "The Bible does not forbid every drop, but it plainly condemns drunkenness and warns about its effects. *Be not drunk with wine, wherein is excess; but be filled with the Spirit.*",
      "Alcohol lowers inhibition and narrows attention to the immediate moment, which is why it is so often linked with sexual failure and regret. For many young people, and especially anyone with a family history of addiction, the wisest choice for now is **none**.",
      "If you are dependent on alcohol, do not stop suddenly without medical advice: withdrawal can be dangerous. See the Help page.",
    ],
    verses: ["Ephesians 5:18", "Proverbs 20:1", "Proverbs 23:31-33", "Romans 14:21"],
    stages: [{ stage: "sinai", slug: "wine-and-wisdom" }],
  },
  {
    id: "weed-drugs",
    q: "What does the Bible say about weed, vaping and drugs?",
    short: "It does not name them, but it commands sobriety and warns against what enslaves and clouds the mind.",
    answer: [
      "The word translated *sorcery* in Galatians 5:20 is *pharmakeia* (our word *pharmacy*), which included the use of drugs. And the call to be **sober and vigilant** runs through the New Testament.",
      "The usual reason people use is escape. It works briefly and leaves the real problem untouched. For the developing brain, regular cannabis use carries real risks, including dependence, and it does not help the very self-control you are trying to build.",
      "If you are using and cannot stop, tell someone and get professional help. That is wisdom, not weakness. Also, obey the law of your country.",
    ],
    verses: ["Galatians 5:19-21", "1 Thessalonians 5:6-8", "1 Peter 5:8", "Matthew 11:28"],
    stages: [{ stage: "sinai", slug: "smoke-and-substances" }],
  },
  {
    id: "confess-who",
    q: "Do I have to tell someone? Who should I tell?",
    short: "Yes. Secrecy is where it grows. Choose a mature, trustworthy person of the same sex for the details.",
    answer: [
      "*Confess your faults one to another, and pray one for another, that ye may be healed.* Healing comes through the light. David's silence made him sick; confession brought relief.",
      "Choose carefully: a pastor, a mature older friend, a mentor or a counselor, ideally of the same gender for the details of sexual struggle. Do not choose someone who might be tempted by your story, and do not confess publicly. In a mixed pair, the partner can be a daily encourager, but the details belong with a mentor.",
      "Start with: *I need to tell you something hard. I am not asking you to fix it. I just do not want to carry it alone.*",
    ],
    verses: ["James 5:16", "Proverbs 28:13", "Psalm 32:3-5", "1 John 1:9"],
    stages: [
      { stage: "jordan", slug: "confess-and-be-healed" },
      { stage: "jordan", slug: "no-one-crosses-alone" },
      { stage: "egypt", slug: "shame-and-hiding" },
    ],
  },
  {
    id: "marriage-fix",
    q: "Will getting married fix my struggle?",
    short: "No. Marriage is a gift, but it exposes habits rather than curing them. Build self-control now.",
    answer: [
      "Many hope that marriage will solve it. It does not. A person who has not learned self-control, honesty and patience will bring the same habits into marriage, and they can hurt a spouse deeply.",
      "The good news is that the habits you are building now (honesty, self-control, serving, repair after a fight) are exactly the ones that make marriage joyful. Your struggle is not disqualifying; it is the place you are growing.",
      "If a habit like pornography has shaped your expectations, seek help early and speak with a counselor before marriage.",
    ],
    verses: ["Hebrews 13:4", "Ephesians 5:25", "Proverbs 5:18-19", "Psalm 37:4"],
    stages: [
      { stage: "promised-land", slug: "a-land-you-did-not-build" },
      { stage: "promised-land", slug: "the-beautiful-design" },
    ],
  },
  {
    id: "single-forever",
    q: "What if I never marry?",
    short: "Singleness is an honorable calling. You are whole in Christ, and God uses waiting.",
    answer: [
      "Jesus was single. Paul was single. Paul called both marriage and singleness a **gift** from God and noted that the single person can give undivided attention to the Lord.",
      "Waiting is hard, and it is not wasted. Joseph, Moses, Abraham and Sarah all waited, and God worked in the waiting. Build rich friendships, serve others, and be at home in your own life.",
      "God promises that the shame of the past will be forgotten, and that **your future will be larger than your past.**",
    ],
    verses: ["1 Corinthians 7:7", "1 Corinthians 7:32-35", "Isaiah 54:4", "Psalm 27:14"],
    stages: [{ stage: "promised-land", slug: "waiting-and-singleness" }],
  },
  {
    id: "brain-change",
    q: "Can my brain really change?",
    short: "Yes. Brains reshape with practice. The Bible calls it the renewing of the mind.",
    answer: [
      "Research on neuroplasticity shows that the adult brain reshapes itself with repeated use. London taxi drivers who memorized the city streets had measurably larger memory regions; habits form over weeks, not days.",
      "The Bible said it first: *be ye transformed by the renewing of your mind.* The method is replacement, not just suppression. Telling yourself not to think about something keeps it in mind. Giving your attention something better to hold, again and again, lays new paths.",
      "Expect it to take time: about ten weeks on average for a new habit to feel automatic. Missing a day is not a reset.",
    ],
    verses: ["Romans 12:2", "Philippians 4:8", "2 Corinthians 10:5", "Ephesians 4:22-24"],
    stages: [
      { stage: "wilderness", slug: "a-renewed-mind" },
      { stage: "wilderness", slug: "daily-bread" },
    ],
  },
  {
    id: "addicted",
    q: "How do I know if I need professional help?",
    short: "If you cannot stop despite trying, it is harming your life, or you feel hopeless, please talk to a professional.",
    answer: [
      "Signs it may be time: you have tried repeatedly to stop and cannot; it is costing you relationships, work or school; you are hiding it constantly; you are using to cope with painful feelings; or you feel depressed, anxious or hopeless.",
      "Seeking help is not a lack of faith. God often works through doctors, counselors and recovery groups. Jesus said the sick need a physician. If you are drinking heavily every day, get medical advice before stopping.",
      "If you are thinking of harming yourself, please contact emergency services or a crisis line right away. The Help page lists places to start.",
    ],
    verses: ["Matthew 9:12", "Proverbs 11:14", "Galatians 6:2", "Psalm 34:18"],
    stages: [
      { stage: "jordan", slug: "no-one-crosses-alone" },
      { stage: "egypt", slug: "naming-the-chains" },
    ],
  },
  {
    id: "never-tempted",
    q: "Does being pure mean I will stop being tempted?",
    short: "No. Jesus was tempted in every way. Temptation is not sin. Yielding is the question.",
    answer: [
      "Jesus *was in all points tempted like as we are, yet without sin.* So being tempted is not failure, and it does not mean God has left you. Over time, as habits change, temptations often lose their force, but you will be tempted in some way for as long as you live.",
      "The goal is not a life with no desire, but a life where desire has a good master. When temptation comes, treat it as an alert: *stay close to God, and take the way out.*",
      "Be encouraged: *God is faithful, who will not suffer you to be tempted above that ye are able.*",
    ],
    verses: ["Hebrews 4:15-16", "1 Corinthians 10:13", "James 1:12", "Matthew 26:41"],
    stages: [
      { stage: "red-sea", slug: "ride-the-wave" },
      { stage: "zion", slug: "walk-in-the-spirit" },
    ],
  },
  {
    id: "shame",
    q: "How do I deal with the shame?",
    short: "Shame says “I am bad.” God says you are forgiven, washed and loved. Bring it into the light.",
    answer: [
      "Shame hides; guilt repairs. Guilt says, *I did something wrong.* Shame says, *I am wrong.* Research suggests shame leads to hiding and blame, while guilt leads to apology and change. The gospel removes the shame without excusing the sin.",
      "God's answer is clear: *there is therefore now no condemnation.* *Such were some of you, but ye are washed.* *Thou shalt forget the shame of thy youth.* These are not nice ideas; they are your status.",
      "Practically: say the name God gives you, tell someone who will not flinch, and take a concrete step instead of replaying the failure.",
    ],
    verses: ["Romans 8:1", "1 Corinthians 6:11", "Isaiah 54:4", "Psalm 34:5"],
    stages: [
      { stage: "egypt", slug: "shame-and-hiding" },
      { stage: "passover", slug: "no-condemnation" },
      { stage: "jordan", slug: "rolled-away-and-armed" },
    ],
  },
  {
    id: "help-others",
    q: "Can my story help someone else?",
    short: "Yes. Your struggle and rescue become a way out for others. Tell it wisely.",
    answer: [
      "Jesus told Peter: *when thou art converted, strengthen thy brethren.* Paul says God comforts us so that we can comfort others with the same comfort.",
      "You do not have to be finished to help. You only have to be one step ahead, and honest about the road. Tell your story with gratitude, focus on what God did, and keep details that would harm others or tempt listeners to yourself.",
      "Helping others is also good for you: research on recovery suggests people who help others tend to stay well longer.",
    ],
    verses: ["Luke 22:31-32", "2 Corinthians 1:3-4", "Revelation 12:11", "Mark 5:19"],
    stages: [
      { stage: "zion", slug: "strengthen-your-brothers" },
      { stage: "zion", slug: "your-story-is-a-door" },
    ],
  },
];

export const questionById = (id: string) => questions.find((q) => q.id === id);
