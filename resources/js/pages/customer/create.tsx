import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { create } from '@/routes/roles'
import { LoaderCircleIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import CreateCustomerForm from './create-form'
import { index, profile, searchByCnic } from '@/routes/customers'
import { router } from '@inertiajs/react'

interface ErrorMessageType {
    type: "unexpected" | "notfound" | "validation";
    message: string;
}

const CreateCustomer = () => {
    const [cnic, setCnic] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<ErrorMessageType | null>(null);
    const [mode, setMode] = useState<"search" | "create">("search");
    const [searching, setSearching] = useState<boolean>(false);

    async function handleSearchByCnic() {
        try {
            setSearching(true);
            setErrorMessage(null);
            
            if (cnic.length != 13)
            {
                setErrorMessage({
                    type: "validation",
                    message: "Cnic lenght must be 13 char long"
                })
                return;
            }

            const response = await fetch(searchByCnic({ cnic }).url);
            const data = await response.json();

            if (!data.status) {
                setErrorMessage({
                    type: "notfound",
                    message: data.message
                });
                return;
            }

            if (data.status)
            {
                router.visit(profile(cnic));
            }
        } catch (error) {
            console.error("Search Error:", error);
            setErrorMessage({
                type: "unexpected",
                message: "Unexpected error occured"
            });
            setSearching(false);
        } finally {
            setSearching(false);
        }
    }

    return (
        <section className='space-y-6 p-8'>
            <Heading title='Create Customer' description='Search the customer and if not exist create one.' />
            {mode === 'search' ? (
                <>
                    <div className='flex gap-3 items-end'>
                        <div className='w-full'>
                            <Label htmlFor='cnic'>Cnic</Label>
                            <Input name="cnic" value={cnic} onChange={(e) => setCnic(e.target.value)} id='cnic' className='w-full' />
                        </div>
                        <Button className='cursor-pointer' onClick={() => handleSearchByCnic()}>{searching ? <> <LoaderCircleIcon className='animate-spin' /> Search </> : <>Search</>}</Button>
                    </div>
                    {errorMessage && (
                        <div className='flex gap-2'>
                            <div className='py-1 px-2 border w-full border-red-500 bg-red-300/50 rounded-md'>
                                <p className='text-red-900'>{errorMessage.message}</p>
                            </div>
                            {errorMessage.type === 'notfound' && (
                                <Button onClick={() => setMode("create")} className='gap-2 cursor-pointer'>
                                    <Plus className='h-4 w-4' />
                                    Create
                                </Button>
                            )}
                        </div>
                    )}
                </>
            ) : (<CreateCustomerForm onCancel={() => setMode("search")} />)}

            {/* <InputError message={errorMessage} /> */}
        </section>
    )
}

export default CreateCustomer

CreateCustomer.layout = {
    breadcrumbs: [
        {
            title: 'Customers',
            href: index(),
        },
        {
            title: 'Search or Create Customer',
            href: create(),
        },
    ],
}
