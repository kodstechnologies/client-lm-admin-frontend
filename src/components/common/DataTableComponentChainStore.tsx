import React from 'react';
import { DataTable } from 'mantine-datatable'; // or your DataTable component

type Column = {
  accessor: string;
  title: string;
  sortable: boolean;
  render?: (row: any, index: number) => JSX.Element;
};

type DataTableComponentChainStoreProps = {
  columns: Column[];
  data: any[];
  createPage: string;
  totalRecords: number;
  recordsPerPage: number;
  page: number;
  onPageChange: (page: number) => void;
  recordsPerPageOptions: number[];
  onRecordsPerPageChange: (size: number) => void;
  sortStatus: { columnAccessor: string; direction: 'asc' | 'desc' };
  onSortStatusChange: (sort: { columnAccessor: string; direction: 'asc' }) => void;
  selectedRecords?: any[];              // optional now
  onSelectedRecordsChange?: (records: any[]) => void;  // optional now
  paginationText: ({ from, to, totalRecords }: { from: number; to: number; totalRecords: number }) => string;
};

const DataTableComponentChainStore: React.FC<DataTableComponentChainStoreProps> = ({
  columns,
  data,
  createPage,
  totalRecords,
  recordsPerPage,
  page,
  onPageChange,
  recordsPerPageOptions,
  onRecordsPerPageChange,
  sortStatus,
  onSortStatusChange,
  selectedRecords,
  onSelectedRecordsChange,
  paginationText
}) => {
  return (
    <DataTable
      className="whitespace-nowrap table-hover invoice-table"
      highlightOnHover
      records={data}
      columns={columns}
      totalRecords={totalRecords}
      recordsPerPage={recordsPerPage}
      page={page}
      onPageChange={onPageChange}
      recordsPerPageOptions={recordsPerPageOptions}
      onRecordsPerPageChange={onRecordsPerPageChange}
      sortStatus={sortStatus}
     
      paginationText={paginationText}
    />
  );
};

export default DataTableComponentChainStore;
