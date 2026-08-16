import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import installments from '@/routes/installments'
import { Link } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import React from 'react'

const InstallmentIndex = () => {
  return (
    <div className='p-8'>
      <div className='flex justify-between'>
        <Heading title='Manage Organization Info' description='Update and Save the organization info' />
        <Link href={installments.create()}><Button><Plus /> Create Installment</Button></Link>
      </div>
    </div>
  )
}

export default InstallmentIndex