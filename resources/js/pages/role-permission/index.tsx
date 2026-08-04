import Heading from '@/components/heading'
import ConfirmDialog from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { roles } from '@/routes'
import { Link, router, usePage } from '@inertiajs/react'
import type { PageProps } from '@inertiajs/core'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'

type RoleListItem = {
  id: string
  name: string
  description: string
  is_system: boolean
  permissions: string[]
  permissions_count: number
}

type RoleIndexProps = PageProps & {
  roles: {
    data: RoleListItem[]
    links: Array<{ url: string | null; label: string; active: boolean }>
    current_page: number
    last_page: number
    from: number
    to: number
    total: number
  }
  filters?: {
    search?: string
  }
  permissions: string[]
}

const RoleIndex = () => {
  const { roles: rolePage, filters, permissions = [] } = usePage<RoleIndexProps>().props
  const [search, setSearch] = useState(filters?.search ?? '')
  const [pendingDeleteRole, setPendingDeleteRole] = useState<RoleListItem | null>(null)
  const canCreate = permissions.includes('roles.create')
  const canEdit = permissions.includes('roles.edit')
  const canDelete = permissions.includes('roles.delete')

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.get('/roles', { search }, {
      preserveScroll: true,
      preserveState: true,
    })
  }

  const handleDelete = (role: RoleListItem) => {
    if (role.is_system) {
      return
    }

    setPendingDeleteRole(role)
  }

  const confirmDelete = () => {
    if (!pendingDeleteRole) {
      return
    }

    router.delete(`/roles/${pendingDeleteRole.id}`, {
      preserveScroll: true,
      preserveState: true,
    })

    setPendingDeleteRole(null)
  }

  return (
    <section className='space-y-6 p-8'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <Heading
          title='Role & Permission'
          description='Manage roles, permissions, and access across your organization.'
        />
        <div className='flex flex-col gap-2 sm:flex-row'>
          <form onSubmit={handleSearch} className='flex gap-2'>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Search roles'
              className='w-64'
            />
            <Button type='submit' variant='outline'>
              <Search className='h-4 w-4' />
              Search
            </Button>
          </form>
          {canCreate ? (
            <Link href='/roles/create'>
              <Button className='gap-2'>
                <Plus className='h-4 w-4' />
                Create
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className='overflow-hidden rounded-xl border bg-card'>
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <div>
            <h3 className='font-semibold'>Roles</h3>
            <p className='text-sm text-muted-foreground'>
              Showing {rolePage.from} to {rolePage.to} of {rolePage.total} roles
            </p>
          </div>
        </div>

        {rolePage.data.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-border text-sm'>
              <thead className='bg-muted/40'>
                <tr>
                  <th className='px-4 py-3 text-left font-medium'>Name</th>
                  <th className='px-4 py-3 text-left font-medium'>Description</th>
                  <th className='px-4 py-3 text-left font-medium'>Permissions</th>
                  <th className='px-4 py-3 text-left font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {rolePage.data.map((role) => (
                  <tr key={role.id} className='bg-background'>
                    <td className='px-4 py-3'>
                      <div className='font-medium'>{role.name}</div>
                      {role.is_system ? (
                        <div className='mt-1 text-xs text-muted-foreground'>Protected role</div>
                      ) : null}
                    </td>
                    <td className='px-4 py-3 text-muted-foreground'>
                      {role.description || '—'}
                    </td>
                    <td className='px-4 py-3'>
                      <span className='rounded-full bg-muted px-2 py-1 text-xs'>
                        {role.permissions_count} permissions
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant='outline' size='sm'>
                              <Eye className='mr-2 h-4 w-4' />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{role.name}</DialogTitle>
                              <DialogDescription>
                                {role.description || 'No description provided.'}
                              </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-3'>
                              <div>
                                <h4 className='text-sm font-semibold'>Permissions</h4>
                                <div className='mt-2 flex flex-wrap gap-2'>
                                  {role.permissions.length > 0 ? role.permissions.map((permission) => (
                                    <span key={permission} className='rounded-full border px-2 py-1 text-xs'>
                                      {permission}
                                    </span>
                                  )) : <span className='text-sm text-muted-foreground'>No permissions assigned.</span>}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant='outline'>Close</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {canEdit ? (
                          <Link href={`/roles/${role.id}/edit`}>
                            <Button variant='outline' size='sm' disabled={role.is_system}>
                              <Pencil className='mr-2 h-4 w-4' />
                              Edit
                            </Button>
                          </Link>
                        ) : null}

                        {canDelete ? (
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => handleDelete(role)}
                            disabled={role.is_system}
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='p-8 text-center text-sm text-muted-foreground'>
            No roles found for this search.
          </div>
        )}
      </div>

      {rolePage.links.length > 3 ? (
        <div className='flex flex-wrap gap-2'>
          {rolePage.links.map((link, index) => (
            <Button
              key={`${link.label}-${index}`}
              variant={link.active ? 'default' : 'outline'}
              size='sm'
              disabled={!link.url}
              asChild={Boolean(link.url)}
            >
              {link.url ? (
                <Link href={link.url} preserveScroll>
                  {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                </Link>
              ) : (
                <span>{link.label.replace('&laquo;', '«').replace('&raquo;', '»')}</span>
              )}
            </Button>
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingDeleteRole)}
        title='Delete this role?'
        description={pendingDeleteRole ? `This will permanently remove “${pendingDeleteRole.name}” and its assigned permissions.` : 'This action cannot be undone.'}
        confirmLabel='Delete role'
        cancelLabel='Cancel'
        destructive
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteRole(null)
          }
        }}
        onConfirm={confirmDelete}
      />
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