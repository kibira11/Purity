import type { TranslationId } from "@/lib/types";

/**
 * Short quotations from modern translations, used where they make a verse clearer.
 * Kept well inside each publisher's free-quotation limits, and credited in the UI and footer.
 * KJV and WEB (public domain) are fetched in full into verses.json by `npm run verses`.
 */
export const modern: Record<string, { tr: Exclude<TranslationId, "KJV" | "WEB">; text: string }> = {
  "Matthew 5:8": { tr: "ESV", text: "Blessed are the pure in heart, for they shall see God." },
  "Proverbs 4:23": { tr: "ESV", text: "Keep your heart with all vigilance, for from it flow the springs of life." },
  "John 8:34-36": {
    tr: "ESV",
    text: "Jesus answered them, \u201cTruly, truly, I say to you, everyone who practices sin is a slave to sin. The slave does not remain in the house forever; the son remains forever. So if the Son sets you free, you will be free indeed.\u201d",
  },
  "John 8:36": { tr: "ESV", text: "So if the Son sets you free, you will be free indeed." },
  "Psalm 34:17": {
    tr: "ESV",
    text: "When the righteous cry for help, the LORD hears and delivers them out of all their troubles.",
  },
  "Exodus 2:23-25": {
    tr: "ESV",
    text: "During those many days the king of Egypt died, and the people of Israel groaned because of their slavery and cried out for help. Their cry for rescue from slavery came up to God. And God heard their groaning, and God remembered his covenant with Abraham, with Isaac, and with Jacob. God saw the people of Israel\u2014and God knew.",
  },

  // Stage 2: Passover
  "Exodus 12:13": {
    tr: "ESV",
    text: "The blood shall be a sign for you, on the houses where you are. And when I see the blood, I will pass over you, and no plague will fall upon you to destroy you, when I strike the land of Egypt.",
  },
  "Romans 8:1-2": {
    tr: "ESV",
    text: "There is therefore now no condemnation for those who are in Christ Jesus. For the law of the Spirit of life has set you free in Christ Jesus from the law of sin and death.",
  },
  "2 Corinthians 5:17": {
    tr: "ESV",
    text: "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.",
  },
  "Titus 2:11-12": {
    tr: "ESV",
    text: "For the grace of God has appeared, bringing salvation for all people, training us to renounce ungodliness and worldly passions, and to live self-controlled, upright, and godly lives in the present age,",
  },

  // Stage 3: Red Sea
  "Exodus 14:13-14": {
    tr: "ESV",
    text: "And Moses said to the people, \u201cFear not, stand firm, and see the salvation of the LORD, which he will work for you today. For the Egyptians whom you see today, you will never see again. The LORD will fight for you, and you have only to be silent.\u201d",
  },
  "Job 31:1": { tr: "ESV", text: "I have made a covenant with my eyes; how then could I gaze at a virgin?" },
  "Romans 6:12-13": {
    tr: "ESV",
    text: "Let not sin therefore reign in your mortal body, to make you obey its passions. Do not present your members to sin as instruments for unrighteousness, but present yourselves to God as those who have been brought from death to life, and your members to God as instruments for righteousness.",
  },
  "1 Corinthians 10:13": {
    tr: "ESV",
    text: "No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape, that you may be able to endure it.",
  },
  "1 Corinthians 6:18-20": {
    tr: "ESV",
    text: "Flee from sexual immorality. Every other sin a person commits is outside the body, but the sexually immoral person sins against his own body. Or do you not know that your body is a temple of the Holy Spirit within you, whom you have from God? You are not your own, for you were bought with a price. So glorify God in your body.",
  },

  // Stage 4: Wilderness
  "Lamentations 3:22-23": {
    tr: "ESV",
    text: "The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.",
  },
  "Romans 12:2": {
    tr: "ESV",
    text: "Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.",
  },
  "Psalm 139:14": {
    tr: "ESV",
    text: "I praise you, for I am fearfully and wonderfully made. Wonderful are your works; my soul knows it very well.",
  },
  "Numbers 11:4-6": {
    tr: "ESV",
    text: "Now the rabble that was among them had a strong craving. And the people of Israel also wept again and said, \u201cOh that we had meat to eat! We remember the fish we ate in Egypt that cost nothing, the cucumbers, the melons, the leeks, the onions, and the garlic. But now our strength is dried up, and there is nothing at all but this manna to look at.\u201d",
  },
  "Proverbs 24:16": {
    tr: "ESV",
    text: "for the righteous falls seven times and rises again, but the wicked stumble in times of calamity.",
  },

  // Stage 5: Sinai
  "1 Corinthians 6:19-20": {
    tr: "ESV",
    text: "Or do you not know that your body is a temple of the Holy Spirit within you, whom you have from God? You are not your own, for you were bought with a price. So glorify God in your body.",
  },
  "Ephesians 5:18": {
    tr: "ESV",
    text: "And do not get drunk with wine, for that is debauchery, but be filled with the Spirit,",
  },
  "Galatians 5:19-21": {
    tr: "ESV",
    text: "Now the works of the flesh are evident: sexual immorality, impurity, sensuality, idolatry, sorcery, enmity, strife, jealousy, fits of anger, rivalries, dissensions, divisions, envy, drunkenness, orgies, and things like these. I warn you, as I warned you before, that those who do such things will not inherit the kingdom of God.",
  },
  "Psalm 127:2": {
    tr: "ESV",
    text: "It is in vain that you rise up early and go late to rest, eating the bread of anxious toil; for he gives to his beloved sleep.",
  },
  "Mark 2:27": { tr: "ESV", text: "And he said to them, \u201cThe Sabbath was made for man, not man for the Sabbath.\u201d" },

  // Stage 6: Jordan
  "Ecclesiastes 4:9-10": {
    tr: "ESV",
    text: "Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up his fellow. But woe to him who is alone when he falls and has not another to lift him up!",
  },
  "James 5:16": {
    tr: "ESV",
    text: "Therefore, confess your sins to one another and pray for one another, that you may be healed. The prayer of a righteous person has great power as it is working.",
  },
  "1 Timothy 5:1-2": {
    tr: "ESV",
    text: "Do not rebuke an older man but encourage him as you would a father, younger men as brothers, older women as mothers, younger women as sisters, in all purity.",
  },
  "Psalm 103:2": { tr: "ESV", text: "Bless the LORD, O my soul, and forget not all his benefits," },
  "Joshua 5:9": {
    tr: "ESV",
    text: "The LORD said to Joshua, \u201cToday I have rolled away the reproach of Egypt from you.\u201d And so the name of that place is called Gilgal to this day.",
  },

  // Stage 7: Promised Land
  "Psalm 37:4": { tr: "ESV", text: "Delight yourself in the LORD, and he will give you the desires of your heart." },
  "Proverbs 18:22": { tr: "ESV", text: "He who finds a wife finds a good thing and obtains favor from the LORD." },
  "Ruth 3:10-11": {
    tr: "ESV",
    text: "And he said, \u201cMay you be blessed by the LORD, my daughter. You have made this last kindness greater than the first in that you have not gone after young men, whether poor or rich. And now, my daughter, do not fear. I will do for you all that you ask, for all my fellow townsmen know that you are a worthy woman.\u201d",
  },
  "Song of Solomon 8:4": {
    tr: "ESV",
    text: "I adjure you, O daughters of Jerusalem, that you not stir up or awaken love until it pleases.",
  },
  "Genesis 2:24": {
    tr: "ESV",
    text: "Therefore a man shall leave his father and his mother and hold fast to his wife, and they shall become one flesh.",
  },
  "Psalm 27:14": {
    tr: "ESV",
    text: "Wait for the LORD; be strong, and let your heart take courage; wait for the LORD!",
  },

  // Stage 8: Zion
  "Psalm 24:3-4": {
    tr: "ESV",
    text: "Who shall ascend the hill of the LORD? And who shall stand in his holy place? He who has clean hands and a pure heart, who does not lift up his soul to what is false and does not swear deceitfully.",
  },
  "Galatians 5:16": { tr: "ESV", text: "But I say, walk by the Spirit, and you will not gratify the desires of the flesh." },
  "Luke 22:31-32": {
    tr: "ESV",
    text: "Simon, Simon, behold, Satan demanded to have you, that he might sift you like wheat, but I have prayed for you that your faith may not fail. And when you have turned again, strengthen your brothers.",
  },
  "Psalm 126:3": { tr: "ESV", text: "The LORD has done great things for us; we are glad." },
  "Revelation 21:5": { tr: "ESV", text: "And he who was seated on the throne said, \u201cBehold, I am making all things new.\u201d" },
};