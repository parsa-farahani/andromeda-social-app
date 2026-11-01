import React from 'react'
import AppSidebar from './AppSidebar'
import { authUser } from '@/utils/serverHelpers'

const SidebarWrapper = async () => {

  const user = await authUser();

  return (
    <AppSidebar
      isLoggedIn={Boolean(user)}
      isAdmin={user?.role === 'ADMIN'}
    />
  )
}

export default SidebarWrapper