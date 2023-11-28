
import Form, { FormSkeleton } from '@/components/Form';
import LoadingComponent from '@/components/LoadingComponent';
import { isAuthenticated } from '@/lib/auth';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Dashboard =dynamic(() => 
  import ('@/components/Login')
,{
  loading: () => <LoadingComponent />
})

const LoginComponent =dynamic(() => 
  import ('@/components/LoginComponent')
,{
  loading: () => <LoadingComponent />
})

const LoginButton =dynamic(() => 
  import ('@/components/LoginButton')
,{
  loading: () => <LoadingComponent />
})
// const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

const Home = async ({searchParams}:{searchParams: {[key:string]:string | string[] | undefined}}) => {
  return (
    <main className="flex-center paddings mx-auto w-full max-w-screen-2xl flex-col">
      {isAuthenticated() ? 
        // <Dashboard />

        <Suspense fallback={<FormSkeleton />}>
          <Form />
        </Suspense>
      : 
        (
          <div className='flex-center flex-col gap-y-2'>
              <LoginComponent />
              <LoginButton />
          </div>
        )
      }
    </main>
  )
}

export default Home