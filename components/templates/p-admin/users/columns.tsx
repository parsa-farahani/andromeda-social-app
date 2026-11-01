
"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import BanButton from "./BanButton";
import { getCreatedAt } from "@/utils/objectId";



export type AdminUserRow = {
   _id: string;
   username: string;
   email: string;
   avatar?: string;
   role: "USER" | "ADMIN";
   isBanned?: boolean;
   createdAt?: string;
};



export const columns: ColumnDef<AdminUserRow>[] = [
   {
      id: "user",
      header: "User",
      cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <div className="size-8 overflow-clip rounded-full border">
               <Image
                  src={row.original?.avatar ?? "/images/users/avatar.png"}
                  width={64} height={64} alt=""
                  className="size-full object-cover"
               />
            </div>
            <span className="font-semibold">{row.original.username}</span>
         </div>
      ),
   },
   {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
         <span className="block max-w-56 truncate text-blue-300">{row.original.email}</span>
      ),
   },
   {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
         <Badge variant={row.original.role === "ADMIN" ? "default" : "secondary"}>
            {row.original.role}
         </Badge>
      ),
   },
   {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
         row.original.isBanned
            ? <Badge variant="destructive">Banned</Badge>
            : <Badge variant="outline">Active</Badge>,
   },
   {
      id: "joined",
      header: "Joined",
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
      header: "",
      cell: ({ row }) => (
         <div className="flex justify-end">
            <BanButton
               userId={row.original._id}
               username={row.original.username}
               isBanned={Boolean(row.original.isBanned)}
               disabled={row.original.role === "ADMIN"}
            />
         </div>
      ),
   },
];