'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { signinSchema, SigninSchema } from "@/utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSafeReturnUrl } from "@/utils/safeRedirect";

const SigninForm = (
   {
      isModal,
      returnUrl,
   }: {
      isModal?: boolean;
      returnUrl?: string;
   }
) => {

   const router = useRouter();

   const {
      reset,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<SigninSchema>({
      resolver: zodResolver(signinSchema),
      defaultValues: {
         identifier: "",
         password: "",
      },
   });

   const [isLoading, setIsLoading] = useState(false);


   const handleSignin = async (values: SigninSchema) => {

      setIsLoading(true);

      try {
         const res = await fetch("/api/auth/signin", {
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
               title: "Signed-In Successfully!",
            });

            if (returnUrl) {
               window.location.replace(getSafeReturnUrl(returnUrl));
               return;
            }

            window.location.replace('/')
            return;
         } else if (res.status === 401) {
            toast.add({
               type: "error",
               title: "Email or Username or Password is Invalid",
            });
            return;
         }
          else if (res.status === 403) {
            toast.add({
               type: "error",
               title: "Your account is banned",
            });
            return;
         }
         else {
            toast.add({
               type: "error",
               title: "Failed to Sign-In - Unknown Error",
            });
            return;
         }
      } catch (error: unknown) {
         toast.add({
            type: "error",
            title: `Error Signing up - ${error instanceof Error ? error?.message : "Unknown Error"}`,
         });
      }
      finally {
         setIsLoading(false);
      }
      
   };

   return (
      <div className="relative w-full border rounded-xl p-8 pt-12 bg-background">
         <span className="absolute left-5 top-5">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-2 bg-sky-200"></span>

            <span className="absolute -z-1 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-15 bg-sky-400 blur-xl blur-out-lg"></span>
         </span>
         <form className="w-full" onSubmit={handleSubmit(handleSignin)}>
            <FieldGroup className="gap-5 max-md:gap-0">
               <Field>
                  <FieldLabel className="text-xl" htmlFor="fieldgroup-name">
                     Username or Email
                  </FieldLabel>
                  <Input
                     id="fieldgroup-name"
                     className="py-6"
                     placeholder="Your Username or Email..."
                     {...register("identifier")}
                     aria-invalid={!!errors.identifier}
                     autoComplete="email"
                     disabled={isSubmitting || isLoading}
                  />

                  <div className="min-h-5">
                     {errors.identifier && (
                        <FieldError>{errors.identifier?.message}</FieldError>
                     )}
                  </div>
               </Field>

               <Field>
                  <FieldLabel className="text-xl" htmlFor="fieldgroup-password">
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
                     type="reset"
                     variant="outline"
                     disabled={isSubmitting || isLoading}
                  >
                     Reset
                  </Button>
                  <Button
                     type="submit"
                     disabled={isSubmitting || isLoading}
                  >
                     {
                        (isLoading)
                        ? (
                           "Loggin In..."
                        ): "Login"
                     }
                  </Button>
               </Field>
            </FieldGroup>
         </form>
         <div className="mt-5 text-sm">
            <p>
               Don&apos;t have an account yet? Go to{" "}

               {
                  isModal
                  ? (
                     <Link href={`/signup${returnUrl ? `?return_url=${encodeURIComponent(returnUrl)}` : ''}`} className="text-sky-300 underline">
                        Register
                     </Link>
                  ): (
                     <>
                        <a href="/signup" className="text-sky-300 underline">
                           Register
                        </a>
                     </>
                  )
               }
               {" "}
               .
            </p>
         </div>
      </div>
   );
};

export default SigninForm;
