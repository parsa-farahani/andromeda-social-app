import { getAdminUsers } from "@/utils/pagedFetch/adminUsers";
import UsersTable from "./UsersTable";

const UsersTableWrapper = async ({ page, q }: { page: number; q?: string }) => {

   const { users, totalPages, page: current } = await getAdminUsers(page, q);

   await new Promise((res) => setTimeout(res, 1000))

   return (
      <UsersTable
         users={users}
         page={current}
         totalPages={totalPages}
         q={q}
      />
   );
};

export default UsersTableWrapper;