export type AppSearchParam = string | string[] | undefined;


export const MAX_WORDS = 10;
export const MAX_TAGS = 5;
export const MAX_LEN = 50;

// this function, finds all of 'special regex-signs' in search-query, and puts a 'back-slash' before them
// -> so if user puts a regex-sign in search-query, it is considered as a plain text in regex

export const escapeRegex = (s: string) =>
   s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


const toArray = (v: AppSearchParam): string[] =>
   v === undefined ? [] : Array.isArray(v) ? v : [v];



// Set conversion -> to remove repetitive queries
// I also added limit for each query-term length - otherwise a user can send a long long URL-SearchPrams string to server

export function normalizeSearchParams({ q, tag }: { q?: AppSearchParam; tag?: AppSearchParam }) {

   const words = [...new Set(
      toArray(q)
         // flatMap() is because, 'q=a b' and 'q=a&q=b' have the same result: ['a', 'b']
         .flatMap((s) => s.trim().split(/\s+/))
         .filter(Boolean)
         .map((w) => w.slice(0, MAX_LEN).toLowerCase())
   )].slice(0, MAX_WORDS);

   const tags = [...new Set(
      toArray(tag)
         // also deleted '#', if it is in start of the 'tag name' (like: tag=%23hi)
         .map((t) => t.trim().replace(/^#/, '').toLowerCase())
         .filter(Boolean)
         .map((t) => t.slice(0, MAX_LEN))
   )].slice(0, MAX_TAGS);

   return { words, tags };
}