import { getDataFromId } from '@/components/utils/getDatafromId';
import React from 'react'

type Props = {}

const SendviaLinkPage = async (props: Props) => {
    const confirmData=await getDataFromId();
    console.log('send via link:',confirmData);
  return (
    <div className='text-white-800 heading1'>
        Sendvialink Page
    </div>
  )
}

export default SendviaLinkPage