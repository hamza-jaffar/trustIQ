import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { create, index } from '@/routes/customers'
import { Link } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import React from 'react'

const CustomerIndex = () => {
  return (
    <section className='space-y-6 p-8'>
      <div className='flex flex-col gap-2 sm:flex-row justify-between'>
        <Heading title='Customer' description='Manage the customer that is related to your organization.' />

        <Link href={create()}>
          <Button className='gap-2 cursor-pointer'>
            <Plus className='h-4 w-4' />
            Create
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default CustomerIndex

CustomerIndex.layout = {
  breadcrumbs: [
    {
      title: 'Customers',
      href: index(),
    },
  ],
}
