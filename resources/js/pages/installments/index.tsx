import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import installments from '@/routes/installments';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import InstallmentTable from './table';
import { PaginatedInstallments } from '@/types/pagination';
import { InstallmentFilters } from '@/types/filters';

interface Props {
  installments: PaginatedInstallments;
  filters: InstallmentFilters;
  filterOptions: {
    users: {
      id: number;
      first_name: string;
      last_name: string;
    }[];
  };
}

const InstallmentIndex = ({
  installments: installmentData,
  filters,
  filterOptions,
}: Props) => {
  return (
    <div className="p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <Heading
          title="Installments"
          description="Manage installment plans for your organization."
        />

        <Link href={installments.create()}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Installment
          </Button>
        </Link>
      </div>

      <InstallmentTable
        installments={installmentData}
        filters={filters}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default InstallmentIndex;