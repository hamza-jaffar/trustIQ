import Heading from '@/components/heading'
import { roles } from '@/routes'
import React from 'react'

const CreateRole = () => {
    return (
        <section className='p-8'>
            <div className='flex justify-between'>
                <Heading
                    title='Create New Role'
                    description='Create new role for your organization'
                />
            </div>
        </section>
    )
}

export default CreateRole

CreateRole.layout = {
    breadcrumbs: [
        {
            title: 'Organization',
            href: roles(),
        },
    ],
}