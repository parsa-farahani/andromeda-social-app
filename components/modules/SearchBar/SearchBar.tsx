"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_TAG_LENGTH, MAX_TAGS } from "@/utils/constants";
import { normalizeSearchParams } from "@/utils/search";
import { Search } from "lucide-react";
import Link from "next/link";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchBar = (
   {
      searchParams
   }: {
      searchParams: ReadonlyURLSearchParams
   }
) => {

   const router = useRouter();

   // const searchParams = useSearchParams();

   const q = searchParams.getAll('q');
   const tag = searchParams.getAll('tag');

   const { words, tags: initialTags } = normalizeSearchParams({ q, tag });

   const [searchTerm, setSearchTerm] = useState(words.join(" "));

   const [tags, setTags] = useState(initialTags);


   const parseSearchTerm = (term: string) => {
      const tags = [];
      const words = [];

      for (const part of term.trim().split(/\s+/)) {
         if (!part) continue;

         if (part.startsWith("#") && part.length > 1) {
            tags.push(part.slice(1).toLowerCase());
         } else {
            words.push(part);
         }
      }

      return { words, tags };
   };


   const pushSearch = (words: string[], newTags: string[]) => {

      const params = new URLSearchParams();

      words.forEach((w) => params.append("q", w));
      newTags.forEach((t) => params.append("tag", t));

      router.push(`/search?${params.toString()}`);
   }


   const handleRemoveTag = (tagToRemove: string) => {

      const { words } = parseSearchTerm(searchTerm);

      const newTags = tags.filter((tag) => tag.toLowerCase() !== tagToRemove.toLowerCase());

      setTags(newTags);

      pushSearch(words, newTags);
   };


   const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const { words, tags: searchTermTags } = parseSearchTerm(searchTerm);

      // we add the e'tags' that user wrote in 'Input', to the tags which are alread in 'tags' state
      const newTags = [...tags];

      if (searchTermTags.length) {

         searchTermTags.forEach((newTag) => {
   
            const normalizedtag = newTag.trim().replace(/^#+/, "");
      
            if (!normalizedtag) return;
      
            if (normalizedtag.length > MAX_TAG_LENGTH) return;
      
            const alreadyExists = newTags.some(
               (tag) => tag.toLowerCase() === newTag.toLowerCase(),
            );
      
            if (alreadyExists || newTags.length > MAX_TAGS) return;
      
            newTags.push(newTag)   
         })
      }


      pushSearch(words, newTags)
   };

   return (
      <div className="flex flex-col gap-3">
         <div className="flex items-center justify-center">
            <form
               className="h-12 border rounded-full flex items-center gap-2 focus-within:bg-white/10 focus-within:border-blue-400/60 transition p-1 w-full grow shrink-0 max-w-1/2 max-md:max-w-none"
               onSubmit={handleSearch}
            >
               <Input
                  className="bg-transparent! border-0 h-full rounded-full pl-3 focus:ring-0 focus-visible:ring-0"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />

               <Button
                  type="submit"
                  className="h-full bg-white/10 hover:bg-white/20 text-white block rounded-full cursor-pointer"
               >
                  <Search />
               </Button>
            </form>

         </div>

         <div>
            <div className="flex flex-wrap gap-2">
               {
                  (tags && tags.length > 0)
                  && (
                     tags.map((tag) => (
                        <span
                           key={tag}
                           className="inline-flex items-center gap-2 rounded-full border border-sky-300/50 bg-sky-300/20 px-3 py-1 text-sm"
                        >
                           <Link
                              href={`/search?tag=${tag}`}
                           >
                              #{encodeURIComponent(tag)}
                           </Link>
                           <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              aria-label={`Remove ${tag}`}
                              className="text-muted-foreground hover:text-white"
                           >
                              ×
                           </button>
                        </span>
                     ))
                  )
               }
            </div>
         </div>
      </div>
   );
};

export default SearchBar;
