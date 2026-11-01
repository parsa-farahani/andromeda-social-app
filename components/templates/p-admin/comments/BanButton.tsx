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


interface BanButtonProps {
   userId: string;
   username: string;
   isBanned: boolean;
   disabled?: boolean
}


const BanButton = ({
   userId, username, isBanned, disabled,
}: BanButtonProps) => {


   const router = useRouter();

   const [open, setOpen] = useState(false);
   const [reason, setReason] = useState("");
   const [loading, setLoading] = useState(false);


   const handleSubmit = async () => {

      setLoading(true);

      try {
         const url = `/api/admin/users/${userId}/${isBanned ? "lift-ban" : "ban"}`;

         const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(isBanned ? {} : { reason }),
         });

         if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.message ?? "Request failed");
         }

         toast.add({ type: "success", title: isBanned ? "Ban lifted" : "User banned" });

         setOpen(false);

         setReason("");
         
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
            variant={isBanned ? "outline" : "destructive"}
            disabled={disabled}
            onClick={() => setOpen(true)}
            className="cursor-pointer"
         >
            {isBanned ? "Lift Ban" : "Ban"}
         </Button>

         <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>
                     {isBanned ? `Lift ban for ${username}?` : `Ban ${username}?`}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                     {isBanned
                        ? "The user will be able to sign in again."
                        : "The user will be signed out and unable to sign in."}
                  </AlertDialogDescription>
               </AlertDialogHeader>

               {!isBanned && (
                  <Textarea
                     placeholder="Reason (optional)"
                     maxLength={300}
                     value={reason}
                     onChange={(e) => setReason(e.target.value)}
                  />
               )}

               <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                  <Button onClick={handleSubmit} disabled={loading}>
                     {loading ? "Loading..." : "Confirm"}
                  </Button>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
};

export default BanButton;