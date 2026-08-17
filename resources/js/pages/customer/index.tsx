import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { create, index } from '@/routes/customers';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import CustomerTable from './table';
import { PaginatedCustomers } from '@/types/pagination';
import { CustomerFilterOptions, CustomerFilters } from '@/types/filters';

interface CustomerIndexProps {
  customers: PaginatedCustomers;
  filters: CustomerFilters;
  filterOptions: CustomerFilterOptions;
}

const CustomerIndex = ({
  customers,
  filters,
  filterOptions,
}: CustomerIndexProps) => {
  return (
    <section className="p-8">
      <div className="flex flex-col justify-between gap-2 sm:flex-row">
        <Heading
          title="Customers"
          description="Manage the customers related to your organization."
        />

        <Link href={create()}>
          <Button className="cursor-pointer gap-2">
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </Link>
      </div>

      <CustomerTable
        customers={customers}
        filters={filters}
        filterOptions={filterOptions}
      />
    </section>
  );
};

export default CustomerIndex;

CustomerIndex.layout = {
  breadcrumbs: [
    {
      title: 'Customers',
      href: index(),
    },
  ],
};