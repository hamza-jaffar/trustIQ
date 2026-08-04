import { router, usePage } from '@inertiajs/react'
import type { PageProps } from '@inertiajs/core'
import RoleForm from './role-form'
import { roles } from '@/routes'
import type { Permission } from '@/types/data'

type RolePayload = {
    id: string
    name: string
    description: string
    is_system: boolean
    permissions: string[]
}

type EditPageProps = PageProps & {
    role: RolePayload
    permissions: Permission[]
    errors?: Record<string, string | undefined>
}

export default function EditRolePage() {
    const { role, permissions, errors } = usePage<EditPageProps>().props

    const handleSubmit = (values: { name: string; description: string; permissions: string[] }) => {
        router.put(`/roles/${role.id}`, values, {
            preserveScroll: true,
        })
    }

    return (
        <RoleForm
            mode="edit"
            permissions={permissions}
            initialName={role.name}
            initialDescription={role.description}
            initialPermissions={role.permissions}
            isSystem={role.is_system}
            errors={errors}
            onSubmit={handleSubmit}
            cancelHref={roles().url}
        />
    )
}

EditRolePage.layout = {
    breadcrumbs: [
        {
            title: 'Organization',
            href: roles(),
        },
    ],
}
