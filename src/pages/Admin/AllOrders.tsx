//all orders
import React, { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../../store/themeConfigSlice"
import { IoIosArrowDropright, IoIosArrowDropdown, IoMdFunnel } from "react-icons/io"
import { Loader2, CheckCircle2, QrCode } from "lucide-react"
import QRCode from "react-qr-code"
import type Flatpickr from "react-flatpickr"
import FlatpickrReact from "react-flatpickr"
import "flatpickr/dist/themes/material_blue.css"
import { MdArrowBackIos } from "react-icons/md"
import { MdOutlineArrowForwardIos } from "react-icons/md"
import { getAllOrders, updateOrderById } from "../../api/index"

interface OrderType {
    id?: string
    orderId?: string
    status: string
    createdAt: string
    updatedAt: string
    name: string
    number: string
    qrUrl?: string
    eligibleAmount?: number
    max_amount?: number
    storeId?: string
}

interface AccordionContentProps {
    status: string
    orderId?: string
    qrUrl?: string
    onCompleteOrder?: (orderId: string) => void
    isCompletingOrder?: boolean
    eligibilityAmount?: number
    maxAmount?: number
}

const AccordionContent = ({
    status,
    orderId,
    qrUrl,
    onCompleteOrder,
    isCompletingOrder,
    eligibilityAmount,
    maxAmount,
}: AccordionContentProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpand = () => setIsExpanded(!isExpanded)

    const handleQRClick = () => {
        if (qrUrl) {
            window.open(qrUrl)
        }
    }

    return (
        <div className="mt-4 bg-gray-50 rounded-lg">
            {status === "QR Generated" && (
                <div className="space-y-2">
                    {qrUrl ? (
                        <div className="bg-white rounded-lg border-gray-200 p-2">
                            {/* Loan amount message */}
                            <div className="p-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg text-left w-fit">
                                <p className="text-gray-700 text-sm">
                                    You are eligible for a loan ranging from <br />
                                    <span className="font-semibold text-blue-600">₹{(eligibilityAmount ?? 3000).toLocaleString()}</span>
                                    {" to "}
                                    <span className="font-semibold text-blue-600">₹{(maxAmount ?? 10000).toLocaleString()}</span>
                                </p>
                            </div>

                            {/* QR + Buttons - Left aligned */}
                            <div className="flex flex-row items-start gap-4 mt-4">
                                {/* QR Code Section */}
                                <div className="flex flex-col items-center space-y-1">
                                    <div className="text-center w-32">
                                        <h4 className="text-sm font-semibold text-gray-800">Scan QR</h4>
                                    </div>
                                    <div
                                        className="cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={handleQRClick}
                                        title="Click to open QR"
                                    >
                                        <QRCode value={qrUrl} size={120} className="text" />
                                    </div>
                                    <div className="w-32">
                                        <p className="text-xs text-gray-500 pt-1 text-center">Tap to open</p>
                                    </div>
                                </div>

                                {/* Buttons Section */}
                                <div className="flex flex-col space-y-2 mt-10">
                                    <button
                                        onClick={() => orderId && onCompleteOrder?.(orderId)}
                                        disabled={isCompletingOrder}
                                        className="bg-green-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs"
                                    >
                                        {isCompletingOrder ? (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Completing...
                                            </>
                                        ) : (
                                            "Complete Order"
                                        )}
                                    </button>

                                    <button
                                        onClick={handleQRClick}
                                        className="bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-1 text-xs"
                                    >
                                        <QrCode className="h-3 w-3" />
                                        Open QR Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm">QR Code not available for this order.</p>
                        </div>
                    )}
                </div>
            )}

            {status === "Completed" && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Order Completed Successfully!</span>
                    </div>
                </div>
            )}
        </div>
    )
}

