import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { roles } from '@/routes'
import { create } from '@/routes/roles'
import { Link } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import React from 'react'

const RoleIndex = () => {
  return (
    <section className='p-8'>
      <div className='flex justify-between'>
        <Heading
          title='Role & Permission'
          description='Manage Role and Permission of your organization'
        />
        <Link href={create()}>
          <Button className='gap-2'>
            <Plus />
            Create
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default RoleIndex

RoleIndex.layout = {
  breadcrumbs: [
    {
      title: 'Organization',
      href: roles(),
    },
  ],
}