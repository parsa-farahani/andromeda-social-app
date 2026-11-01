"use client";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

const query = "(min-width: 1280px)";



const ResponsiveSidebarProvider = ({ children }: { children: React.ReactNode }) => {

   const [open, setOpen] = useState(true);

   // the sidebar is synced only for first-render, to avoid flash or
   // opened sidebar
   const [synced, setSynced] = useState(false);

   useEffect(() => {

      const mq = window.matchMedia(query);

      const sync = () => {
   
         setOpen(mq.matches);
         setSynced(true);
      }

      sync();

      const onChange = () => setOpen(mq.matches);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
   }, []);


   return (
      <SidebarProvider
         key={synced ? "synced" : "initial"}
         open={open}
         onOpenChange={setOpen}
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