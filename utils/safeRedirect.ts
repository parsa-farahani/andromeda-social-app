
export const getSafeReturnUrl = (url?: string | null, fallback = '/') => {
   if (!url) return fallback;

   if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) {
      return fallback;
   }

   return url;
};