import { router, usePage } from '@inertiajs/react'
import type { PageProps } from '@inertiajs/core'
import { users } from '@/routes'
import UserForm from './user-form'

type CreatePageProps = PageProps & {
  roles: Array<{ id: number; name: string }>
  permissions: string[]
  errors?: Record<string, string | undefined>
}

export default function CreateUserPage() {
  const { roles, permissions, errors } = usePage<CreatePageProps>().props

  const handleSubmit = (values: { first_name: string; last_name: string; email: string; password: string; password_confirmation: string; status: string; role_id: string }) => {
    router.post('/users', values, {
      preserveScroll: true,
    })
  }

  return (
    <UserForm
      mode='create'
      roles={roles}
      permissions={permissions}
      errors={errors}
      onSubmit={handleSubmit}
      cancelHref={users().url}
    />
  )
}

CreateUserPage.layout = {
  breadcrumbs: [
    {
      title: 'Users',
      href: users(),
    },
  ],
}
