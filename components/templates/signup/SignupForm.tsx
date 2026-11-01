"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   Field,
   FieldGroup,
   FieldLabel,
   FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { signupSchema, SignupSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { getSafeReturnUrl } from "@/utils/safeRedirect";

const SignupForm = ({
   isModal,
   returnUrl,
}: {
   isModal?: boolean;
   returnUrl?: string;
}) => {
   const router = useRouter();

   const {
      reset,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<SignupSchema>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         username: "",
         email: "",
         password: "",
      },
   });

   const [isLoading, setIsLoading] = useState(false);

   const handleSignup = async (values: SignupSchema) => {
      setIsLoading(true);

      try {
         const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
         });

         if (res.status === 201) {
            reset();

            toast.add({
               type: "success",
               title: "Registered Successfully!",
            });

            if (returnUrl) {
               window.location.replace(getSafeReturnUrl(returnUrl));
               return;
            }
            // router.back();
            window.location.replace("/");
            return;
         } else if (res.status === 409) {
            toast.add({
               type: "error",
               title: "Email or Username Already Exists",
            });
            return;
         } else if (res.status === 422) {
            toast.add({
               type: "error",
               title: "Invalid Data - Try again",
            });
            return;
         } else {
            throw new Error("Unknown Error");
         }
      } catch (error: unknown) {
         toast.add({
            type: "error",
            title: `Error Signing up - ${error instanceof Error ? error?.message : "Unknown Error"}`,
         });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="relative w-full border rounded-xl p-8 pt-12 bg-background">
         <span className="absolute left-5 top-5">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-2 bg-purple-200"></span>

            <span className="absolute -z-1 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-15 bg-purple-400 blur-xl blur-out-lg"></span>
         </span>
         <form className="w-full" onSubmit={handleSubmit(handleSignup)}>
            <FieldGroup className="gap-5 max-md:gap-0">
               <Field>
                  <FieldLabel htmlFor="fieldgroup-name" className="text-xl">
                     Username
                  </FieldLabel>
                  <Input
                     id="fieldgroup-name"
                     className="py-6"
                     placeholder="Your Username..."
                     {...register("username")}
                     aria-invalid={!!errors.username}
                     disabled={isSubmitting || isLoading}
                  />

                  <div className="min-h-5">
                     {errors.username && (
                        <FieldError>{errors.username?.message}</FieldError>
                     )}
                  </div>
               </Field>
               <Field>
                  <FieldLabel htmlFor="fieldgroup-email" className="text-xl">
                     Email
                  </FieldLabel>
                  <Input
                     id="fieldgroup-email"
                     className="py-6"
                     type="email"
                     placeholder="name@example.com"
                     {...register("email")}
                     aria-invalid={!!errors.email}
                     autoComplete="email"
                     disabled={isSubmitting || isLoading}
                  />

                  <div className="min-h-5">
                     {errors.email && (
                        <FieldError>{errors.email?.message}</FieldError>
                     )}
                  </div>
               </Field>
               <Field>
                  <FieldLabel htmlFor="fieldgroup-password" className="text-xl">
                     Password
                  </FieldLabel>
                  <Input
                     type="password"
                     id="fieldgroup-password"
                     className="py-6"
                     placeholder="Your Password..."
                     {...register("password")}
                     aria-invalid={!!errors.password}
                     disabled={isSubmitting || isLoading}
                  />

                  <div className="min-h-5">
                     {errors.password && (
                        <FieldError>{errors.password?.message}</FieldError>
                     )}
                  </div>
               </Field>
               <Field orientation="horizontal">
                  <Button
                     disabled={isSubmitting || isLoading}
                     type="reset"
                     variant="outline"
                  >
                     Reset
                  </Button>
                  <Button disabled={isSubmitting || isLoading} type="submit">
                     {isLoading ? "Registering..." : "Register"}
                  </Button>
               </Field>
            </FieldGroup>
         </form>
         <div className="mt-5 text-sm">
            <p>
               Already have an account? Go to{" "}
               {isModal ? (
                  <Link href="/signin" className="text-sky-300 underline">
                     Login
                  </Link>
               ) : (
                  <>
                     {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                     <a
                        href={`/signin${returnUrl ? `?return_url=${encodeURIComponent(returnUrl)}` : ""}`}
                        className="text-sky-300 underline"
                     >
                        Login
                     </a>
                  </>
               )}
               .
            </p>
         </div>
      </div>
   );
};

export default SignupForm;
