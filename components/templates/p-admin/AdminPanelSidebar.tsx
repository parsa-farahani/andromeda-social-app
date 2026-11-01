'use client'

import React from 'react'
import Link from "next/link";
import {
  Headphones,
  StickyNote,
  User,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/pAdminSidebar"
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';


const navItems = [

   {
     title: "Admin Panel",
     href: "/p-admin",
     icon: Headphones,
     filledIcon: false,
   },
   {
     title: "Users",
     href: "/p-admin/users",
     icon: User,
     filledIcon: false,
   },
  {
    title: "Posts",
    href: "/p-admin/posts",
    icon: StickyNote,
    filledIcon: true,
  },
  {
    title: "Comments",
    href: "/p-admin/comments",
    icon: MessageSquare,
    filledIcon: false,
  },
  {
    title: "Reports",
    href: "/p-admin/reports",
    icon: AlertCircle,
    filledIcon: false,
  },
];


const AdminPanelSidebar = () => {

   const path = usePathname();

  const { setOpenMobile } = useSidebar();


  return (
      <Sidebar
          className=""
        >
            <SidebarHeader className='h-20' >
              <Link href="/" >
                <h2 className="px-2 text-2xl font-semibold flex flex-col"> 
                  <span>
                     <span
                     style={{
                        color: 'transparent',
                        backgroundImage: 'conic-gradient(white, skyblue, pink, cyan)',
                        backgroundClip: 'text',
                        fontSize: '32px'
                     }}
                     >
                     A
                     </span>
                     ndromeda
                  </span>  
                  <span className='text-sm flex gap-2 items-center text-indigo-300'>
                     Admin Panel
                  </span>
                </h2>
              </Link>
            </SidebarHeader>
            <Separator />
            <SidebarContent >
              <SidebarGroup  >
                  <SidebarMenu>
                  {navItems.map((item) => {
      
      
                    const Icon = item.icon;
      
                    const isActive = (path === item.href);
      
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} aria-current={isActive ? "page" : undefined}/>}
                          size="lg"
                          isActive={isActive}
                          tooltip={item.title}
                          className="transition-colors data-[active=true]:bg-white/10 data-[active=true]:font-semibold hover:bg-white/5 h-10"
                          onClick={() => setOpenMobile(false)}
                        >
      
                          <Icon
                            className="size-6 shrink-0"
                            fill={
                              isActive && item.filledIcon
                                ? "currentColor"
                                : "none"
                            }
                            strokeWidth={isActive ? 2.5 : 1.8}
                          />
      
                          <span>{item.title}</span>
      
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup />
            </SidebarContent>
      
          </Sidebar>
  )
}

export default AdminPanelSidebar