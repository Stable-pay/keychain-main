import { experimental_useFormStatus } from "react-dom"

const SendToUserButton = () => {
    const {pending}=experimental_useFormStatus();

  return (
    <button disabled={pending} className="gradient_pink-orange cursor-pointer text-white-800 rounded-lg whitespace-nowrap p-4 sm:heading4 xs:body-text">{pending?'Sending...':'Send To User'}</button>
  )
}

export default SendToUserButton