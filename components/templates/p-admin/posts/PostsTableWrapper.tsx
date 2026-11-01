import PostsTable from "./PostsTable";
import { getAdminPosts } from "@/utils/pagedFetch/adminPosts";

const PostsTableWrapper = async ({ page, q }: { page: number; q?: string }) => {

   const { posts, totalPages, page: current } = await getAdminPosts(page, q);

   await new Promise((res) => setTimeout(res, 1000))

   return (
      <PostsTable
         posts={posts}
         page={current}
         totalPages={totalPages}
         q={q}
      />
   );
};

export default PostsTableWrapper;