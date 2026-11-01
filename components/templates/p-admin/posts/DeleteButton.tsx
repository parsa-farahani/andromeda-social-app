"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
   AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
   AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";


interface DeleteButtonProps {
   postId: string;
   disabled?: boolean
}


const DeleteButton = ({
   postId, disabled,
}: DeleteButtonProps) => {


   const router = useRouter();

   const [open, setOpen] = useState(false);
   const [loading, setLoading] = useState(false);


   const handleDelete = async () => {

      setLoading(true);

      try {
         const url = `/api/admin/posts/${postId}`;

         const res = await fetch(url, {
            method: "DELETE",
         });

         if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.message ?? "Request failed");
         }

         toast.add(
            {
               type: "success",
               title: "Post Deleted Successfully",
            }
         );

         setOpen(false);

         router.refresh();
         
      } catch (e) {
         toast.add({ type: "error", title: e instanceof Error ? e.message : "Unknown Error" });
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <Button
            size="sm"
            variant={"destructive"}
            disabled={disabled}
            onClick={() => setOpen(true)}
            className="cursor-pointer"
         >
            Delete
         </Button>

         <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>
                     Delete this post?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                     this post and all of its comments will be deleted
                  </AlertDialogDescription>
               </AlertDialogHeader>

               <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                  <Button onClick={handleDelete} disabled={loading}>
                     {loading ? "Loading..." : "Confirm"}
                  </Button>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
};

export default DeleteButton;