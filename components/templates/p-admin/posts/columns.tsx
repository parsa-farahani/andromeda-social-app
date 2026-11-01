"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import BanButton from "./BanButton";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { getCreatedAt } from "@/utils/objectId";

export type AdminPostRow = {
   _id: string;
   title: string;
   tags: string[];
   user?: {
      _id: string;
      username: string;
      email: string;
      role: "ADMIN" | "USER";
      avatar?: string;
      isBanned?: boolean;
   };
   createdAt?: string;
};



export const columns: ColumnDef<AdminPostRow>[] = [
   {
      id: "post",
      header: "Post",
      cell: ({ row }) => (
         <span className="block max-w-56 truncate text-blue-300">
            {row.original.title}
         </span>
      ),
   },
   {
      id: "tags",
      header: "Tags",
      cell: ({ row }) => (
         <div className="flex items-center gap-2 max-w-30 flex-wrap">
            {row.original?.tags && row.original?.tags?.length > 0 ? (
               row.original?.tags.map((tag) => (
                  <div
                     key={tag}
                     className="text-xs bg-blue-300/20 border border-blue-300/10 rounded-sm px-1 py-0.5"
                  >
                     {`#${tag}`}
                  </div>
               ))
            ) : (
               <div className="text-gray-500/50">-</div>
            )}
         </div>
      ),
   },
   {
      id: "user",
      header: "User",
      cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <div className="size-8 overflow-clip rounded-full border">
               <Image
                  src={row.original?.user?.avatar ?? "/images/users/avatar.png"}
                  width={64}
                  height={64}
                  alt=""
                  className="size-full object-cover"
               />
            </div>
            <span className="font-semibold">
               {row.original?.user?.username ?? "Deleted User"}
            </span>
         </div>
      ),
   },
   {
      id: "email",
      header: "Email",
      cell: ({ row }) => (
         <span className="block max-w-56 truncate text-blue-300">
            {row.original?.user?.email ?? "-"}
         </span>
      ),
   },
   {
      id: "user_status",
      header: "User Status",
      cell: ({ row }) =>
         row.original?.user?.isBanned ? (
            <Badge variant="destructive">Banned</Badge>
         ) : (
            <Badge variant="outline">Active</Badge>
         ),
   },
   {
      id: "created_at",
      header: "Created At",
      cell: ({ row }) => {
         const creationDate = row.original.createdAt
            ? new Date(row.original.createdAt)
            : getCreatedAt(row.original._id);
         return (
            <span className="text-sm text-gray-500">
               {creationDate.toLocaleDateString("en-US")}
            </span>
         );
      },
   },
   {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
         const { _id, user } = row.original;
         const isAdminAuthor = user?.role === "ADMIN";

         return (
            <div className="flex items-center gap-2">
               <Link
                  href={`/posts/${_id}`}
                  className="text-xs bg-blue-300/20 border border-blue-300/10 rounded-full px-2 py-0.5"
               >
                  View
               </Link>

               <DeleteButton postId={_id} />

               {user && (
                  <BanButton
                     userId={user._id}
                     username={user.username}
                     isBanned={Boolean(user.isBanned)}
                     disabled={isAdminAuthor}
                  />
               )}
            </div>
         );
      },
   },
];
