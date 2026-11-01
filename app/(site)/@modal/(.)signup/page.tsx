import SignUpModal from '@/components/templates/signup/SignUpModal'

const SignUpModalPage = async (
  { searchParams }
   : {
      searchParams: Promise<{
         return_url?: string;
      } >
   }
) => {

  const { return_url: returnUrl } = await searchParams;


  return (
    <SignUpModal returnUrl={returnUrl} />
  )
}

export default SignUpModalPage