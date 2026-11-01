import SignInModal from '@/components/templates/signin/SignInModal'

const SginInModalPage = async (
  { searchParams }
   : {
      searchParams: Promise<{
         return_url?: string;
      } >
   }
) => {

  const { return_url: returnUrl } = await searchParams;


  return (
    <SignInModal returnUrl={returnUrl} />
  )
}

export default SginInModalPage