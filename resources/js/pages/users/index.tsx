import Heading from '@/components/heading'
import ConfirmDialog from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, router, usePage } from '@inertiajs/react'
import type { PageProps } from '@inertiajs/core'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { users } from '@/routes'

type UserListItem = {
  id: number
  first_name: string
  last_name: string
  email: string
  status: string
  role: string
  role_id?: number
  is_current_user: boolean
}

type UserIndexProps = PageProps & {
  users: {
    data: UserListItem[]
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

export default function UserIndexPage() {
  const { users: userPage, filters, permissions } = usePage<UserIndexProps>().props
  const [search, setSearch] = useState(filters?.search ?? '')
  const [pendingDeleteUser, setPendingDeleteUser] = useState<UserListItem | null>(null)

  const canView = permissions.includes('users.view')
  const canCreate = permissions.includes('users.create')
  const canEdit = permissions.includes('users.edit')
  const canDelete = permissions.includes('users.delete')

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.get('/users', { search }, {
      preserveScroll: true,
      preserveState: true,
    })
  }

  const confirmDelete = () => {
    if (!pendingDeleteUser) {
      return
    }

    router.delete(`/users/${pendingDeleteUser.id}`, {
      preserveScroll: true,
      preserveState: true,
    })

    setPendingDeleteUser(null)
  }

  if (!canView) {
    return null
  }

  return (
    <section className='space-y-6 p-8'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <Heading title='Users' description='Manage users and their assigned roles.' />
        <div className='flex flex-col gap-2 sm:flex-row'>
          <form onSubmit={handleSearch} className='flex gap-2'>
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Search users' className='w-64' />
            <Button type='submit' variant='outline'>
              <Search className='h-4 w-4' />
              Search
            </Button>
          </form>
          {canCreate ? (
            <Link href='/users/create'>
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
            <h3 className='font-semibold'>Users</h3>
            <p className='text-sm text-muted-foreground'>Showing {userPage.from} to {userPage.to} of {userPage.total} users</p>
          </div>
        </div>

        {userPage.data.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-border text-sm'>
              <thead className='bg-muted/40'>
                <tr>
                  <th className='px-4 py-3 text-left font-medium'>Name</th>
                  <th className='px-4 py-3 text-left font-medium'>Email</th>
                  <th className='px-4 py-3 text-left font-medium'>Role</th>
                  <th className='px-4 py-3 text-left font-medium'>Status</th>
                  <th className='px-4 py-3 text-left font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {userPage.data.map((user) => (
                  <tr key={user.id} className='bg-background'>
                    <td className='px-4 py-3'>
                      <div className='font-medium'>{`${user.first_name} ${user.last_name}`}</div>
                    </td>
                    <td className='px-4 py-3 text-muted-foreground'>{user.email}</td>
                    <td className='px-4 py-3'>{user.role}</td>
                    <td className='px-4 py-3'>
                      <span className='rounded-full bg-muted px-2 py-1 text-xs capitalize'>{user.status}</span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex flex-wrap gap-2'>
                        <Button variant='outline' size='sm' disabled>
                          <Eye className='mr-2 h-4 w-4' />
                          View
                        </Button>

                        {canEdit ? (
                          <Link href={`/users/${user.id}/edit`}>
                            <Button variant='outline' size='sm' disabled={user.is_current_user}>
                              <Pencil className='mr-2 h-4 w-4' />
                              Edit
                            </Button>
                          </Link>
                        ) : null}

                        {canDelete ? (
                          <Button variant='destructive' size='sm' onClick={() => setPendingDeleteUser(user)} disabled={user.is_current_user}>
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
          <div className='p-8 text-center text-sm text-muted-foreground'>No users found for this search.</div>
        )}
      </div>

      {userPage.links.length > 3 ? (
        <div className='flex flex-wrap gap-2'>
          {userPage.links.map((link, index) => (
            <Button key={`${link.label}-${index}`} variant={link.active ? 'default' : 'outline'} size='sm' disabled={!link.url} asChild={Boolean(link.url)}>
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
        open={Boolean(pendingDeleteUser)}
        title='Delete this user?'
        description={pendingDeleteUser ? `This will permanently remove ${pendingDeleteUser.first_name} ${pendingDeleteUser.last_name}.` : 'This action cannot be undone.'}
        confirmLabel='Delete user'
        cancelLabel='Cancel'
        destructive
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteUser(null)
          }
        }}
        onConfirm={confirmDelete}
      />
    </section>
  )
}

UserIndexPage.layout = {
  breadcrumbs: [
    {
      title: 'Users',
      href: users(),
    },
  ],
}
