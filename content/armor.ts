export interface ArmorPiece {
  id: string;
  name: string;
  /** Short plain-language meaning. */
  meaning: string;
  /** Scripture reference for the piece. */
  ref: string;
  /** A real moment where you reach for this piece. */
  situation: string;
  /** Shown after the right answer. */
  why: string;
  /** A concrete way to put it on today. */
  practice: string;
}

/** Ephesians 6:10-18, one piece at a time. */
export const armor: ArmorPiece[] = [
  {
    id: "belt",
    name: "Belt of truth",
    meaning: "The belt holds everything else in place. Truth is what you know and what you refuse to pretend.",
    ref: "Ephesians 6:14",
    situation: "A voice in your head says, *Everybody does it. It is harmless. Nobody gets hurt.*",
    why: "The enemy’s first weapon is a lie dressed as common sense. The belt of truth answers it with what God has actually said, and with honesty about what this habit really costs.",
    practice: "Write down three lies you tend to believe and the true thing God says against each.",
  },
  {
    id: "breastplate",
    name: "Breastplate of righteousness",
    meaning: "The breastplate guards the heart. Your standing is a gift: you are counted righteous in Christ.",
    ref: "Ephesians 6:14",
    situation: "After a bad moment, a voice says, *You are dirty. You will never be clean. God must be disgusted with you.*",
    why: "The accuser attacks your identity. Righteousness is not what you have earned; it is what Christ has given you. Guarding the heart means remembering whose you are.",
    practice: "Say aloud: “I am forgiven, washed and counted righteous in Christ.” Then do the next right thing.",
  },
  {
    id: "shoes",
    name: "Shoes of the gospel of peace",
    meaning: "Shoes let you stand firm on the ground and move out with readiness. Peace with God is your footing.",
    ref: "Ephesians 6:15",
    situation: "You feel anxious, unsettled, and ready to run to something to calm you down.",
    why: "When you are at peace with God, you are not scrambling for relief elsewhere. The gospel gives you ground to stand on, and readiness to walk toward others instead of away.",
    practice: "Take a slow, shoes-on walk outside and thank God for three things you have been given.",
  },
  {
    id: "shield",
    name: "Shield of faith",
    meaning: "The shield stops the flaming arrows: the sudden thoughts and urges that fly at you from nowhere.",
    ref: "Ephesians 6:16",
    situation: "Out of nowhere, a strong urge hits, along with the thought, *Did God really say you could not?*",
    why: "Fiery darts come fast and without warning. Faith lifts the shield: you trust that God is good and that His way is better, even when you feel the opposite.",
    practice: "Pick a one-line prayer, like “Lord, I trust You,” and say it the moment an urge arrives.",
  },
  {
    id: "helmet",
    name: "Helmet of salvation",
    meaning: "The helmet protects the mind. Your salvation is secure, and your future is in God’s hands.",
    ref: "Ephesians 6:17",
    situation: "You think, *I will never change. This is just who I am. I will always be like this.*",
    why: "The helmet guards your mind from hopelessness. Because you are saved, your story is not stuck. The One who began a good work in you will finish it.",
    practice: "Write down one way you have already changed since you began this journey.",
  },
  {
    id: "sword",
    name: "Sword of the Spirit",
    meaning: "The sword is the only offensive weapon in the list: the Word of God, spoken.",
    ref: "Ephesians 6:17",
    situation: "You are being tempted, and you remember that Jesus answered every temptation in the wilderness with *It is written.*",
    why: "Scripture is not only to be read; it is to be spoken against the lie. When you have a verse ready, you have something to say back.",
    practice: "Memorize one short verse this week and say it aloud when tempted.",
  },
  {
    id: "prayer",
    name: "Prayer in the Spirit",
    meaning: "Not a piece of armor, but the way you wear it all: praying at all times, and for all God’s people.",
    ref: "Ephesians 6:18",
    situation: "You feel too weak and too alone to do any of this on your own.",
    why: "You were never meant to fight on your own strength. Prayer connects you to the One who is strong, and praying *for others* draws you into the community that stands with you.",
    practice: "Pray for your friend by name today, and send them a note to let them know.",
  },
];

export const armorRefs = (): string[] => Array.from(new Set(armor.map((a) => a.ref)));
