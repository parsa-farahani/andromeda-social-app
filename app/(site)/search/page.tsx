import Results from "@/components/templates/search/Results";
import React, { Suspense } from "react";
import Loading from "./loading";

const Search = async ({
   searchParams,
}: {
   searchParams: Promise<{
      q?: string | string[];
      tag?: string | string[];
   }>;
}) => {

   const params = await searchParams;

   const key = JSON.stringify(params);

   await new Promise((res) => setTimeout(res, 1000));


   // We used 'Suspense' with a 'key' from 'params' here, because
   // when search-params are changed (q, tag), we want to render
   // '<Results/>' again
   // so when search-params changes, the Suspense and its Results is rendered again
   // so we can show a 'Skenleton' again - on each search-params change

   return (
     <Suspense
        key={key}
        fallback={<Loading />}
      >
        <Results params={params} />
     </Suspense>
   );
};

export default Search;
