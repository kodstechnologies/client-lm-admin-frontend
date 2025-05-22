import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';

type Column = {
  accessor: string;
  title: string;
  sortable?: boolean;
  render?: (row: any, index: number) => JSX.Element;
};

type DataTableProps = {
  columns: Column[];
  data: any[];
  createPage: string;
};

const DataTableComponentStoreGroup: React.FC<DataTableProps> = ({ columns, data, createPage }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => navigate(createPage)}>+ Create Store Group</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-4 py-2 text-left font-semibold">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-gray-200">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-2">
                      {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center px-4 py-4 text-gray-500">
                  No store groups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTableComponentStoreGroup;
