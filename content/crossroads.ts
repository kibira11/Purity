export interface ScenarioChoice {
  label: string;
  to: string;
}

export interface ScenarioNode {
  id: string;
  /** The scene. Omitted on endings, which carry their own text. */
  text?: string;
  choices?: ScenarioChoice[];
  ending?: {
    kind: "wise" | "fall";
    title: string;
    text: string;
    /** scripture reference shown at the end */
    verse: string;
  };
}

export interface Scenario {
  id: string;
  title: string;
  setup: string;
  start: string;
  nodes: ScenarioNode[];
  /** Which stage this belongs to, for the Play hub. */
  stage?: string;
}

/**
 * Real-life crossroads. Each is a short rehearsal: decide now, with a clear head,
 * what you will do when it is real. Falls are never a dead end.
 */
export const scenarios: Record<string, Scenario> = {
  "the-closed-door": {
    id: "the-closed-door",
    stage: "red-sea",
    title: "The closed door",
    setup: "A friend's house, a Saturday afternoon. Everyone else has gone out to buy food.",
    start: "start",
    nodes: [
      {
        id: "start",
        text: "You are left at the house with someone you are very attracted to. They smile and say, *Come to my room. I want to show you something.* Your heart is beating faster. Nobody will be back for an hour.",
        choices: [
          { label: "Go in. It is only a minute, and you can handle it.", to: "inside" },
          { label: "Say, “Let’s stay in the living room,” and sit there.", to: "living" },
          { label: "Say you need some air, and walk out of the house.", to: "out" },
        ],
      },
      {
        id: "inside",
        text: "The door closes behind you with a soft click. The room is quiet and the bed is right there. They sit close. You notice you are no longer thinking clearly, and part of you is saying *this is the moment to leave*.",
        choices: [
          { label: "Stay a little longer. You are sure nothing will happen.", to: "fall-stay" },
          { label: "Stand up now, open the door and walk out.", to: "joseph" },
        ],
      },
      {
        id: "living",
        text: "You sit in the living room. They sit beside you and the conversation is warm, but the air is charged. After a few minutes, they take your hand and lean in. You still have an exit.",
        choices: [
          { label: "Let it continue. A kiss does no harm.", to: "fall-kiss" },
          { label: "Gently take your hand back and say, “I want to honor you and honor God. I’m going to wait outside for the others.”", to: "honest" },
        ],
      },
      {
        id: "out",
        text: "You say you need some air and walk outside into the sun. You are shaking a little. You sit on the step and take a long breath. Your phone is in your hand. You could text someone.",
        choices: [
          { label: "Message your friend: “I just left a situation. Praying, please check on me tonight.”", to: "wise-text" },
          { label: "Say nothing to anyone. You handled it and it is done.", to: "wise-quiet" },
        ],
      },
      {
        id: "joseph",
        ending: {
          kind: "wise",
          title: "You ran like Joseph",
          text: "It was awkward, and you will think about it later. But you left, with your integrity and your garment-less hands. Nobody was harmed, and you can look both of them in the eye tomorrow. **Courage in this area looks like leaving.** Tell someone tonight.",
          verse: "2 Timothy 2:22",
        },
      },
      {
        id: "honest",
        ending: {
          kind: "wise",
          title: "Honest and kind",
          text: "You told the truth without shaming them. It cost you a moment of awkwardness and bought you a clear conscience. Whether or not they understood, you did something rare: you **chose the long road over the short thrill**. Next time, decide earlier and do not be in the house alone.",
          verse: "1 Thessalonians 4:3-4",
        },
      },
      {
        id: "wise-text",
        ending: {
          kind: "wise",
          title: "You left, and you told",
          text: "Two wise moves at once: you **fled**, and you **spoke** the moment into the light. That text turns a private battle into a shared one. The more you practice this, the less power these moments have.",
          verse: "Galatians 6:2",
        },
      },
      {
        id: "wise-quiet",
        ending: {
          kind: "wise",
          title: "You left, now finish well",
          text: "You made the hardest choice: you walked away. Do one thing more. **Tell someone this week**, so the memory does not grow into a secret. Secrets grow in silence and shrink when told.",
          verse: "Proverbs 28:13",
        },
      },
      {
        id: "fall-stay",
        ending: {
          kind: "fall",
          title: "The room was the choice",
          text: "The moment of failure was not the end of the story. The moment of failure was the **closed door**. Joseph did not reason with her in the room; he ran. This does not mean you are lost. Confess it today, to God and a trusted person. Then rewind and try again: stand up at the first sign.",
          verse: "1 John 1:9",
        },
      },
      {
        id: "fall-kiss",
        ending: {
          kind: "fall",
          title: "A small yes becomes a bigger one",
          text: "What began with a kiss was not harmless, because **it started something that wants more**. You may feel confused or guilty, and that is information, not condemnation. Go back, decide where your line is, and say it out loud before you are alone with anyone.",
          verse: "Proverbs 4:23",
        },
      },
    ],
  },

  "late-night-phone": {
    id: "late-night-phone",
    stage: "red-sea",
    title: "The phone at midnight",
    setup: "It is 12:40 a.m. You have been in bed for an hour, but you are not sleeping. The phone is under your pillow.",
    start: "start",
    nodes: [
      {
        id: "start",
        text: "You are tired and your mind is restless. You tell yourself you will just check the news for a minute. Ten minutes later you are scrolling through content that is not quite what you want but is getting closer to it. A thought arrives: *Nobody would know.*",
        choices: [
          { label: "Keep scrolling. You are in control.", to: "deeper" },
          { label: "Put the phone down on the floor and sit up.", to: "sit" },
          { label: "Get up, take the phone out of the room, and plug it in at the front door.", to: "plug" },
        ],
      },
      {
        id: "deeper",
        text: "Every swipe takes you closer to a place you promised yourself you would not go. Your pulse has quickened and your thinking is narrower. You notice that you feel more awake and less calm than ten minutes ago.",
        choices: [
          { label: "Click through. It is already too late.", to: "fall" },
          { label: "Stop now. Close the app, turn the screen off, and say a short prayer.", to: "stop" },
        ],
      },
      {
        id: "sit",
        text: "With the phone on the floor you are less tempted, but the urge is still there, like a wave. Your body feels wired. You have about fifteen minutes before it peaks and falls.",
        choices: [
          { label: "Pick the phone up again just to check one thing.", to: "deeper" },
          { label: "Breathe in for four, out for six. Count ten breaths, then ten more.", to: "breathe" },
        ],
      },
      {
        id: "plug",
        ending: {
          kind: "wise",
          title: "You moved the battlefield",
          text: "You did not rely on willpower at 1 a.m., the weakest moment of the day. You **changed the environment** so that the right choice was the easy one. That is not weakness; that is strategy. Tomorrow, keep the phone charging outside the bedroom for good.",
          verse: "Romans 13:14",
        },
      },
      {
        id: "stop",
        ending: {
          kind: "wise",
          title: "You turned back in time",
          text: "It is a victory to stop **in the middle** of a slide. Do not minimize it. Now do the next thing: put the phone outside the room, pray once more, and go to sleep. Tell your friend tomorrow what happened and what worked.",
          verse: "James 4:7",
        },
      },
      {
        id: "breathe",
        ending: {
          kind: "wise",
          title: "You rode the wave",
          text: "Twenty slow breaths and the urge has lost its edge. You did not have to fight it, only to **wait and watch it pass**. Cravings rise, peak and fall. Now stand, drink a glass of water, and take the phone out of the room.",
          verse: "1 Corinthians 10:13",
        },
      },
      {
        id: "fall",
        ending: {
          kind: "fall",
          title: "You fell, and you can stand",
          text: "It is 1:30 a.m. and you feel the weight of it. This is exactly where the lie begins: *You failed. You might as well keep going.* Do not listen. **Stand up, wash your face, tell God, and go to sleep.** Tell your friend in the morning. The morning mercy is new.",
          verse: "Lamentations 3:22-23",
        },
      },
    ],
  },

  "alone-at-home": {
    id: "alone-at-home",
    stage: "red-sea",
    title: "The empty house",
    setup: "Your family is away for the weekend. It is Saturday evening. You have the whole house to yourself.",
    start: "start",
    nodes: [
      {
        id: "start",
        text: "The house is quiet and the evening stretches in front of you. You feel the old pull, the sense of **privacy**, the thought that no one will ever know. You could spend the night differently.",
        choices: [
          { label: "Stay home, alone, and see what happens.", to: "alone" },
          { label: "Call a friend and arrange to meet for food and a walk.", to: "friend" },
          { label: "Start cooking something. Put on music and see how you feel.", to: "cook" },
        ],
      },
      {
        id: "alone",
        text: "By ten o'clock you have been on the couch for hours. You feel restless, the house is silent, and you notice you are already scrolling on the phone in your hand. The urge is stronger now, and so is the loneliness under it.",
        choices: [
          { label: "Give in. No one is home, so it doesn’t matter.", to: "fall" },
          { label: "Recognize it as loneliness. Message your friend: “Rough night. Can you pray for me?”", to: "tell" },
        ],
      },
      {
        id: "friend",
        ending: {
          kind: "wise",
          title: "You went toward people",
          text: "The best answer to isolation is **company**. A walk and a meal changed the night. You did not have to fight a battle, because you avoided the battlefield. Plan your solitary weekends ahead of time. Never leave an empty house empty.",
          verse: "Ecclesiastes 4:9-10",
        },
      },
      {
        id: "cook",
        text: "You cook, put on music and clean the kitchen. For two hours you are busy and almost cheerful. At nine, you finish and the quiet returns. You are tired and suddenly the urge is back.",
        choices: [
          { label: "Go to your room and lie on the bed with your phone.", to: "alone" },
          { label: "Go out for a short walk, then call your friend and go to bed early.", to: "walk" },
        ],
      },
      {
        id: "tell",
        ending: {
          kind: "wise",
          title: "You named it and told someone",
          text: "That one message changed the night. **Loneliness dressed up as lust** loses its power once it is named. Your friend replies with a prayer and a joke, and you realize the urge has already faded. Go to bed with the lights low and the phone in the kitchen.",
          verse: "James 5:16",
        },
      },
      {
        id: "walk",
        ending: {
          kind: "wise",
          title: "You trained your body",
          text: "Movement, fresh air and a voice on the phone, then bed. You did not wait for the urge to win; you **got ahead of it**. The most dangerous hours are often the tired, unstructured ones. Having a plan for them is one of the strongest things you can do.",
          verse: "Psalm 4:8",
        },
      },
      {
        id: "fall",
        ending: {
          kind: "fall",
          title: "Alone is not the same as unseen",
          text: "You feel the hollow quiet afterward. The act promised relief and gave you shame. Remember: **God was in the house the whole time** and He is not shocked or leaving. Confess, receive mercy, and tell your friend. Then plan next weekend before it arrives.",
          verse: "Psalm 139:7-12",
        },
      },
    ],
  },

  "boredom-scroll": {
    id: "boredom-scroll",
    stage: "red-sea",
    title: "The bored afternoon",
    setup: "Sunday, 3 p.m. Nothing planned. You are a little low, a little lonely, a little bored.",
    start: "start",
    nodes: [
      {
        id: "start",
        text: "You open an app without deciding to. You scroll through videos and photos. A familiar feeling stirs: not desire exactly, but **restlessness** and a wish to feel something. A thumbnail catches your eye and it is just beyond what you should look at.",
        choices: [
          { label: "Tap it. Just once, just to look.", to: "tap" },
          { label: "Pause. Ask: am I hungry, angry, lonely or tired?", to: "halt" },
        ],
      },
      {
        id: "tap",
        text: "The first tap leads to a second and a third. The algorithm learns quickly what holds you. You have been scrolling for twenty minutes and your mood is lower, not higher.",
        choices: [
          { label: "Keep going. You have come this far.", to: "fall" },
          { label: "Put the phone face down. Stand up and drink water.", to: "halt" },
        ],
      },
      {
        id: "halt",
        text: "You check yourself honestly. You skipped lunch, you slept badly, and you have not spoken to a real person today. The feeling is not really desire. It is a need for **food, rest and company**, dressed in other clothes.",
        choices: [
          { label: "Eat something, then go outside for a walk and call a friend.", to: "wise-reset" },
          { label: "Distract yourself with a game for hours.", to: "drift" },
        ],
      },
      {
        id: "wise-reset",
        ending: {
          kind: "wise",
          title: "You met the real need",
          text: "Food, air, a voice. In half an hour, the pull is gone. Most urges are **requests**: the body asking for something it can name. The skill is learning to ask the question before you obey the craving. Keep a card on your phone: **H.A.L.T.**",
          verse: "Psalm 34:8",
        },
      },
      {
        id: "drift",
        ending: {
          kind: "wise",
          title: "A harmless drift, with a lesson",
          text: "You avoided the fall, but an afternoon of pure distraction leaves you empty. Distraction is better than falling, but **replacement is better than distraction.** Next time, have a list of things that actually fill you: music, a project, a person, a walk.",
          verse: "Philippians 4:8",
        },
      },
      {
        id: "fall",
        ending: {
          kind: "fall",
          title: "The loop caught you",
          text: "You are not weak; the apps are designed to hold you, and the drift was invisible until it was deep. Close the apps, wash your face, tell God what happened, and **move your body**. Then tell your friend. The earlier you stop in the loop, the easier it is. Next time, stop at the first tap.",
          verse: "Psalm 51:10",
        },
      },
    ],
  },

  "old-friends-return": {
    id: "old-friends-return",
    stage: "wilderness",
    title: "The old crowd",
    setup: "You have been doing well for six weeks. Then a message arrives from an old friend.",
    start: "start",
    nodes: [
      {
        id: "start",
        text: "*Hey stranger. Come to the usual place tonight? Everyone is there. We miss you.* You smile. You do miss them. Some of those nights were fun. Others were the nights you are trying to leave behind.",
        choices: [
          { label: "Go, but promise yourself you will only stay an hour.", to: "go" },
          { label: "Reply warmly and suggest a different plan: a meal or a game in the daytime.", to: "alt" },
          { label: "Ignore the message and say nothing.", to: "ignore" },
        ],
      },
      {
        id: "go",
        text: "You arrive and the room welcomes you. The music, the smells and the people pull on old memories. Someone hands you a drink. Someone else says, *You can't be that serious now.* It is only half past nine.",
        choices: [
          { label: "Take the drink. You will manage it.", to: "fall" },
          { label: "Say thank you, decline, and leave within the next ten minutes.", to: "leave" },
        ],
      },
      {
        id: "alt",
        text: "You suggest lunch on Saturday. Some of them agree and some do not. One says, *We will see.* You feel a small ache, but also relief, because the plan is yours.",
        choices: [
          { label: "Go to lunch and be honest that you have changed.", to: "honest" },
          { label: "Let the friendship quietly fade out.", to: "fade" },
        ],
      },
      {
        id: "ignore",
        text: "You put the phone down. The message sits there. Three hours later the guilt has turned into a quiet pull: *what if I had gone?* You remember only the fun parts.",
        choices: [
          { label: "Write the real story of those nights on paper and read it.", to: "writeit" },
          { label: "Reply “on my way”.", to: "go" },
        ],
      },
      {
        id: "leave",
        ending: {
          kind: "wise",
          title: "You left while you still could",
          text: "You tested your strength once and found it wanting. The wise thing was not to stay and prove yourself; it was to **leave early** and without drama. Tell your friend what happened. Next time, you might not go at all, or you might bring someone who will leave with you.",
          verse: "Proverbs 4:14-15",
        },
      },
      {
        id: "honest",
        ending: {
          kind: "wise",
          title: "You invited them into the light",
          text: "Lunch in daylight gave your old friends a glimpse of the new you. Some will drift and some may be curious. You are not abandoning them; you are **offering a different road**. Pray for each by name.",
          verse: "Matthew 5:16",
        },
      },
      {
        id: "fade",
        ending: {
          kind: "wise",
          title: "A hard and honest goodbye",
          text: "Some friendships were built on the very thing you are leaving. Letting them fade is sad, and it is allowed. Make sure you are building **new friendships** at the same time, so the gap is not empty. Ask your pastor or friend to introduce you to people on the same road.",
          verse: "1 Corinthians 15:33",
        },
      },
      {
        id: "writeit",
        ending: {
          kind: "wise",
          title: "You told the whole truth",
          text: "The paper held both parts of the story: the laughs and the hangovers, the closeness and the shame. **Memory edits; paper does not.** You keep it on your phone for the next time the pull comes. And you reply to your friend with a different plan.",
          verse: "Philippians 3:13-14",
        },
      },
      {
        id: "fall",
        ending: {
          kind: "fall",
          title: "Egypt was louder than you thought",
          text: "You took the drink, and one led to more. In the morning you remember why you left. This is not the end. **Do not let the shame keep you from your friend.** Tell them today, and ask for help. Then write out the plan: if I am invited, I will ______.",
          verse: "Proverbs 24:16",
        },
      },
    ],
  },

  "after-the-fall": {
    id: "after-the-fall",
    stage: "wilderness",
    title: "The morning after",
    setup: "You fell last night after twenty-one clean days. It is 7 a.m. and you are sitting on the edge of the bed.",
    start: "start",
    nodes: [
      {
        id: "start",
        text: "The old voice is loud: *Twenty-one days gone. Everything you worked for is wasted. You are the same as ever. You might as well stop trying.* Your stomach feels hollow.",
        choices: [
          { label: "Agree with the voice. Stop trying for now.", to: "spiral" },
          { label: "Whisper Micah 7:8 and say it aloud: “When I fall, I shall arise.”", to: "arise" },
          { label: "Avoid thinking about it. Go on with your day.", to: "avoid" },
        ],
      },
      {
        id: "spiral",
        text: "You tell yourself it is all pointless, and you skip breakfast and the morning prayer. By afternoon you are tired, irritable and alone. The urge has returned with extra force, and the voice says: *you may as well.*",
        choices: [
          { label: "Fall again, then go to bed in despair.", to: "fall-again" },
          { label: "Realize the voice is the accuser. Eat, then message your friend.", to: "arise" },
        ],
      },
      {
        id: "arise",
        text: "You stand, drink a glass of water and wash your face. You remember the plan: **stop, tell God, tell your friend, eat and rest, learn, return to today's bread.** You pray briefly and honestly. Then you pick up your phone.",
        choices: [
          { label: "Write to your friend: “I fell last night. I am okay and I am getting back up. Can you pray?”", to: "tell" },
          { label: "Decide it is private and you will not tell anyone.", to: "keep" },
        ],
      },
      {
        id: "avoid",
        text: "You busy yourself with the day, but the guilt sits under everything. By evening you have avoided God and your friend. The silence feels heavier, not lighter.",
        choices: [
          { label: "Turn around now: pray honestly and write to your friend.", to: "tell" },
          { label: "Keep avoiding. It will pass.", to: "spiral" },
        ],
      },
      {
        id: "tell",
        ending: {
          kind: "wise",
          title: "Mercy is new this morning",
          text: "Your friend replies within minutes: *Thank you for telling me. Proud of you for getting up. What do you think the trigger was?* You realize it was a late night, an empty stomach and a lonely hour. **You have turned a fall into a lesson, and a lesson into a plan.** That is how recovery works.",
          verse: "Lamentations 3:22-23",
        },
      },
      {
        id: "keep",
        ending: {
          kind: "wise",
          title: "Up, but still alone",
          text: "You got up, and that matters most. But the risk of silence is that the cause stays hidden and the pattern repeats. **Secrecy is the soil where it grows.** Tell your friend or mentor within the week, even if it is brief. The lighter you carry it, the further you will go.",
          verse: "Proverbs 28:13",
        },
      },
      {
        id: "fall-again",
        ending: {
          kind: "fall",
          title: "The second fall is the most dangerous",
          text: "This is the abstinence violation effect: one slip becomes a spiral because of what you told yourself afterward. **The lie was the second fall, not the first.** Rewind. You may start again right now. Wash, eat, sleep, and speak to one person in the morning.",
          verse: "Micah 7:8",
        },
      },
    ],
  },

  "the-party": {
    id: "the-party",
    stage: "sinai",
    title: "The party",
    setup: "A birthday party at a friend's apartment. Music, lights, lots of people. Someone hands you a cup.",
    start: "start",
    nodes: [
      {
        id: "start",
        text: "*It is just a drink,* says the person handing you the cup. *Everyone is having one. Relax!* You are feeling shy and out of place. A drink would help you feel like part of the room.",
        choices: [
          { label: "Take it. One won't change anything.", to: "drink" },
          { label: "Smile and say “I’m good, thanks.” Ask for water or juice.", to: "water" },
        ],
      },
      {
        id: "drink",
        text: "The first drink makes you feel warm and funny. A second follows, then a third. Someone you find attractive sits next to you, and your thinking gets looser and slower. It is past midnight.",
        choices: [
          { label: "Go with them to a quieter room.", to: "fall" },
          { label: "Realize you have gone too far. Put the cup down and text your friend to pick you up.", to: "rescue" },
        ],
      },
      {
        id: "water",
        text: "You get a juice and stand near the food. A few people tease you; one asks why. You say, *I'm on a different road right now, and I like it.* A girl in the corner nods quietly. Later, she says she is also not drinking.",
        choices: [
          { label: "Stay another hour and enjoy the music.", to: "stay" },
          { label: "Leave early with your head clear and go home.", to: "home" },
        ],
      },
      {
        id: "stay",
        ending: {
          kind: "wise",
          title: "You enjoyed it sober",
          text: "You danced, talked, laughed and remembered all of it. You found one person who is also on a road toward something. **You did not have to be a drunk version of yourself to belong.** Decide your exit time in advance so that the night ends well.",
          verse: "Ephesians 5:18",
        },
      },
      {
        id: "home",
        ending: {
          kind: "wise",
          title: "Quiet exit, clear mind",
          text: "You made your appearance, honored your friend and went home. Tomorrow there is no regret and no headache. Leaving before the night turns is **not cowardice; it is a plan.** Have an exit strategy for every party.",
          verse: "Proverbs 22:3",
        },
      },
      {
        id: "rescue",
        ending: {
          kind: "wise",
          title: "You called for help in time",
          text: "Judgment is the first thing alcohol takes, so you did the wisest thing: you **asked for rescue** before the rest unraveled. Your friend arrives, no questions. Next time, decide on your limit before the party, and agree on who will take you home.",
          verse: "Proverbs 27:12",
        },
      },
      {
        id: "fall",
        ending: {
          kind: "fall",
          title: "Alcohol turned off the brakes",
          text: "In the morning you remember some of it, with regret. This is **alcohol myopia**: in the moment, only the immediate pleasure feels real. You are not the first, and you are not beyond grace. Confess, receive mercy, and set a stronger plan: no alcohol, a sober friend, and an exit.",
          verse: "Proverbs 23:31-33",
        },
      },
    ],
  },

  "the-weed-offer": {
    id: "the-weed-offer",
    stage: "sinai",
    title: "The offer",
    setup: "A friend you like and respect is smoking on the balcony. They hold it out toward you.",
    start: "start",
    nodes: [
      {
        id: "start",
        text: "*Come on, it's just weed. It's basically a plant. It will help you relax.* You are tense after a hard week. Everyone else has tried it. You don't want to look like a prude.",
        choices: [
          { label: "Take a puff, just to fit in.", to: "puff" },
          { label: "Say, “No thanks, I’m not into it. But I’ll sit with you.”", to: "sit" },
          { label: "Walk back inside without a word.", to: "inside" },
        ],
      },
      {
        id: "puff",
        text: "It is quiet for a minute. Then you feel the haze and the strange slowness. Time stretches. Later, you realize you are laughing at nothing and that you cannot remember what you were stressed about, or what you wanted to say.",
        choices: [
          { label: "Take another. You like the feeling.", to: "fall" },
          { label: "Stop and be honest with yourself: this is exactly the escape I came here to leave behind.", to: "honest" },
        ],
      },
      {
        id: "sit",
        text: "Your friend shrugs, a little surprised. *You sure?* They keep smoking while you sit beside them. You talk for a while. They tell you they feel stuck and anxious, and that they use it to cope.",
        choices: [
          { label: "Listen, and offer to walk with them next time.", to: "listen" },
          { label: "Preach at them about how wrong it is.", to: "preach" },
        ],
      },
      {
        id: "inside",
        ending: {
          kind: "wise",
          title: "You owed no one an explanation",
          text: "Silence is a valid answer. You did not argue, you did not apologize, and you stayed in control. If it is awkward, **a short line is enough**: “I’m good.” If the pressure continues, leave. Real friends will respect it.",
          verse: "Proverbs 1:10",
        },
      },
      {
        id: "listen",
        ending: {
          kind: "wise",
          title: "You became a friend, not a judge",
          text: "You said no **and** stayed present. The best witness is often not an argument but a steady, kind person who does not need the thing. You offered a walk, and your friend said *maybe*. That is a door opened.",
          verse: "Romans 12:18",
        },
      },
      {
        id: "preach",
        ending: {
          kind: "wise",
          title: "Right answer, wrong tone",
          text: "You held your line, and that is good. But a sermon on the balcony closes doors. **Truth works best with kindness.** Next time, say your no with grace, ask a question, and listen first.",
          verse: "Ephesians 4:15",
        },
      },
      {
        id: "honest",
        ending: {
          kind: "wise",
          title: "You stopped and turned",
          text: "One puff does not undo you, but you noticed what you were chasing. **Honesty with yourself is where freedom begins.** Tell your friend. Find out what stress you were running from, and find a better answer to it: sleep, exercise, prayer, or a counselor.",
          verse: "Matthew 11:28",
        },
      },
      {
        id: "fall",
        ending: {
          kind: "fall",
          title: "The escape that costs you",
          text: "It felt good for an hour, and it leaves the problem exactly where it was, plus a groggy morning. This is not the end. **Do not hide.** Tell someone, and if you notice that you are using often or cannot stop, get professional help. See the Help page. Then rewind and say no sooner.",
          verse: "1 Peter 5:8",
        },
      },
    ],
  },

  "text-after-midnight": {
    id: "text-after-midnight",
    stage: "promised-land",
    title: "The text after midnight",
    setup: "You have been seeing someone you really like. It is 12:30 a.m. and your phone lights up.",
    start: "start",
    nodes: [
      {
        id: "start",
        text: "*I can't sleep. My parents are away. Come over? I just want to be with you.* You feel your heart speed up. You really care about this person, and you want to be close. You also know what you promised yourself.",
        choices: [
          { label: "Go. You love each other and will be careful.", to: "go" },
          { label: "Reply honestly: “I want to be with you, and I want to honor you. Not tonight. Can we talk tomorrow?”", to: "honest" },
          { label: "Call them and talk on the phone until you are both sleepy.", to: "call" },
        ],
      },
      {
        id: "go",
        text: "You take a taxi. They open the door in soft clothes, and the house is quiet. The conversation starts sweet and slow, and then it begins to drift. You can feel the line you promised yourself getting closer.",
        choices: [
          { label: "Let it go. You are in love, after all.", to: "fall" },
          { label: "Stop, say honestly what you feel, and ask for a ride home or call someone.", to: "stop" },
        ],
      },
      {
        id: "honest",
        text: "They reply a few minutes later: *Okay. I understand. I felt silly texting. Thank you for being honest.* There is a pause, then: *I need that. I do not want to rush either.* The phone is quiet.",
        choices: [
          { label: "Follow up tomorrow and agree on ground rules for evenings.", to: "rules" },
          { label: "Go to sleep and forget the matter.", to: "sleep" },
        ],
      },
      {
        id: "call",
        text: "You call. It starts with sweet words. After twenty minutes the conversation turns heated, and you realize the phone is carrying you toward the same place as the house would have.",
        choices: [
          { label: "Gently end the call: “I love talking to you. Let’s continue tomorrow.”", to: "honest" },
          { label: "Keep going. It's only talk.", to: "fall" },
        ],
      },
      {
        id: "stop",
        ending: {
          kind: "wise",
          title: "You stopped before the line",
          text: "It was not easy. They were hurt for a moment, and you were embarrassed. But because you spoke plainly, you protected both of you. **Honor is something you give someone else.** From now on, no late nights alone together. Make this a ground rule.",
          verse: "1 Thessalonians 4:6-7",
        },
      },
      {
        id: "rules",
        ending: {
          kind: "wise",
          title: "You built a wall around love",
          text: "Together you agreed: no being alone in a house, no messages after 10 p.m., and one trusted couple who check in. These rules do not weaken love; they **give it room to become strong**. Song of Solomon’s “I am a wall” is a picture of strength.",
          verse: "Song of Solomon 8:4",
        },
      },
      {
        id: "sleep",
        ending: {
          kind: "wise",
          title: "Good night, with one more step",
          text: "You protected the night. But without clear ground rules, the same temptation will return. **Do not rely on one-time willpower.** Talk with them soon, set clear boundaries together, and bring in a mentor or friend who can ask how it is going.",
          verse: "Proverbs 22:3",
        },
      },
      {
        id: "fall",
        ending: {
          kind: "fall",
          title: "A line crossed in love, still within reach of grace",
          text: "Sincere love does not make this less costly. You may feel closeness and regret together. Hear this: **God is not finished with you, and neither is your relationship.** Confess to Him, talk with the other person honestly, and consider telling a pastor or mentor. Reset your boundaries together and begin again.",
          verse: "1 John 1:9",
        },
      },
    ],
  },
};

export const scenarioList = (): Scenario[] => Object.values(scenarios);

export const scenarioRefs = (): string[] =>
  Object.values(scenarios).flatMap((s) => s.nodes.flatMap((n) => (n.ending ? [n.ending.verse] : [])));
