"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { columns, AdminUserRow } from "./columns";


const UsersTable = ({
   users, page, totalPages, q,
}: { users: AdminUserRow[]; page: number; totalPages: number; q?: string }) => {

   const router = useRouter();

   const [search, setSearch] = useState(q ?? "");


   const table = useReactTable({
      data: users,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getRowId: (row) => row._id,
      manualPagination: true, 
   });


   const [isPending, startTransition] = useTransition();

   const go = (newPage: number, searchTerm = search) => {

      const params = new URLSearchParams();

      if (searchTerm.trim()) params.set("q", searchTerm.trim());

      if (newPage > 1) params.set("page", String(newPage));

      startTransition(() => {
         router.push(`?${params.toString()}`);
      })
   };


   return (
      <div className={`w-full flex flex-col gap-3 ${isPending ? 'opacity-60 transition-opacity' : ''}`}>

         <form
            onSubmit={(e) => { e.preventDefault(); go(1); }}
            className="flex max-w-sm gap-2"
         >
            <Input
               placeholder="Search username or email..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               disabled={isPending}
            />
            <Button 
               type="submit"
               disabled={isPending}
            >
               Search
            </Button>
         </form>

         <div className="rounded-lg border w-full max-w-full overflow-x-auto">
            <Table>
               <TableHeader>
                  {
                     table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                           {
                              hg.headers.map((h) => (

                                 <TableHead key={h.id}>
                                    {
                                       flexRender(h.column.columnDef.header, h.getContext())
                                    }
                                 </TableHead>
                              ))
                           }
                        </TableRow>
                     ))
                  }
               </TableHeader>
               <TableBody>
                  {
                     table.getRowModel().rows.length ? (
                        table
                        .getRowModel()
                        .rows.map((row) => (
                           <TableRow key={row.id}>
                              {
                                 row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                 ))
                              }
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                              No users found.
                           </TableCell>
                        </TableRow>
                     )
                  }
               </TableBody>
            </Table>
         </div>

         <div className="flex items-center justify-end gap-3">

            <span className="text-sm text-gray-500">
               Page {page} of {totalPages}
            </span>

            <Button
               variant="outline"
               size="sm"
               disabled={page <= 1}
               onClick={() => go(page - 1)}
            >
               Previous
            </Button>

            <Button
               variant="outline"
               size="sm"
               disabled={page >= totalPages}
               onClick={() => go(page + 1)}
            >
               Next
            </Button>
         </div>
      </div>
   );
};

export default UsersTable;