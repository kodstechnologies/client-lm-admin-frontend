import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import IconPlus from '../Icon/IconPlus';
import { Link } from 'react-router-dom';
import Flatpickr from 'react-flatpickr';
import { fetchFilteredLoanData } from '../../api';
import 'flatpickr/dist/themes/material_blue.css';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { IoMdFunnel } from "react-icons/io";
// Import the FaFilter icon

interface TableRow {
    id: number;
    leadId: string | number;
    [key: string]: any;
}

interface DataTableComponentProps<T extends { }> {
    data: T[];
    columns: any;

    createPage?: string;
}

// const PAGE_SIZES = [10, 20, 30, 50, 100];
const PAGE_SIZES = [50];


const DataTableComponent = <T extends {  }>({
    data,
    columns,
    createPage,
}: DataTableComponentProps<T>) => {
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

    // Format date to dd-mm-yyyy
    const formatToDDMMYYYY = (dateStr: string): string => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Convert API date fields to dd-mm-yyyy
    // const formatDateFields = (row: TableRow): TableRow => {
    //     const formattedRow: TableRow = { ...row };
    //     Object.keys(formattedRow).forEach((key) => {
    //         if (
    //             typeof formattedRow[key] === 'string' &&
    //             /\d{4}-\d{2}-\d{2}/.test(formattedRow[key])
    //         ) {
    //             const parsedDate = new Date(formattedRow[key]);
    //             if (!isNaN(parsedDate.getTime())) {
    //                 formattedRow[key] = formatToDDMMYYYY(formattedRow[key]);
    //             }
    //         }
    //     });
    //     return formattedRow;
    // };

    // Apply search and date filter (local)
    // useEffect(() => {
    //     const filtered = data.filter((item) => {
    //         // Update the search logic to match both leadId and mobileNumber
    //         const matchesSearch =
    //             item.leadId?.toString().toLowerCase().includes(search.toLowerCase()) ||
    //             item.mobileNumber?.toString().toLowerCase().includes(search.toLowerCase());

    //         let matchesDate = true;
    //         if (dateRange.length === 2) {
    //             const start = new Date(dateRange[0]).getTime();
    //             const end = new Date(dateRange[1]).getTime();
    //             const itemDate = new Date((item as any).date).getTime();
    //             matchesDate = itemDate >= start && itemDate <= end;
    //         }

    //         return matchesSearch && matchesDate;
    //     });

    //     setInitialRecords(filtered);
    //     setPage(1);
    // }, [search, dateRange, data]);



    // Pagination
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

    // Fetch and format filtered data from API
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (dateRange.length === 2) {
    //             const from = new Date(dateRange[0]).toISOString().split('T')[0]; // keep as YYYY-MM-DD
    //             const to = new Date(dateRange[1]).toISOString().split('T')[0];

    //             try {
    //                 const filteredData = await fetchFilteredLoanData(from, to);
    //                 const formatted = filteredData.map(formatDateFields); // convert dates
    //                 setInitialRecords(formatted);
    //                 setPage(1);
    //             } catch (error) {
    //                 console.error('Failed to fetch filtered data', error);
    //             }
    //         }
    //     };

    //     fetchData();
    // }, [dateRange]);

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                {createPage && (
                    <Link to={createPage} className="btn btn-primary gap-2">
                        <IconPlus />
                        Create
                    </Link>
                )}

              
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
                    selectedRecords={selectedRecords}
                    onSelectedRecordsChange={setSelectedRecords}
                    paginationText={({ from, to, totalRecords }) =>
                        `Showing ${from} to ${to} of ${totalRecords} entries`
                    }
                />
            </div>
        </div>
    );
};

export default DataTableComponent;
