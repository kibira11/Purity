export interface HelpLink {
  name: string;
  url: string;
  note: string;
}

export interface HelpSection {
  id: string;
  title: string;
  intro?: string;
  tone?: "urgent" | "warning" | "plain";
  links: HelpLink[];
  points?: string[];
}

/**
 * Where to find real people and real care. Website links only: phone numbers change and differ by country,
 * and a directory is always more current than a page we wrote once. Please check these now and then (npm run links).
 */
export const help: HelpSection[] = [
  {
    id: "now",
    title: "If you are in danger right now",
    tone: "urgent",
    intro:
      "If you are thinking of ending your life or hurting yourself, or someone else is in danger, please contact your local emergency services, or go to the nearest hospital, or tell a person near you right now. You matter, and this will pass with help.",
    points: [
      "Do not stay alone with those thoughts. Go to a room where someone else is, or call someone you trust.",
      "If you have a plan or the means, put distance between you and them first, then reach out.",
    ],
    links: [
      {
        name: "Find a Helpline",
        url: "https://findahelpline.com",
        note: "A free directory of crisis lines in almost every country. Choose your country and the kind of help you need.",
      },
      {
        name: "Befrienders Worldwide",
        url: "https://www.befrienders.org",
        note: "Emotional support for people in distress and thinking about suicide, with centers around the world.",
      },
      {
        name: "Befrienders Kenya",
        url: "https://www.befrienderskenya.org",
        note: "Free, confidential emotional support in Kenya.",
      },
    ],
  },
  {
    id: "withdrawal",
    title: "Before you stop drinking or using, read this",
    tone: "warning",
    intro:
      "If you drink heavily every day, or use sedatives such as benzodiazepines, stopping suddenly can cause seizures and other life-threatening symptoms. Do not stop all at once on your own. See a doctor or go to a clinic first. They can help you stop safely.",
    points: [
      "Warning signs of dangerous withdrawal: shaking, sweating, racing heart, confusion, seeing or hearing things, and seizures. Go to emergency care immediately.",
      "This is not a failure of faith. It is the body adapting to a substance, and doctors can help.",
    ],
    links: [
      {
        name: "NIAAA: alcohol and your health",
        url: "https://www.niaaa.nih.gov",
        note: "US National Institute on Alcohol Abuse and Alcoholism: plain information on alcohol use, withdrawal and treatment.",
      },
      {
        name: "NACADA (Kenya)",
        url: "https://www.nacada.go.ke",
        note: "Kenya's authority for the campaign against alcohol and drug abuse: information and links to help.",
      },
    ],
  },
  {
    id: "recovery",
    title: "Support for alcohol, drugs and other addictions",
    tone: "plain",
    links: [
      {
        name: "Alcoholics Anonymous",
        url: "https://www.aa.org",
        note: "Free meetings worldwide, in person and online.",
      },
      {
        name: "Narcotics Anonymous",
        url: "https://www.na.org",
        note: "For people who want to stop using drugs. Free and confidential.",
      },
      {
        name: "Celebrate Recovery",
        url: "https://www.celebraterecovery.com",
        note: "A Christ-centered recovery program run through local churches, for any hurt, habit or hang-up.",
      },
      {
        name: "SAMHSA treatment locator",
        url: "https://www.samhsa.gov/find-help",
        note: "United States: find treatment and support services near you.",
      },
    ],
  },
  {
    id: "sexual",
    title: "Support for pornography and sexual compulsion",
    tone: "plain",
    intro:
      "You do not have to fight this alone, and you do not have to be ashamed to ask. A counselor who understands compulsive sexual behavior can help you with the roots, not just the habit.",
    links: [
      {
        name: "Fortify",
        url: "https://www.fortifyprogram.org",
        note: "A science-informed program to help people stop pornography use, with a community and tools.",
      },
      {
        name: "Sex Addicts Anonymous",
        url: "https://saa-recovery.org",
        note: "A twelve-step fellowship for people who want to stop compulsive sexual behavior.",
      },
      {
        name: "Covenant Eyes",
        url: "https://www.covenanteyes.com",
        note: "Accountability and filtering software. It sends reports to a trusted friend instead of only blocking.",
      },
      {
        name: "Fight the New Drug",
        url: "https://fightthenewdrug.org",
        note: "A non-religious educational organization with research and recovery resources.",
      },
    ],
  },
  {
    id: "counsel",
    title: "Talking with a counselor or pastor",
    tone: "plain",
    intro:
      "A trained counselor can help with anxiety, depression, past hurts and the habits that grow from them. A pastor or mentor can walk with you spiritually. Good ones will not shame you.",
    points: [
      "Look for someone who is licensed or accredited and who will keep what you say private.",
      "Ask about their approach before you begin. It is fine to try more than one before you find the right fit.",
    ],
    links: [
      {
        name: "American Association of Christian Counselors",
        url: "https://www.aacc.net",
        note: "A directory of Christian counselors, mostly in the United States, with international resources.",
      },
      {
        name: "World Health Organization: mental health",
        url: "https://www.who.int/health-topics/mental-health",
        note: "Trusted general information on mental health and where to find care.",
      },
    ],
  },
  {
    id: "harm",
    title: "If someone has hurt or pressured you",
    tone: "plain",
    intro:
      "If you have been abused, forced, or pressured into sex, or you are afraid of someone, it is not your fault, whatever you did or did not do. Telling a trusted adult, a doctor or a helpline is a brave and good step. Sexual harm is not a sign of your impurity.",
    links: [
      {
        name: "Find a Helpline",
        url: "https://findahelpline.com",
        note: "Choose your country, then choose abuse or sexual violence support.",
      },
    ],
  },
];
