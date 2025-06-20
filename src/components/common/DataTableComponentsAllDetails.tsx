import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import IconPlus from '../Icon/IconPlus';
import { Link } from 'react-router-dom';
import Flatpickr from 'react-flatpickr';
import { fetchFilteredLoanData } from '../../api';
import 'flatpickr/dist/themes/material_blue.css';
import { FaSearch } from 'react-icons/fa';
import { IoMdFunnel } from 'react-icons/io';
import { X } from 'lucide-react';

interface TableRow {
    id: number;
    leadId: string | number;
    [key: string]: any;
}

interface DataTableComponentAllDetailsProps<T extends { id: string | number; leadId: string | number; mobileNumber: string }> {
    data: T[];
    columns: any;
    createPage?: string;
}

const PAGE_SIZES = [50];

const DataTableComponentsAllDetails = <T extends { id: string | number, leadId: string | number, mobileNumber: string }>({
    data,
    columns,
    createPage,
}: DataTableComponentAllDetailsProps<T>) => {
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const flatpickrRef = useRef<Flatpickr | null>(null);
    const [initialRecords, setInitialRecords] = useState<T[]>(data);
    const [recordsData, setRecordsData] = useState<T[]>(initialRecords);
    const [search, setSearch] = useState<string>('');
    const [dateRange, setDateRange] = useState<Date[] | string[]>([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });
    const [selectedRecords, setSelectedRecords] = useState<T[]>([]);
    const [showDateRange, setShowDateRange] = useState<boolean>(false);
    const formatToDDMMYYYY = (dateStr: string): string => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatDateFields = (row: TableRow): TableRow => {
        const formattedRow: TableRow = { ...row };

        Object.keys(formattedRow).forEach((key) => {
            const value = formattedRow[key];
            if (
                typeof value === 'string' &&
                /^\d{4}-\d{2}-\d{2}T/.test(value) // checks for ISO-like date string
            ) {
                const parsedDate = new Date(value);
                if (!isNaN(parsedDate.getTime())) {
                    formattedRow[key] = formatToDDMMYYYY(value);
                }
            }
        });

        return formattedRow;
    };


    // Apply search and date filter (local)
    useEffect(() => {
        const filtered = data.filter((item) => {
            const matchesSearch =
                item.leadId?.toString().toLowerCase().includes(search.toLowerCase()) ||
                item.mobileNumber?.toString().toLowerCase().includes(search.toLowerCase());

            let matchesDate = true;
            if (dateRange.length === 2) {
                const start = new Date(dateRange[0]).getTime();
                const end = new Date(dateRange[1]).getTime();
                const rawDate = (item as any).createdAt || (item as any).updatedAt;
                const itemDate = new Date(rawDate).getTime();
                matchesDate = itemDate >= start && itemDate <= end;
            }

            return matchesSearch && matchesDate;
        });

        setInitialRecords(filtered);
        setPage(1);
    }, [search, dateRange, data]);

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

    const flattenRow = (row: any, index: number) => {
        const base = { ...row };

        if (row.personalLoan) {
            Object.assign(base, row.personalLoan);
            base.loanType = "Personal Loan";
        } else if (row.businessLoan) {
            Object.assign(base, row.businessLoan);
            base.loanType = "Business Loan";
        } else {
            base.loanType = "N/A";
        }

        base.serialNo = index + 1;
        return base;
    };


    // Fetch and format filtered data from API
    useEffect(() => {
        const fetchData = async () => {
            if (dateRange.length === 2) {
                const formatLocalDate = (date: Date): string => {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                const from = formatLocalDate(new Date(dateRange[0]));
                const to = formatLocalDate(new Date(dateRange[1]));


                try {
                    const response = await fetchFilteredLoanData(from, to, 'created');
                    // console.log("🚀 ~ fetchData ~ response:", response)
                    // Safely access nested `data`
                    const rawData = response?.data;

                    if (!Array.isArray(rawData)) {
                        console.warn("❌ Expected an array, but got:", rawData);
                        return;
                    }

                    const formatted = rawData.map(formatDateFields).map(flattenRow);
                    setInitialRecords(formatted);

                    setPage(1);
                } catch (error) {
                    console.error('Failed to fetch filtered data', error);
                }
            }
        };

        fetchData();
    }, [dateRange]);

    const handleClear = () => {
        setDateRange([]);
        if (flatpickrRef.current) {
            flatpickrRef.current.flatpickr.clear();
        }
    };




    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                {createPage && (
                    <Link to={createPage} className="btn btn-primary gap-2">
                        <IconPlus />
                        Create
                    </Link>
                )}

                <div className="flex w-full gap-2">
                    <div className="relative w-1/2">
                        <input
                            type="text"
                            className="form-input w-full pl-10"
                            placeholder="Search by Lead Id or Phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    </div>

                    <button
                        onClick={() => setShowDateRange(!showDateRange)}
                        className="btn p-2 rounded-full"
                        aria-label="Filter"
                    >
                        <IoMdFunnel className="w-6 h-6 text-blue-500" />
                    </button>

                    <div className="flex items-center gap-2 w-1/2 justify-end">
                        {showDateRange && (
                            <div className="relative w-full">
                                <Flatpickr
                                    ref={flatpickrRef}
                                    options={{
                                        mode: 'range',
                                        dateFormat: 'd-m-Y',
                                    }}
                                    value={dateRange}
                                    onChange={(selectedDates) => setDateRange(selectedDates)}
                                    className="form-input w-full pl-10 pr-10 text-blue-500"
                                    placeholder="Select date range"
                                />

                                {/* Clear Button */}
                                {dateRange.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
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
                    emptyState={<div></div>}
                    paginationText={({ from, to, totalRecords }) =>
                        `Showing ${from} to ${to} of ${totalRecords} entries`
                    }
                />
            </div>
        </div>
    );
};

export default DataTableComponentsAllDetails;
