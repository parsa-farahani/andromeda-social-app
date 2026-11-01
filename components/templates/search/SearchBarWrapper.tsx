'use client'

import SearchBar from '@/components/modules/SearchBar/SearchBar'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const SearchBarWrapper = () => {

   const sp = useSearchParams();

   const key = sp.toString();


  return (
    
    <SearchBar
      key={key}
      searchParams={sp}
    />
  )
}

export default SearchBarWrapper