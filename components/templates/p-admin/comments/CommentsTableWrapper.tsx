import { getAdminComments } from "@/utils/pagedFetch/adminComments";
import CommentsTable from "./CommentsTable";

const CommentsTableWrapper = async ({ page, q }: { page: number; q?: string }) => {

   const { comments, totalPages, page: current } = await getAdminComments(page, q);

   await new Promise((res) => setTimeout(res, 1000))

   return (
      <CommentsTable
         comments={comments}
         page={current}
         totalPages={totalPages}
         q={q}
      />
   );
};

export default CommentsTableWrapper;