import type { Metadata } from "next";
import "@/styles/globals.css";
import { cn } from "@/utils/shadcn/utils";
import { geist, geistPixel } from "@/utils/fonts";
import { Toaster } from "@/components/ui/toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import SidebarWrapper from "@/components/modules/AppSidebar/SidebarWrapper";
import SidebarSkeleton from "@/components/modules/AppSidebar/SidebarSkeleton";



export const metadata: Metadata = {
  title: "Andromeda - Social App",
  description: "Social Media App - Created with Nextjs",
};


export default function RootLayout({ children }: LayoutProps<"/">) {

  
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", geistPixel.variable, geist.variable)}
    >
      <body className="dark min-h-full flex flex-col">


        
        {/* <SidebarProvider>
          
          <Suspense
            fallback={<SidebarSkeleton />}
          >
            <SidebarWrapper />
          </Suspense>
        </SidebarProvider> */}
        <div className="w-full" >
          {
            children
          }
        </div>


        <Toaster />
      </body>
    </html>
  );
}
