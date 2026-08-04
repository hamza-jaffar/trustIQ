import Heading from '@/components/heading'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { Permission } from '@/types/data'
import { Link } from '@inertiajs/react'
import { useEffect, useMemo, useState } from 'react'

type RoleFormValues = {
    name: string
    description: string
    permissions: string[]
}

type RoleFormProps = {
    mode: 'create' | 'edit'
    permissions: Permission[]
    initialName?: string
    initialDescription?: string
    initialPermissions?: string[]
    isSystem?: boolean
    errors?: Record<string, string | undefined>
    onSubmit: (values: RoleFormValues) => void
    cancelHref: string
}

const formatLabel = (value: string) =>
    value.replace(/\b\w/g, (char) => char.toUpperCase())

export default function RoleForm({
    mode,
    permissions,
    initialName = '',
    initialDescription = '',
    initialPermissions = [],
    isSystem = false,
    errors = {},
    onSubmit,
    cancelHref,
}: RoleFormProps) {
    const [name, setName] = useState(initialName)
    const [description, setDescription] = useState(initialDescription)
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialPermissions)

    useEffect(() => {
        setName(initialName)
        setDescription(initialDescription)
        setSelectedPermissions(initialPermissions)
    }, [initialName, initialDescription, initialPermissions])

    const groupedPermissions = useMemo(() => {
        return permissions.reduce(
            (groups, permission) => {
                const [resource, action] = permission.name.split('.')

                if (!groups[resource]) {
                    groups[resource] = []
                }

                groups[resource].push({
                    ...permission,
                    action,
                })

                return groups
            },
            {} as Record<string, (Permission & { action: string })[]>,
        )
    }, [permissions])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        onSubmit({
            name: name.trim(),
            description: description.trim(),
            permissions: selectedPermissions,
        })
    }

    const togglePermission = (permissionId: string, checked: boolean) => {
        setSelectedPermissions((current) => {
            if (checked) {
                return current.includes(permissionId) ? current : [...current, permissionId]
            }

            return current.filter((id) => id !== permissionId)
        })
    }

    return (
        <section className="space-y-8 p-8">
            <Heading
                title={mode === 'edit' ? 'Edit Role' : 'Create New Role'}
                description={
                    mode === 'edit'
                        ? 'Update the role details and permissions.'
                        : 'Create a new role and assign permissions.'
                }
            />

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-6">
                {isSystem && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                        This role is protected and cannot be edited.
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={isSystem}
                        placeholder="Manager"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        disabled={isSystem}
                        placeholder="Users with this role can manage..."
                    />
                    <InputError message={errors.description} />
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">Permissions</h2>
                        <p className="text-sm text-muted-foreground">
                            Enable the permissions this role should have.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(groupedPermissions).map(([resource, perms]) => (
                            <div key={resource} className="rounded-lg border">
                                <div className="border-b bg-muted/40 px-4 py-3">
                                    <h3 className="font-semibold">{formatLabel(resource)}</h3>
                                </div>

                                <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {perms.map((permission) => (
                                        <label
                                            key={permission.id}
                                            htmlFor={`permission-${permission.id}`}
                                            className="flex cursor-pointer items-center justify-between rounded-md border p-3 transition hover:bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {formatLabel(permission.action)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {permission.name}
                                                </p>
                                            </div>

                                            <Switch
                                                id={`permission-${permission.id}`}
                                                name="permissions[]"
                                                value={permission.id}
                                                checked={selectedPermissions.includes(permission.id)}
                                                onCheckedChange={(checked) =>
                                                    togglePermission(permission.id, checked)
                                                }
                                                disabled={isSystem}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-6">
                    <Button type="button" variant="outline" asChild>
                        <Link href={cancelHref}>Cancel</Link>
                    </Button>

                    <Button type="submit" disabled={isSystem}>
                        {mode === 'edit' ? 'Save Changes' : 'Create Role'}
                    </Button>
                </div>
            </form>
        </section>
    )
}
