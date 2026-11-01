"use client";

import Link from "next/link";
import {
  Home,
  Search,
  PlusSquare,
  UserRound,
  Headphones,
  LogIn,
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
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";


const navItems = [
  {
    title: "Log In",
    href: "/signin",
    icon: LogIn,
    filledIcon: true,
  },
  {
    title: "Feed",
    href: "/",
    icon: Home,
    filledIcon: true,
  },
  {
    title: "My Profile",
    href: "/p-user",
    icon: UserRound,
    filledIcon: false,
  },
  {
    title: "Search",
    href: "/search",
    icon: Search,
    filledIcon: false,
  },
  {
    title: "Create",
    href: "/p-user/create",
    icon: PlusSquare,
    filledIcon: false,
  },
  {
    title: "Admin Panel",
    href: "/p-admin",
    icon: Headphones,
    filledIcon: false,
  },
];

const AppSidebar = (
  {
    isLoggedIn,
    isAdmin,
  }:
  { isLoggedIn: boolean;
    isAdmin: boolean;
  }
) => {


  const path = usePathname();
  
  const { setOpenMobile } = useSidebar();


  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarHeader >
        <Link
          href="/"
          onClick={() => setOpenMobile(false)}
        >
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
            <span
            className="max-xl:hidden"
            >
              ndromeda
            </span>
          </h2>
        </Link>
      </SidebarHeader>
      <SidebarContent >
        <SidebarGroup  >
            <SidebarMenu>
            {navItems.map((item) => {

              if (
                item.href === '/signin' ||
                item.href === '/signup'
              ) {
                if (isLoggedIn) return null;
              }

              if (
                item.href.startsWith('/p-admin')
              ) {
                if (!(isLoggedIn && isAdmin)) return null;
              }

              const Icon = item.icon;

              const isActive =
                item.href === "/p-user"
                  ? path === "/p-user"
                  : path === item.href ||
                    path.startsWith(`${item.href}/`);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} aria-current={isActive ? "page" : undefined}/>}
                    size="lg"
                    isActive={isActive}
                    tooltip={item.title}
                    className="transition-colors data-[active=true]:bg-white/10 data-[active=true]:font-semibold hover:bg-white/5 h-10 mb-2 xl:mb-0"
                    onClick={() => setOpenMobile(false)}
                  >

                    <span
                      className="block h-full aspect-square flex-center"
                    >
                      <Icon
                        className="lg:size-6 shrink-0"
                        fill={
                          isActive && item.filledIcon
                            ? "currentColor"
                            : "none"
                        }
                        strokeWidth={isActive ? 2.5 : 1.8}
                      />
                    </span>

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


export default AppSidebar;