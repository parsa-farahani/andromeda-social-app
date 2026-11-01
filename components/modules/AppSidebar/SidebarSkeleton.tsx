import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import React from 'react'

const SidebarSkeleton = () => {
  return (
    <Sidebar
      className="max-lg:hidden! max-lg:w-0"
    >
      <SidebarHeader >
        <Link href="/" >
          <h2 className="px-2 text-2xl font-semibold">   
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
          </h2>
        </Link>
      </SidebarHeader>
      <SidebarContent >
              <SidebarGroup  >
                  <SidebarMenu>
                  {Array(5).fill(null).map((item, i) => {

      
                    return (
                      <SidebarMenuItem key={i} className="mb-2" >
                        <Skeleton className="w-full h-8" />
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

export default SidebarSkeleton