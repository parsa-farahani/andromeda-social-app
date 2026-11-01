"use client";

import React, { useCallback, useState } from "react";
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { Cross, Edit, X } from "lucide-react";
import Modal from "@/components/modules/Modal/Modal";
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { profileSchema, ProfileSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/mongooseTypes";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface EditProfileProps {
   user: User;
}

const EditProfile = ({ user }: EditProfileProps) => {
   const router = useRouter();

   const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

   const [showEditModal, setShowEditModal] = useState(false);

   const handleCloseModal = useCallback(() => {
      setShowEditModal(false);
      setPreviewAvatar(null);
   }, []);

   const {
      reset,
      setValue,
      register,
      handleSubmit,
      getValues,
      formState: { errors, isSubmitting },
   } = useForm<ProfileSchema>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
         username: user.username || "",
         email: user.email || "",
         avatar: undefined,
      },
   });

   const handleEditProfile = async (values: ProfileSchema) => {
      const formData = new FormData();

      formData.set("username", values.username);
      formData.set("email", values.email);

      const avatarFile = values.avatar?.[0];

      if (avatarFile) {
         formData.set("avatar", avatarFile);
      }

      formData.set("username", values.username);

      try {
         const res = await fetch(`/api/users/${user._id}`, {
            method: "PUT",
            body: formData,
         });

         if (res.status === 200) {
            toast.add({
               type: "success",
               title: "Profile Updated Successfully.",
            });

            handleCloseModal();
            router.refresh();
            return;
         } else if (res.status === 422) {
            toast.add({
               type: "error",
               title: "Invalid Data",
            });
            return;
         } else if (res.status === 401) {
            toast.add({
               type: "error",
               title: "Unauthorized",
            });
            return;
         }
      } catch (error) {
         toast.add({
            type: "error",
            title: `Something went wrong - ${error instanceof Error ? error?.message : error}`,
         });
      }
   };

   const handleDiscard = () => {
      setValue("username", user.username || "");
      setValue("email", user.email || "");
      setValue("avatar", undefined);

      const fileInput = document.getElementById(
         "fieldgroup-avatar",
      ) as HTMLInputElement | null;

      if (fileInput) {
         fileInput.value = "";
      }

      setPreviewAvatar(null);

      handleCloseModal();
   };

   const handleShowAvatarPreview = (
      event: React.ChangeEvent<HTMLInputElement>,
   ) => {
      const file = event.target.files?.[0];

      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setPreviewAvatar(previewUrl);
   };

   return (
      <>
         <Tooltip>
            <TooltipTrigger onClick={() => setShowEditModal(true)}
               className="inline-block border rounded-full p-2 aspect-square cursor-pointer text-xs"
            >
               <span className="">
                  {/* <MoreHorizontal /> */}
                  <Edit className="size-4" />
               </span>
            </TooltipTrigger>
            <TooltipContent>
               <p>Edit Profile</p>
            </TooltipContent>
         </Tooltip>

         <Modal isOpen={showEditModal} onClose={handleCloseModal}>
            <div className="bg-background border rounded-lg p-5 w-[100vw] md:max-w-[80vw] md:w-[600px]">
               <div className="flex justify-end">
                  <Button
                     variant="outline"
                     className="cursor-pointer"
                     type="button"
                     onClick={handleDiscard}
                  >
                     Discard
                  </Button>
               </div>

               <form onSubmit={handleSubmit(handleEditProfile)}>
                  <FieldGroup className="gap-3">
                     <Field className="flex! items-center!">
                        <FieldLabel
                           className="text-xl cursor-pointer block size-24! rounded-full overflow-clip"
                           htmlFor="fieldgroup-avatar"
                        >
                           <Image
                              src={
                                 previewAvatar ||
                                 user.avatar ||
                                 "/images/users/avatar.png"
                              }
                              width={100}
                              height={100}
                              alt=""
                              className="block size-full object-cover"
                           />
                        </FieldLabel>
                        <Input
                           type="file"
                           id="fieldgroup-avatar"
                           className="sr-only"
                           {...register("avatar", {
                              onChange: handleShowAvatarPreview,
                           })}
                           aria-invalid={!!errors.avatar}
                        />

                        <div className="min-h-5 text-center">
                           {errors.avatar && (
                              <FieldError>{errors.avatar?.message}</FieldError>
                           )}
                        </div>
                     </Field>

                     <Field>
                        <FieldLabel
                           className="text-xl"
                           htmlFor="fieldgroup-username"
                        >
                           Username
                        </FieldLabel>
                        <Input
                           id="fieldgroup-username"
                           className="py-6 rounded-none border-0 border-b bg-[#00000000]! text-lg! focus:ring-0 focus-visible:ring-0"
                           {...register("username")}
                           aria-invalid={!!errors.username}
                        />

                        <div className="min-h-5">
                           {errors.username && (
                              <FieldError>
                                 {errors.username?.message}
                              </FieldError>
                           )}
                        </div>
                     </Field>

                     <Field>
                        <FieldLabel
                           className="text-xl"
                           htmlFor="fieldgroup-email"
                        >
                           Email
                        </FieldLabel>
                        <Input
                           type="text"
                           id="fieldgroup-email"
                           className="py-6 rounded-none border-0 border-b bg-[#00000000]! text-lg! focus:outline-0! focus-visible:outline-0! focus:ring-0 focus-visible:ring-0"
                           {...register("email")}
                           aria-invalid={!!errors.email}
                        />

                        <div className="min-h-5">
                           {errors.email && (
                              <FieldError>{errors.email?.message}</FieldError>
                           )}
                        </div>
                     </Field>

                     <Field orientation="horizontal">
                        <Button
                           className="w-full cursor-pointer"
                           type="submit"
                           disabled={isSubmitting}
                        >
                           Confirm
                        </Button>
                     </Field>
                  </FieldGroup>
               </form>
            </div>
         </Modal>
      </>
   );
};

export default EditProfile;
