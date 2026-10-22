/** Credits that are not tied to a single piece of content. Art credits come from content/art.ts. */

/** Short, human labels shown under a verse, keyed by the translation code stored in the content. */
export const translationShort: Record<string, string> = {
  KJV: "King James Version",
  WEB: "World English Bible",
  ESV: "English Standard Version",
  NIV: "New International Version",
  NKJV: "New King James Version",
};

export const translations = [
  {
    code: "KJV",
    name: "King James Version",
    note: "Public domain. The default for key verses.",
  },
  {
    code: "WEB",
    name: "World English Bible",
    note: "Public domain. A modern-English companion to the KJV.",
  },
  {
    code: "ESV",
    name: "English Standard Version",
    note: "Short quotations only, where a modern rendering clarifies the meaning. The Holy Bible, English Standard Version, copyright 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.",
  },
  {
    code: "NIV / NKJV",
    name: "New International Version and New King James Version",
    note: "Brief quotations only, credited where they appear. NIV: copyright Biblica, Inc. NKJV: copyright Thomas Nelson. All rights reserved by their owners.",
  },
] as const;

export const tools = [
  { name: "bible-api.com", note: "KJV and WEB text, fetched at build time and stored in content/verses.json.", url: "https://bible-api.com" },
  { name: "Wikimedia Commons", note: "Public-domain artwork and metadata.", url: "https://commons.wikimedia.org" },
  { name: "Cormorant Garamond, Lora and Inter", note: "Typefaces under the SIL Open Font License, served from this site via Fontsource.", url: "https://fontsource.org" },
  { name: "Next.js, React, Tailwind CSS, Framer Motion, Supabase", note: "Open-source software this app is built with.", url: "https://nextjs.org" },
] as const;
