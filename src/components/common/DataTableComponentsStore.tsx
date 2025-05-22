import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import IconPlus from '../Icon/IconPlus';

interface TableRow {
  id: number;
  leadId: string | number;
  [key: string]: any;
}

interface DataTableComponentStoreProps<T extends {}> {
  data: T[];
  columns: any;

  createPage?: string;
}

// const PAGE_SIZES = [10, 20, 30, 50, 100];
const PAGE_SIZES = [50];
const DataTableComponentsStore = <T extends {}>({
  data,
  columns,
  createPage,
}: DataTableComponentStoreProps<T>) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState<T[]>(data);
  const [recordsData, setRecordsData] = useState<T[]>(initialRecords);
  const [search, setSearch] = useState<string>('');
  const [dateRange, setDateRange] = useState<Date[] | string[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'id',
    direction: 'asc',
  });
  const [selectedRecords, setSelectedRecords] = useState<T[]>([]);
  const [showDateRange, setShowDateRange] = useState<boolean>(false); // To toggle date range visibility
  const formatToDDMMYYYY = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  // Sorting
  useEffect(() => {
    if (sortStatus) {
      setRecordsData((prevRecords) => {
        return [...prevRecords].sort((a, b) => {
          const aValue = (a as any)[sortStatus.columnAccessor];
          const bValue = (b as any)[sortStatus.columnAccessor];
          if (aValue < bValue) return sortStatus.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortStatus.direction === 'asc' ? 1 : -1;
          return 0;
        });
      });
    }
  }, [sortStatus]);
useEffect(() => {
  setInitialRecords(data);
}, [data]);

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        {createPage && (
          <Link to={createPage} className="btn btn-primary gap-2">
            <IconPlus />
            Create
          </Link>
        )}

        {/* Flex container for search and filter */}

      </div>


      <div className="datatables">
        <DataTable
          className="whitespace-nowrap table-hover invoice-table"
          highlightOnHover
          records={recordsData}
          columns={columns}
          totalRecords={initialRecords.length}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={setPage}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          
          paginationText={({ from, to, totalRecords }) =>
            `Showing ${from} to ${to} of ${totalRecords} entries`
          }
        />
      </div>
    </div>
  )
}

export default DataTableComponentsStore