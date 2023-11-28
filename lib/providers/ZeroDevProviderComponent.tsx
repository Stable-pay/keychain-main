"use client";

import { ZeroDevProvider } from '@zerodev/privy'
import React from 'react'

function ZeroDevProviderComponent({children}:{children:React.ReactNode}) {
  return (
    <ZeroDevProvider
      projectId={process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID!}
    >
      {children}
    </ZeroDevProvider>
  )
}

export default ZeroDevProviderComponent