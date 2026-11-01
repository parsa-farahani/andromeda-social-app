import { Suspense } from "react";
import { redirect } from "next/navigation";
import { authAdmin } from "@/utils/serverHelpers";
import { Skeleton } from "@/components/ui/skeleton";
import InfoHeader from "@/components/templates/p-admin/InfoHeader";
import PostsTableWrapper from "@/components/templates/p-admin/posts/PostsTableWrapper";


const PostsPage = async ({
   searchParams,
}: {
   searchParams: Promise<{ page?: string; q?: string }>;
}) => {
   const admin = await authAdmin();
   if (!admin) redirect("/p-user");

   const { page, q } = await searchParams;
   const key = `${page ?? 1}-${q ?? ""}`;

   return (
    <div>
      <InfoHeader
        user={admin}
        withEdit
      />

      <hr className='mb-3' />

      <div className="px-5 pt-5 pb-20">

        <h1 className="mb-4 text-2xl">
          Posts
        </h1>
         
        <Suspense fallback={<Skeleton className="w-full h-70" />}>
          <PostsTableWrapper key={key} page={Number(page) || 1} q={q} />
        </Suspense>

      </div>
    </div>
   );
};


export default PostsPage;