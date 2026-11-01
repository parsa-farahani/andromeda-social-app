import SignupForm from "@/components/templates/signup/SignupForm";
import { geistPixel } from "@/utils/fonts";
import { authUser } from "@/utils/serverHelpers";
import { redirect } from "next/navigation";

const Signin = async ({
   searchParams,
}: {
   searchParams: Promise<{
      return_url?: string;
   }>;
}) => {
   const { return_url: returnUrl } = await searchParams;

   const user = await authUser();

   if (user) {
      redirect("/p-user");
   }

   return (
      <div className="h-svh">
         <div className="min-h-full max-w-140 mx-auto flex flex-col justify-center gap-5  max-md:px-5">
            <h2 className={`text-8xl max-md:text-5xl! ${geistPixel.className}`}>
               Register
            </h2>

            <SignupForm returnUrl={returnUrl} />
         </div>
      </div>
   );
};

export default Signin;
