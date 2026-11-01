import { Suspense } from "react";
import { redirect } from "next/navigation";
import { authAdmin } from "@/utils/serverHelpers";
import UsersTableWrapper from "@/components/templates/p-admin/users/UsersTableWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import InfoHeader from "@/components/templates/p-admin/InfoHeader";


const UsersPage = async ({
   searchParams,
}: {
   searchParams: Promise<{ page?: string; q?: string }>;
}) => {
   const admin = await authAdmin();
   if (!admin) redirect("/p-user");

   const { page, q } = await searchParams;
   const key = `${page ?? 1}-${q ?? ""}`;

   return (
    <>
      <InfoHeader
        user={admin}
        withEdit
      />

      <hr className='mb-3' />

      <div className="w-full px-5 pt-5 pb-20 grow flex flex-col min-h-0">

        <h1 className="mb-4 text-2xl">
          Users
        </h1>
         
        <Suspense fallback={<Skeleton className="w-full h-70" />}>
          <UsersTableWrapper key={key} page={Number(page) || 1} q={q} />
        </Suspense>

      </div>
    </>
   );
};


export default UsersPage;