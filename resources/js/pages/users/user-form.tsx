import Heading from '@/components/heading'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'

type UserFormValues = {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  status: string
  role_id: string
}

type UserFormProps = {
  mode: 'create' | 'edit'
  roles: Array<{ id: number; name: string }>
  permissions: string[]
  initialValues?: {
    first_name?: string
    last_name?: string
    email?: string
    status?: string
    role_id?: number
    is_current_user?: boolean
  }
  errors?: Record<string, string | undefined>
  onSubmit: (values: UserFormValues) => void
  cancelHref: string
}

export default function UserForm({ mode, roles, permissions, initialValues, errors = {}, onSubmit, cancelHref }: UserFormProps) {
  const canManage = permissions.includes('users.create') || permissions.includes('users.edit')
  const [firstName, setFirstName] = useState(initialValues?.first_name ?? '')
  const [lastName, setLastName] = useState(initialValues?.last_name ?? '')
  const [email, setEmail] = useState(initialValues?.email ?? '')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [status, setStatus] = useState(initialValues?.status ?? 'active')
  const [roleId, setRoleId] = useState(String(initialValues?.role_id ?? ''))

  useEffect(() => {
    setFirstName(initialValues?.first_name ?? '')
    setLastName(initialValues?.last_name ?? '')
    setEmail(initialValues?.email ?? '')
    setStatus(initialValues?.status ?? 'active')
    setRoleId(String(initialValues?.role_id ?? ''))
  }, [initialValues])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      password,
      password_confirmation: passwordConfirmation,
      status,
      role_id: roleId,
    })
  }

  if (!canManage) {
    return null
  }

  return (
    <section className='space-y-8 p-8'>
      <Heading title={mode === 'edit' ? 'Edit User' : 'Create User'} description={mode === 'edit' ? 'Update the user profile and role assignment.' : 'Create a new user and assign them a role.'} />

      <form onSubmit={handleSubmit} className='space-y-6 rounded-xl border bg-card p-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='first_name'>First name</Label>
            <Input id='first_name' value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            <InputError message={errors.first_name} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='last_name'>Last name</Label>
            <Input id='last_name' value={lastName} onChange={(event) => setLastName(event.target.value)} />
            <InputError message={errors.last_name} />
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' value={email} onChange={(event) => setEmail(event.target.value)} />
            <InputError message={errors.email} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='role_id'>Role</Label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger id='role_id'>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.role_id} />
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' type='password' value={password} onChange={(event) => setPassword(event.target.value)} />
            <InputError message={errors.password} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password_confirmation'>Confirm password</Label>
            <Input id='password_confirmation' type='password' value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} />
            <InputError message={errors.password_confirmation} />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='status'>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id='status'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='suspended'>Suspended</SelectItem>
            </SelectContent>
          </Select>
          <InputError message={errors.status} />
        </div>

        <div className='flex justify-end gap-3 border-t pt-6'>
          <Button type='button' variant='outline' asChild>
            <Link href={cancelHref}>Cancel</Link>
          </Button>
          <Button type='submit'>{mode === 'edit' ? 'Save Changes' : 'Create User'}</Button>
        </div>
      </form>
    </section>
  )
}
