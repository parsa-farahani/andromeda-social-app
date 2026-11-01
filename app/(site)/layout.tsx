import ResponsiveSidebarProvider from "@/components/modules/AppSidebar/ResponsiveSidebarProvider"
import SidebarSkeleton from "@/components/modules/AppSidebar/SidebarSkeleton"
import SidebarWrapper from "@/components/modules/AppSidebar/SidebarWrapper"
import { Suspense } from "react"



const Layout = (
   {
      children,
      modal,
   }: LayoutProps<"/">
) => {

  return (
    <div className="h-svh flex flex-col min-h-0 relative" >
      
      <ResponsiveSidebarProvider  
      >
          
          <Suspense
            fallback={<SidebarSkeleton />}
          >
            <SidebarWrapper />
          </Suspense>
          <div className="grow flex flex-col min-h-0 md:pl-[calc(var(--sidebar-width-icon)+1rem)] lg:pl-0" >
            {children}  
          </div>
        </ResponsiveSidebarProvider>
      {modal}
    </div>
  )
}

export default Layout