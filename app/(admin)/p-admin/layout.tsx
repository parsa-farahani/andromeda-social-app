import AdminPanelSidebar from '@/components/templates/p-admin/AdminPanelSidebar';
import ResponsiveSidebarProvider from '@/components/templates/p-admin/ResponsiveAPSidebarProvider';
import { SidebarProvider } from '@/components/ui/pAdminSidebar'
import React, { ReactNode } from 'react'

const Layout = (
   {
      children,
   }: {
      children: ReactNode;
   }
) => {

  return (
    <div>
      <ResponsiveSidebarProvider>

         <AdminPanelSidebar />
          
          <div className="w-full grow flex flex-col min-h-0" >
            {children}  
          </div>
        </ResponsiveSidebarProvider>
    </div>
  )
}

export default Layout