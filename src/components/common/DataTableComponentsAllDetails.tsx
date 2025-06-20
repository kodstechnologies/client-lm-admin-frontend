

import { useEffect, useRef, useState } from "react"
import { DataTable, type DataTableSortStatus } from "mantine-datatable"
import IconPlus from "../Icon/IconPlus"
import { Link } from "react-router-dom"
import Flatpickr from "react-flatpickr"
import { fetchFilteredLoanData } from "../../api"
import "flatpickr/dist/themes/material_blue.css"
import { FaSearch } from "react-icons/fa"
import { IoMdFunnel } from "react-icons/io"
import { X } from "lucide-react"

interface TableRow {
    id: number
    leadId: string | number
    [key: string]: any
}

interface DataTableComponentAllDetailsProps<
    T extends { id: string | number; leadId: string | number; mobileNumber: string },
> {
    data: T[]
    columns: any
    createPage?: string
}

const PAGE_SIZES = [50]

const DataTableComponentsAllDetails = <
    T extends { id: string | number; leadId: string | number; mobileNumber: string },
>({
    data,
    columns,
    createPage,
}: DataTableComponentAllDetailsProps<T>) => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0])
    const flatpickrRef = useRef<Flatpickr | null>(null)
    const [initialRecords, setInitialRecords] = useState<T[]>(data)
    const [recordsData, setRecordsData] = useState<T[]>(initialRecords)
    const [search, setSearch] = useState<string>("")
    const [dateRange, setDateRange] = useState<Date[] | string[]>([])
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: "id",
        direction: "asc",
    })
    const [selectedRecords, setSelectedRecords] = useState<T[]>([])
    const [showDateRange, setShowDateRange] = useState<boolean>(false)

    // ADDED: Key to force Flatpickr re-render
    const [flatpickrKey, setFlatpickrKey] = useState<number>(0)

    // ADDED: Loading state to prevent race conditions
    const [isLoadingDateFilter, setIsLoadingDateFilter] = useState<boolean>(false)

    const formatToDDMMYYYY = (dateStr: string): string => {
        const date = new Date(dateStr)
        const day = String(date.getDate()).padStart(2, "0")
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    const formatDateFields = (row: TableRow): TableRow => {
        const formattedRow: TableRow = { ...row }

        Object.keys(formattedRow).forEach((key) => {
            const value = formattedRow[key]
            if (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}T/.test(value) // checks for ISO-like date string
            ) {
                const parsedDate = new Date(value)
                if (!isNaN(parsedDate.getTime())) {
                    formattedRow[key] = formatToDDMMYYYY(value)
                }
            }
        })

        return formattedRow
    }

    // Apply search and date filter (local) - only when not loading from API
    useEffect(() => {
        if (isLoadingDateFilter) return // Skip local filtering when API is loading

        const filtered = data.filter((item) => {
            const matchesSearch =
                item.leadId?.toString().toLowerCase().includes(search.toLowerCase()) ||
                item.mobileNumber?.toString().toLowerCase().includes(search.toLowerCase())

            let matchesDate = true
            if (dateRange.length === 2) {
                const start = new Date(dateRange[0]).getTime()
                const end = new Date(dateRange[1]).getTime()
                const rawDate = (item as any).createdAt || (item as any).updatedAt
                const itemDate = new Date(rawDate).getTime()
                matchesDate = itemDate >= start && itemDate <= end
            }

            return matchesSearch && matchesDate
        })

        setInitialRecords(filtered)
        setPage(1)
    }, [search, dateRange, data, isLoadingDateFilter])

    // Pagination
    useEffect(() => {
        const from = (page - 1) * pageSize
        const to = from + pageSize
        setRecordsData([...initialRecords.slice(from, to)])
    }, [page, pageSize, initialRecords])

    // Sorting
    useEffect(() => {
        if (sortStatus) {
            setRecordsData((prevRecords) => {
                return [...prevRecords].sort((a, b) => {
                    const aValue = (a as any)[sortStatus.columnAccessor]
                    const bValue = (b as any)[sortStatus.columnAccessor]
                    if (aValue < bValue) return sortStatus.direction === "asc" ? -1 : 1
                    if (aValue > bValue) return sortStatus.direction === "asc" ? 1 : -1
                    return 0
                })
            })
        }
    }, [sortStatus])

    const flattenRow = (row: any, index: number) => {
        const base = { ...row }

        if (row.personalLoan) {
            Object.assign(base, row.personalLoan)
            base.loanType = "Personal Loan"
        } else if (row.businessLoan) {
            Object.assign(base, row.businessLoan)
            base.loanType = "Business Loan"
        } else {
            base.loanType = "N/A"
        }

        base.serialNo = index + 1
        return base
    }

    // IMPROVED: Fetch and format filtered data from API
    useEffect(() => {
        const fetchData = async () => {
            if (dateRange.length === 2) {
                setIsLoadingDateFilter(true)

                const formatLocalDate = (date: Date): string => {
                    const year = date.getFullYear()
                    const month = String(date.getMonth() + 1).padStart(2, "0")
                    const day = String(date.getDate()).padStart(2, "0")
                    return `${year}-${month}-${day}`
                }

                const from = formatLocalDate(new Date(dateRange[0]))
                const to = formatLocalDate(new Date(dateRange[1]))

                try {
                    const response = await fetchFilteredLoanData(from, to, "created")

                    // Safely access nested `data`
                    const rawData = response?.data

                    if (!Array.isArray(rawData)) {
                        console.warn("❌ Expected an array, but got:", rawData)
                        setInitialRecords(data) // Fallback to original data
                        setIsLoadingDateFilter(false)
                        return
                    }

                    const formatted = rawData.map(formatDateFields).map(flattenRow)
                    setInitialRecords(formatted)
                    setPage(1)
                } catch (error) {
                    console.error("Failed to fetch filtered data", error)
                    setInitialRecords(data) // Fallback to original data on error
                } finally {
                    setIsLoadingDateFilter(false)
                }
            } else if (dateRange.length === 0) {
                // Reset to original data when date range is cleared, but re-apply search if active
                setIsLoadingDateFilter(false)

                if (search.trim() !== "") {
                    const filtered = data.filter((item) => {
                        return (
                            item.leadId?.toString().toLowerCase().includes(search.toLowerCase()) ||
                            item.mobileNumber?.toString().toLowerCase().includes(search.toLowerCase())
                        )
                    })
                    setInitialRecords(filtered)
                } else {
                    setInitialRecords(data)
                }

                setPage(1)
            }
        }

        fetchData()
    }, [dateRange, data, search]) // Added 'search' to dependencies

    // IMPROVED: Better handleClear function with search re-application
    const handleClear = () => {
        setIsLoadingDateFilter(false)
        setDateRange([])

        // Re-apply search filter to original data if search is active
        if (search.trim() !== "") {
            const filtered = data.filter((item) => {
                return (
                    item.leadId?.toString().toLowerCase().includes(search.toLowerCase()) ||
                    item.mobileNumber?.toString().toLowerCase().includes(search.toLowerCase())
                )
            })
            setInitialRecords(filtered)
        } else {
            setInitialRecords(data)
        }

        setPage(1)

        // Force Flatpickr to re-render by changing its key
        setFlatpickrKey((prev) => prev + 1)

        // Clear the flatpickr instance
        if (flatpickrRef.current) {
            try {
                flatpickrRef.current.flatpickr.clear()
                flatpickrRef.current.flatpickr.destroy()
            } catch (error) {
                console.log("Flatpickr cleanup error:", error)
            }
        }
    }

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

                    <button onClick={() => setShowDateRange(!showDateRange)} className="btn p-2 rounded-full" aria-label="Filter">
                        <IoMdFunnel className="w-6 h-6 text-blue-500" />
                    </button>

                    <div className="flex items-center gap-2 w-1/2 justify-end">
                        {showDateRange && (
                            <div className="relative w-full">
                                <Flatpickr
                                    key={flatpickrKey} // ADDED: Force re-render with key
                                    ref={flatpickrRef}
                                    options={{
                                        mode: "range",
                                        dateFormat: "d-m-Y",
                                    }}
                                    value={dateRange}
                                    onChange={(selectedDates) => {
                                        console.log("Date selected:", selectedDates)
                                        setDateRange(selectedDates)
                                    }}
                                    className="form-input w-full pl-10 pr-10 text-blue-500"
                                    placeholder="Select date range"
                                />

                                {/* Loading indicator */}
                                {isLoadingDateFilter && (
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    </div>
                                )}

                                {/* Clear Button */}
                                {dateRange.length > 0 && !isLoadingDateFilter && (
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
                    paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                />
            </div>
        </div>
    )
}

export default DataTableComponentsAllDetails
