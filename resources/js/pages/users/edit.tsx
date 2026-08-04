import { router, usePage } from '@inertiajs/react'
import type { PageProps } from '@inertiajs/core'
import { users } from '@/routes'
import UserForm from './user-form'

type UserPayload = {
  id: number
  first_name: string
  last_name: string
  email: string
  status: string
  role_id?: number
  is_current_user: boolean
}

type EditPageProps = PageProps & {
  user: UserPayload
  roles: Array<{ id: number; name: string }>
  permissions: string[]
  errors?: Record<string, string | undefined>
}

export default function EditUserPage() {
  const { user, roles, permissions, errors } = usePage<EditPageProps>().props

  const handleSubmit = (values: { first_name: string; last_name: string; email: string; password: string; password_confirmation: string; status: string; role_id: string }) => {
    router.put(`/users/${user.id}`, values, {
      preserveScroll: true,
    })
  }

  return (
    <UserForm
      mode='edit'
      roles={roles}
      permissions={permissions}
      initialValues={user}
      errors={errors}
      onSubmit={handleSubmit}
      cancelHref={users().url}
    />
  )
}

EditUserPage.layout = {
  breadcrumbs: [
    {
      title: 'Users',
      href: users(),
    },
  ],
}