const AllOrders = () => {
    // Initialize with proper types and default values
    const [allOrders, setAllOrders] = useState<OrderType[]>([])
    const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([])
    const [orders, setOrders] = useState<OrderType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [completingOrders, setCompletingOrders] = useState<Set<string>>(new Set())
    const [successMessage, setSuccessMessage] = useState<string>("")
    const [search, setSearch] = useState<string>("")
    const [searchLoading, setSearchLoading] = useState<boolean>(false)
    const [isSearchMode, setIsSearchMode] = useState<boolean>(false)
    const [dateRange, setDateRange] = useState<Date[] | string[]>([])
    const [isDateFilterMode, setIsDateFilterMode] = useState<boolean>(false)
    const [dateFilterLoading, setDateFilterLoading] = useState<boolean>(false)
    const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState<boolean>(false)
    const [initialLoading, setInitialLoading] = useState<boolean>(true)

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [totalOrders, setTotalOrders] = useState<number>(0)
    const ordersPerPage = 20

    const dispatch = useDispatch()
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const flatpickrRef = useRef<Flatpickr | null>(null)

    useEffect(() => {
        dispatch(setPageTitle("Orders"))
    }, [dispatch])

    // Helper function to ensure data is always an array
    const ensureArray = (data: any): OrderType[] => {
        if (!data) return []
        if (Array.isArray(data)) return data
        return [data]
    }

    // Apply all active filters to the data
    const applyFilters = (data: OrderType[], searchTerm: string = search, dateFilter: Date[] = dateRange as Date[]) => {
        let filtered = [...data]

        // Apply date filter if active
        if (dateFilter.length === 2) {
            const startDate = new Date(dateFilter[0])
            startDate.setHours(0, 0, 0, 0)
            const endDate = new Date(dateFilter[1])
            endDate.setHours(23, 59, 59, 999)

            filtered = filtered.filter((order) => {
                const orderDate = new Date(order.updatedAt)
                return orderDate >= startDate && orderDate <= endDate
            })
        }

        // Apply search filter if active
        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((order) => order.number === searchTerm.trim())
        }

        return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }

    // Apply pagination to filtered data
    const applyPagination = (data: OrderType[], page = 1) => {
        const totalFiltered = data.length
        const calculatedTotalPages = Math.ceil(totalFiltered / ordersPerPage)
        const startIndex = (page - 1) * ordersPerPage
        const endIndex = startIndex + ordersPerPage
        const paginatedOrders = data.slice(startIndex, endIndex)

        setOrders(paginatedOrders)
        setTotalPages(calculatedTotalPages)
        setTotalOrders(totalFiltered)
        setCurrentPage(page)
    }

    // Load orders from API
    const loadOrdersFromAPI = async (isInitialLoad = false) => {
        if (isInitialLoad) {
            setInitialLoading(true)
        } else {
            setLoading(true)
        }
        setError(null)

        try {
            const response = await getAllOrders()
            const responseData = response?.data || response || []
            const ordersArray = ensureArray(responseData)

            // Filter to last 30 days
            const endDate = new Date()
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - 30)

            const last30DaysOrders = ordersArray.filter((order: OrderType) => {
                const orderDate = new Date(order.updatedAt)
                return orderDate >= startDate && orderDate <= endDate
            })

            setAllOrders(last30DaysOrders)

            // Apply current filters and pagination
            const filtered = applyFilters(last30DaysOrders)
            setFilteredOrders(filtered)
            applyPagination(filtered, 1)
        } catch (err) {
            setError("Failed to load orders.")
            console.error("Load orders error:", err)
            setOrders([])
            setAllOrders([])
            setFilteredOrders([])
        } finally {
            if (isInitialLoad) {
                setInitialLoading(false)
            } else {
                setLoading(false)
            }
        }
    }

    // Handle search
    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm)
        setIsSearchMode(searchTerm.trim() !== "")

        if (searchTerm.trim() === "") {
            // If search is cleared, apply other filters
            const filtered = applyFilters(allOrders, "", dateRange as Date[])
            setFilteredOrders(filtered)
            applyPagination(filtered, 1)
        } else {
            // Apply search along with other filters
            const filtered = applyFilters(allOrders, searchTerm, dateRange as Date[])
            setFilteredOrders(filtered)
            applyPagination(filtered, 1)
        }
    }

    // Handle date filter
    const handleDateFilter = (selectedDates: Date[]) => {
        setDateRange(selectedDates)
        setIsDateFilterMode(selectedDates.length === 2)

        if (selectedDates.length === 2) {
            setDateFilterLoading(true)

            try {
                const filtered = applyFilters(allOrders, search, selectedDates)
                setFilteredOrders(filtered)
                applyPagination(filtered, 1)
            } catch (err) {
                console.error("Date filter error:", err)
                setError("Failed to filter orders by date.")
            } finally {
                setDateFilterLoading(false)
            }
        } else {
            // If date filter is cleared, apply other filters
            const filtered = applyFilters(allOrders, search, [])
            setFilteredOrders(filtered)
            applyPagination(filtered, 1)
        }
    }

    // Handle clear search
    const handleClearSearch = () => {
        handleSearch("")
    }

    // Handle clear date filter
    const handleClearDateFilter = () => {
        setDateRange([])
        setIsDateFilterMode(false)
        setError(null)
        if (flatpickrRef.current) {
            flatpickrRef.current.flatpickr.clear()
        }

        // Apply remaining filters
        const filtered = applyFilters(allOrders, search, [])
        setFilteredOrders(filtered)
        applyPagination(filtered, 1)
    }

    // Initial load
    useEffect(() => {
        if (!hasInitiallyLoaded) {
            loadOrdersFromAPI(true)
            setHasInitiallyLoaded(true)
        }
    }, [hasInitiallyLoaded])

    // Handle search with debounce
    useEffect(() => {
        if (!hasInitiallyLoaded) return

        const timeoutId = setTimeout(() => {
            if (search.trim() !== "") {
                handleSearch(search)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [search, hasInitiallyLoaded])

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    const toggleRow = (rowId: string) => {
        setExpandedRow(expandedRow === rowId ? null : rowId)
    }

    const handleCompleteOrder = async (orderId: string) => {
        try {
            setCompletingOrders((prev) => new Set(prev).add(orderId))

            const response = await updateOrderById(orderId)

            if (response.data.success) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) => {
                        const currentOrderId = order.id || order.orderId
                        if (currentOrderId === orderId) {
                            return { ...order, status: "Completed" }
                        }
                        return order
                    }),
                )

                setSuccessMessage(`Order ${orderId} completed successfully!`)
            } else {
                throw new Error("Failed to complete order")
            }
        } catch (error: any) {
            console.error("Error completing order:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to complete order"
            setError(errorMessage)
            setTimeout(() => setError(null), 5000)
        } finally {
            setCompletingOrders((prev) => {
                const newSet = new Set(prev)
                newSet.delete(orderId)
                return newSet
            })
        }
    }

    const getStatusButton = (status: string) => {
        let btnClass = "btn btn-outline-primary btn-sm rounded-full w-full"
        if (status === "Completed") btnClass = "btn btn-outline-success btn-sm rounded-full w-full"
        else if (status === "Rejected") btnClass = "btn btn-outline-danger btn-sm rounded-full w-full"
        else if (status === "On Hold") btnClass = "btn btn-outline-warning btn-sm rounded-full w-full"

        return (
            <button type="button" className={btnClass} disabled={status === "Rejected"}>
                {status}
            </button>
        )
    }

    const formatDateTime = (dateTime: string) => {
        try {
            const date = new Date(dateTime)

            const day = String(date.getDate()).padStart(2, "0")
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const year = date.getFullYear()

            let hours = date.getHours()
            const minutes = String(date.getMinutes()).padStart(2, "0")

            const ampm = hours >= 12 ? "PM" : "AM"
            hours = hours % 12 || 12

            return `${day}/${month}/${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`
        } catch {
            return dateTime
        }
    }

    // Handle page changes
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setExpandedRow(null)
            applyPagination(filteredOrders, page)
        }
    }

    // Generate page numbers for pagination
    const getVisiblePages = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pages.push(i)
                }
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i)
                }
            }
        }

        return pages
    }

    return (
        <div className="mb-8 px-2 sm:px-0">
            {/* Success Message */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>{successMessage}</span>
                </div>
            )}

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            {/* Search and Filter Section */}
            <div className="mb-4">
                <div className="flex gap-2 flex-wrap">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-[400px]">
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            maxLength={10}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Search by Phone Number"
                            value={search}
                            onChange={(e) => {
                                const value = e.target.value
                                if (/^\d{0,10}$/.test(value)) {
                                    setSearch(value)
                                }
                            }}
                        />

                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>

                        {searchLoading && (
                            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            </div>
                        )}

                        {search && !searchLoading && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white text-sm px-2 py-1 rounded hover:bg-gray-600"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Date Filter */}
                    <div className="relative w-full sm:w-[300px]">
                        <div className="relative">
                            <IoMdFunnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 pointer-events-none z-10" />
                            <FlatpickrReact
                                ref={flatpickrRef}
                                value={dateRange}
                                onChange={(selectedDates) => {
                                    handleDateFilter(selectedDates)
                                }}
                                options={{
                                    mode: "range",
                                    dateFormat: "d/m/Y",
                                }}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Filter by Date Range"
                            />

                            {dateFilterLoading && (
                                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                </div>
                            )}

                            {dateRange.length > 0 && !dateFilterLoading && (
                                <button
                                    onClick={handleClearDateFilter}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white text-sm px-2 py-1 rounded hover:bg-gray-600"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Messages */}
                <div className="mt-2 space-y-1">
                    {isSearchMode && isDateFilterMode && (
                        <div className="text-sm text-gray-600">
                            {searchLoading || dateFilterLoading
                                ? "Searching and filtering..."
                                : `Found ${totalOrders} order${totalOrders !== 1 ? "s" : ""} for "${search}" in selected date range`}
                        </div>
                    )}

                    {isSearchMode && !isDateFilterMode && (
                        <div className="text-sm text-gray-600">
                            {searchLoading
                                ? "Searching..."
                                : `Found ${totalOrders} order${totalOrders !== 1 ? "s" : ""} for "${search}"`}
                        </div>
                    )}

                    {!isSearchMode && isDateFilterMode && (
                        <div className="text-sm text-gray-600">
                            {dateFilterLoading
                                ? "Filtering by date..."
                                : `Found ${totalOrders} order${totalOrders !== 1 ? "s" : ""} in selected date range`}
                        </div>
                    )}

                    {!isSearchMode && !isDateFilterMode && (
                        <div className="text-sm text-gray-600">
                            Showing {orders.length} orders from page {currentPage} of {totalPages} (Total: {totalOrders} orders from
                            past 30 days)
                        </div>
                    )}
                </div>
            </div>

            {(loading || initialLoading) && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">{initialLoading ? "Loading orders..." : "Loading..."}</span>
                </div>
            )}

            {!loading && !initialLoading && (
                <>
                    {/* Responsive Table View for All Devices */}
                    <div className="relative">
                        {/* Scrollable Table Container */}
                        <div className="max-h-[500px] overflow-y-auto rounded-lg shadow border border-gray-200">
                            <table className="w-full border-collapse bg-white">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm">
                                            Details
                                        </th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                                            Order ID
                                        </th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                                            Status
                                        </th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                                            Date & Time
                                        </th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                                            Full Name
                                        </th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                                            Phone
                                        </th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                                            StoreId
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(orders) && orders.length > 0 ? (
                                        orders.map((row) => {
                                            const rowId = row.id || row.orderId || `order-${Math.random()}`
                                            const isCompleting = completingOrders.has(rowId)

                                            return (
                                                <React.Fragment key={rowId}>
                                                    {/* Table Row */}
                                                    <tr className="border border-gray-300 hover:bg-gray-50">
                                                        <td className="border border-gray-300 p-2 sm:p-3 text-center">
                                                            <button
                                                                onClick={() => toggleRow(rowId)}
                                                                className="text-xl sm:text-2xl focus:outline-none hover:text-primary transition-colors"
                                                            >
                                                                {expandedRow === rowId ? <IoIosArrowDropdown /> : <IoIosArrowDropright />}
                                                            </button>
                                                        </td>
                                                        <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                                                            {row.orderId || row.id}
                                                        </td>
                                                        <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                                                            {getStatusButton(row.status)}
                                                        </td>
                                                        <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                                                            {formatDateTime(row.updatedAt)}
                                                        </td>
                                                        <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">{row.name}</td>
                                                        <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">{row.number}</td>
                                                        <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                                                            {row.storeId ? (
                                                                <a
                                                                    href={`/admin/merchants-store/edit/${row.storeId}`}
                                                                    target="_blank"
                                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                                    rel="noreferrer"
                                                                >
                                                                    {row.storeId}
                                                                </a>
                                                            ) : (
                                                                "N/A"
                                                            )}
                                                        </td>
                                                    </tr>

                                                    {/* Accordion Row */}
                                                    {expandedRow === rowId && (
                                                        <tr>
                                                            <td colSpan={7} className="border border-gray-300 p-0">
                                                                <AccordionContent
                                                                    status={row.status}
                                                                    orderId={rowId}
                                                                    qrUrl={row.qrUrl}
                                                                    onCompleteOrder={handleCompleteOrder}
                                                                    isCompletingOrder={isCompleting}
                                                                    eligibilityAmount={row.eligibleAmount}
                                                                    maxAmount={row.max_amount}
                                                                />
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center text-gray-500 py-6">
                                                No orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <ul className="mt-6 mb-10 flex justify-center items-center space-x-1 rtl:space-x-reverse">
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary disabled:opacity-50"
                                    >
                                        <MdArrowBackIos />
                                    </button>
                                </li>

                                {getVisiblePages().map((pageNum) => (
                                    <li key={pageNum}>
                                        <button
                                            type="button"
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3.5 py-2 rounded-full transition font-semibold ${currentPage === pageNum
                                                    ? "bg-primary text-white"
                                                    : "bg-white-light text-dark hover:text-white hover:bg-primary"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    </li>
                                ))}

                                <li>
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-full transition bg-white-light text-dark hover:text-white hover:bg-primary disabled:opacity-50"
                                    >
                                        <MdOutlineArrowForwardIos />
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default AllOrders
