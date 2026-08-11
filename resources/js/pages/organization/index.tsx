import { useRef, useState } from 'react'
import OrganizationController from '@/actions/App/Http/Controllers/Organization/OrganizationController'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { organization } from '@/routes'
import { Form, usePage } from '@inertiajs/react'
import { ImageOff, Loader2 } from 'lucide-react'
import Heading from '@/components/heading'

const OrganizationIndex = () => {
  const { organization, permissions } = usePage().props;
  const formRef = useRef<HTMLFormElement>(null)
  const canUpdate = permissions.includes('organization.update');
  // Replace with your organization's current logo URL
  const [logoPreview, setLogoPreview] = useState<string | null>(organization?.logo ? `/storage/${organization?.logo}` : null);

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Show preview immediately
    setLogoPreview(URL.createObjectURL(file))

    // Submit form automatically
    formRef.current?.requestSubmit()
  }

  return (
    <div className="p-8">
      <Heading title='Manage Organization Info' description='Update and Save the organization info' />
      <Form
        {...OrganizationController.post.form()}
        options={{
          preserveScroll: true,
        }}
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            {/* Logo */}
            <div className="flex flex-col items-center gap-3 rounded-xl border p-6">
              <label
                htmlFor="logo"
                className="group relative cursor-pointer"
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-xl border-2 border-dashed transition group-hover:border-primary">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Organization Logo"
                      className="h-full w-full object-cover"
                    />

                  ) : (
                    <div className="h-full w-full flex items-center justify-center"> <ImageOff className='h-16 w-16  text-gray-300' /> </div>
                  )}

                  {processing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <span className="text-sm font-medium text-white">
                      Change Logo
                    </span>
                  </div>
                </div>
              </label>

              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />

              <div className="text-center">
                <p className="text-sm font-medium">
                  Organization Logo
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG or SVG • Max 2MB
                </p>
              </div>

              <InputError message={errors.logo} />
            </div>

            {organization && (

              <Input
                id="organization_id"
                name="organization_id"
                required
                className='hidden'
                hidden
                autoComplete="organization_id"
                defaultValue={organization?.id}
              />
            )}


            {/* Organization Details */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="grid w-full gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Acme Corporation"
                  tabIndex={1}
                  required
                  autoComplete="organization"
                  defaultValue={organization?.name}
                />
                <InputError message={errors.name} />
              </div>

              <div className="grid w-full gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="contact@acmecorp.com"
                  tabIndex={2}
                  required
                  autoComplete="email"
                  defaultValue={organization?.email}
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid w-full gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  tabIndex={3}
                  required
                  autoComplete="tel"
                  defaultValue={organization?.phone}
                />
                <InputError message={errors.phone} />
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="grid w-full gap-2">
                <Label htmlFor="business_type">Business Type</Label>
                <Input
                  id="business_type"
                  name="business_type"
                  placeholder="Software Company"
                  tabIndex={4}
                  autoComplete="organization-title"
                  defaultValue={organization?.business_type}
                />
                <InputError message={errors.business_type} />
              </div>

              <div className="grid w-full gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  placeholder="https://www.example.com"
                  tabIndex={5}
                  autoComplete="url"
                  defaultValue={organization?.website}
                />
                <InputError message={errors.website} />
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="grid w-full gap-2">
                <Label htmlFor="registration_number">
                  Registration Number
                </Label>
                <Input
                  id="registration_number"
                  name="registration_number"
                  placeholder="REG-123456"
                  tabIndex={6}
                  defaultValue={organization?.registration_number}
                />
                <InputError message={errors.registration_number} />
              </div>

              <div className="grid w-full gap-2">
                <Label htmlFor="tax_number">Tax Number</Label>
                <Input
                  id="tax_number"
                  name="tax_number"
                  placeholder="TAX-987654"
                  tabIndex={7}
                  defaultValue={organization?.tax_number}
                />
                <InputError message={errors.tax_number} />
              </div>
            </div>

            <div className="flex justify-end">

              {canUpdate && (
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full sm:w-40"
                  data-test="update-organization-button"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </Form>
    </div>
  )
}

export default OrganizationIndex

OrganizationIndex.layout = {
  breadcrumbs: [
    {
      title: 'Organization',
      href: organization(),
    },
  ],
}