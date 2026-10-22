import type { Testimony } from "@/lib/types";

const bg = (ref: string) =>
  `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=WEB`;

/**
 * Summaries of testimonies that are already public, each with a link to the source so you can read the whole thing.
 * They are told briefly and honestly, with no graphic detail. Add your own below or in the app.
 */
export const testimonies: Testimony[] = [
  // Scripture
  {
    id: "joseph",
    name: "Joseph",
    era: "Genesis 39",
    kind: "scripture",
    struggle: "Sexual temptation, far from home, with no one watching.",
    summary: [
      "A young slave in a foreign house, Joseph was invited again and again to sleep with his master's wife. He refused, saying he could not do such a great wickedness and sin against God.",
      "When she grabbed his garment he ran out of the house. His integrity cost him: he was falsely accused and thrown into prison.",
    ],
    turning: "He did not argue with temptation; he **fled**. And the text repeats that the LORD was with him, in the house and in the prison.",
    verse: "Genesis 39:9",
    sourceLabel: "Genesis 39 (WEB)",
    sourceUrl: bg("Genesis 39"),
  },
  {
    id: "david",
    name: "David",
    era: "2 Samuel 11\u201312; Psalm 51",
    kind: "scripture",
    struggle: "Lust, adultery, and a cover-up. A man after God's own heart who fell hard.",
    summary: [
      "At the height of his power, David saw a woman bathing, took her, and then arranged her husband's death to hide it. For months, he said nothing, and later described that silence as bones wasting away.",
      "The prophet Nathan told him a story that exposed him. David's response was immediate: *I have sinned against the LORD.*",
    ],
    turning: "He confessed, and wrote Psalm 51: *Create in me a clean heart, O God.* He did not escape the consequences, but he was forgiven, and the psalm has comforted people for three thousand years.",
    verse: "Psalm 51:10",
    sourceLabel: "2 Samuel 12 and Psalm 51 (WEB)",
    sourceUrl: bg("Psalm 51"),
  },
  {
    id: "peter",
    name: "Peter",
    era: "John 18 and 21",
    kind: "scripture",
    struggle: "Failure and shame after denying Jesus three times.",
    summary: [
      "Peter swore he would never leave Jesus. Hours later he denied he even knew Him, three times, and went out weeping bitterly.",
      "After the resurrection, Jesus met him by a fire on the beach, where Peter had denied Him by another fire.",
    ],
    turning: "Jesus asked him three times, *Do you love me?*, and each time gave him work to do: *Feed my sheep.* The failure was not the end of his story. It became part of how he strengthened others.",
    verse: "John 21:17",
    sourceLabel: "John 21 (WEB)",
    sourceUrl: bg("John 21"),
  },
  {
    id: "woman-at-the-well",
    name: "The woman at the well",
    era: "John 4",
    kind: "scripture",
    struggle: "A complicated history with relationships, and years of shame.",
    summary: [
      "She came to the well at noon, when no one else would be there. Jesus, a Jewish man, spoke to her, and without shaming her, told her the truth about her past.",
      "She was not left in her shame. He offered her *living water*, and talked with her about worship and who He was.",
    ],
    turning: "She left her water jar and ran to the town: *Come, see a man who told me everything I ever did.* The person people avoided became the first to tell her town about Jesus.",
    verse: "John 4:14",
    sourceLabel: "John 4 (WEB)",
    sourceUrl: bg("John 4"),
  },
  {
    id: "prodigal",
    name: "The prodigal son",
    era: "Luke 15",
    kind: "scripture",
    struggle: "Wasted everything on reckless living, and ended up hungry and ashamed.",
    summary: [
      "A young man took his inheritance, left home, and spent it all. When a famine came he took a job feeding pigs, and realized his father's servants ate better than he did.",
      "He rehearsed an apology and set off for home, expecting to be treated as a hired hand.",
    ],
    turning: "*While he was still far off, his father saw him and ran.* There was a robe, a ring and a feast. The father's love did not wait for the speech to finish.",
    verse: "Luke 15:20",
    sourceLabel: "Luke 15 (WEB)",
    sourceUrl: bg("Luke 15"),
  },

  // History
  {
    id: "augustine",
    name: "Augustine of Hippo",
    era: "354\u2013430",
    kind: "history",
    struggle: "Sexual desire and ambition. He prayed, famously, for purity \u201cbut not yet.\u201d",
    summary: [
      "As a young man in North Africa and Italy, Augustine lived with a partner and chased success, pleasure and the world's approval. He later wrote openly that he wanted to be freed but was afraid of being freed.",
      "He was moved by the example of friends and by hearing a child's voice say *take up and read*. He opened Romans 13 and read: *put ye on the Lord Jesus Christ, and make not provision for the flesh.*",
    ],
    turning: "He later wrote that in that moment the light of certainty flooded his heart. He went on to become one of the most influential teachers in the history of the church, and wrote the first great Christian autobiography.",
    verse: "Romans 13:14",
    sourceLabel: "Confessions, Book 8 (Project Gutenberg)",
    sourceUrl: "https://www.gutenberg.org/ebooks/3296",
  },
  {
    id: "newton",
    name: "John Newton",
    era: "1725\u20131807",
    kind: "history",
    struggle: "A wild, rebellious life at sea, including taking part in the slave trade.",
    summary: [
      "Newton lived a hard and dissolute life as a sailor. During a violent storm in 1748 he cried out to God, and later marked it as the beginning of his faith.",
      "His change was slow. For years he remained involved in the slave trade, and only later became an outspoken opponent of it and a minister.",
    ],
    turning: "He spent his life astonished at grace and wrote *Amazing Grace*. In old age he summed himself up: *I remember two things: that I am a great sinner, and that Christ is a great Saviour.*",
    verse: "1 Timothy 1:15",
    sourceLabel: "John Newton (Wikipedia)",
    sourceUrl: "https://en.wikipedia.org/wiki/John_Newton",
  },
  {
    id: "mueller",
    name: "George M\u00fcller",
    era: "1805\u20131898",
    kind: "history",
    struggle: "As a youth he stole, gambled and drank, even while studying to be a pastor.",
    summary: [
      "M\u00fcller spent his teen years in theft, drinking and gambling, and was jailed as a young man. At twenty he went with a friend to a small prayer meeting and felt something change.",
      "He later became known for caring for thousands of orphans in Bristol, relying entirely on prayer, and he kept careful records of the answers.",
    ],
    turning: "He said the change in his life began when he saw that God was real and personal. His notebooks of answered prayer became his own stones of remembrance.",
    verse: "Psalm 103:2",
    sourceLabel: "George M\u00fcller (Wikipedia)",
    sourceUrl: "https://en.wikipedia.org/wiki/George_M%C3%BCller",
  },
  {
    id: "elisabeth-elliot",
    name: "Elisabeth Elliot",
    era: "1926\u20132015",
    kind: "history",
    struggle: "Waiting: years of longing and prayer before marriage, then loss.",
    summary: [
      "Elisabeth and Jim Elliot were friends for years and waited long to marry, entrusting their desires to God. They married in 1953, and Jim was killed in 1956 while trying to reach the Waorani people in Ecuador.",
      "She later wrote *Passion and Purity*, describing what it means to give desire to God and wait.",
    ],
    turning: "She went on to live among the people who had killed her husband, and to write for decades about trusting God in loss and waiting. Her witness: *the secret is Christ in me, not me in a different set of circumstances.*",
    verse: "Psalm 27:14",
    sourceLabel: "Elisabeth Elliot (Wikipedia)",
    sourceUrl: "https://en.wikipedia.org/wiki/Elisabeth_Elliot",
  },
  {
    id: "bill-w",
    name: "Bill Wilson (Bill W.)",
    era: "1895\u20131971",
    kind: "history",
    struggle: "Severe alcoholism that cost him his career and nearly his life.",
    summary: [
      "Wilson drank heavily for years and was repeatedly hospitalized. In 1934 an old friend who had stopped drinking visited him and shared how he had changed, and Wilson had a profound spiritual experience in the hospital.",
      "He found that the most reliable way to stay sober was to share his story with another alcoholic.",
    ],
    turning: "In 1935 he co-founded Alcoholics Anonymous, where millions have found support. The principle behind it echoes the Bible: honesty, dependence on God, and helping others.",
    verse: "Galatians 6:2",
    sourceLabel: "Bill W. (Wikipedia)",
    sourceUrl: "https://en.wikipedia.org/wiki/Bill_W.",
  },

  // Modern
  {
    id: "lecrae",
    name: "Lecrae",
    era: "Contemporary",
    kind: "modern",
    struggle: "A difficult childhood, and in his youth drugs, alcohol and sexual relationships he later regretted.",
    summary: [
      "The Grammy-winning artist has spoken and written openly about his past, including a turbulent childhood, substance use and sexual struggles before he came to faith.",
      "He has also been candid that following Christ did not make life tidy: he has talked about therapy, doubt and ongoing healing.",
    ],
    turning: "His memoir *Unashamed* (2016) describes a faith that is honest about the mess. His message to young people: you do not have to pretend to be fine to come to God.",
    verse: "Psalm 34:18",
    sourceLabel: "Lecrae (Wikipedia)",
    sourceUrl: "https://en.wikipedia.org/wiki/Lecrae",
  },
  {
    id: "matt-fradd",
    name: "Matt Fradd",
    era: "Contemporary",
    kind: "modern",
    struggle: "Pornography, beginning in his youth.",
    summary: [
      "The author and speaker has described being exposed to pornography as a young person, and the years of secrecy and shame that followed.",
      "He says the turning point was telling the truth to others, and building real friendships and accountability.",
    ],
    turning: "He now writes and speaks about the harm of pornography and about hope, including the book *The Porn Myth* (2017). He emphasizes that freedom comes through community and grace, not isolation and shame.",
    verse: "James 5:16",
    sourceLabel: "Matt Fradd (Wikipedia)",
    sourceUrl: "https://en.wikipedia.org/wiki/Matt_Fradd",
  },
];

export const testimonyById = (id: string) => testimonies.find((t) => t.id === id);
