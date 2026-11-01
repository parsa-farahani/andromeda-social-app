"use client";
import { SidebarProvider } from "@/components/ui/pAdminSidebar";




const ResponsiveSidebarProvider = ({ children }: { children: React.ReactNode }) => {



   return (
      <SidebarProvider
         style={{
            "--sidebar-width": "12rem",
            "--sidebar-width-icon": "3.5rem",
         }  as React.CSSProperties}
      >
         {children}
      </SidebarProvider>
   );
}


export default ResponsiveSidebarProvider;