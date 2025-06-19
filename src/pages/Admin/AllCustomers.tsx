

import React, { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { setPageTitle } from "../../store/themeConfigSlice"
import { IoIosArrowDropright, IoIosArrowDropdown, IoMdFunnel } from "react-icons/io"
import { Loader2, CheckCircle2, User, MapPin, DollarSign, Building, Shield } from "lucide-react"
import type Flatpickr from "react-flatpickr"
import FlatpickrReact from "react-flatpickr"
import "flatpickr/dist/themes/material_blue.css"
import { MdArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md"
import { getAllCustomers } from "../../api/index"

interface CustomerType {
  _id?: string
  mobileNumber: string
  first_name: string
  last_name: string
  employment_type_id: string
  eligibility_status: Array<{
    storeId: string
    isEligible: boolean
  }>
  pan: string
  dob: Date | string
  pincode: string
  income: number
  consent: boolean
  consent_timestamp?: Date | string
  message?: string
  max_eligibility_amount?: string
  eligibility_expiry_date?: Date | string
  tenure?: number
  data?: any
  ChainStoreId?: string
  storeId?: string
  LenderErrorapiResponse?: any
  status?: string
  createdAt: string
  updatedAt: string
}

interface AccordionContentProps {
  customer: CustomerType
}

const AccordionContent = ({ customer }: AccordionContentProps) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A"
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }

  const formatCurrency = (amount: number | string | undefined) => {
    if (!amount) return "N/A"
    const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return `₹${numAmount.toLocaleString("en-IN")}`
  }

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Personal Information */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            Personal Information
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Full Name:</span>
              <span className="ml-2">
                {customer.first_name} {customer.last_name}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">PAN:</span>
              <span className="ml-2 font-mono">{customer.pan}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Date of Birth:</span>
              <span className="ml-2">{formatDate(customer.dob)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Employment Type:</span>
              <span className="ml-2">{customer.employment_type_id}</span>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-500" />
            Contact & Location
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Mobile:</span>
              <span className="ml-2 font-mono">{customer.mobileNumber}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Pincode:</span>
              <span className="ml-2">{customer.pincode}</span>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-yellow-500" />
            Financial Information
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Income:</span>
              <span className="ml-2">{formatCurrency(customer.income)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Max Eligibility:</span>
              <span className="ml-2">
                {customer.max_eligibility_amount ? formatCurrency(customer.max_eligibility_amount) : "N/A"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Tenure:</span>
              <span className="ml-2">
                {customer.tenure ? `${customer.tenure} ${customer.tenure === 1 ? "month" : "months"}` : "N/A"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Eligibility Expiry:</span>
              <span className="ml-2">{formatDate(customer.eligibility_expiry_date)}</span>
            </div>
          </div>
        </div>

        {/* Consent & Status */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-500" />
            Consent & Status
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Consent:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${customer.consent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {customer.consent ? "Given" : "Not Given"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Consent Date:</span>
              <span className="ml-2">{formatDate(customer.consent_timestamp)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>
              <span className="ml-2">{customer.status || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Building className="h-4 w-4 text-indigo-500" />
            Store Information
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Store ID:</span>
              <span className="ml-2 font-mono text-xs">{customer.storeId || "N/A"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Chain Store ID:</span>
              <span className="ml-2 font-mono text-xs">{customer.ChainStoreId || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Eligibility Status */}
        <div className="bg-white rounded-lg p-4 border">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-500" />
            Eligibility Status
          </h4>
          <div className="space-y-2 text-sm">
            {customer.eligibility_status && customer.eligibility_status.length > 0 ? (
              customer.eligibility_status.map((status, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Store {status.storeId}:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${status.isEligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {status.isEligible ? "Eligible" : "Not Eligible"}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-gray-500">No eligibility data</span>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {customer.message && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="font-medium text-blue-800 mb-2">Message:</h5>
          <p className="text-sm text-blue-700">{customer.message}</p>
        </div>
      )}

      {/* Lender Error Response */}
      {customer.LenderErrorapiResponse && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <h5 className="font-medium text-red-800 mb-2">Lender API Response:</h5>
          <pre className="text-xs text-red-700 overflow-auto max-h-32">
            {JSON.stringify(customer.LenderErrorapiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

const AllCustomers = () => {
  const [allCustomers, setAllCustomers] = useState<CustomerType[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerType[]>([])
  const [customers, setCustomers] = useState<CustomerType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
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
  const [totalCustomers, setTotalCustomers] = useState<number>(0)
  const customersPerPage = 20

  const dispatch = useDispatch()
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const flatpickrRef = useRef<Flatpickr | null>(null)

  useEffect(() => {
    dispatch(setPageTitle("Customers"))
  }, [dispatch])

  // Helper function to ensure data is always an array
  const ensureArray = (data: any): CustomerType[] => {
    if (!data) return []
    if (Array.isArray(data)) return data
    return [data]
  }

  // Apply all active filters to the data
  const applyFilters = (
    data: CustomerType[],
    searchTerm: string = search,
    dateFilter: Date[] = dateRange as Date[],
  ) => {
    let filtered = [...data]

    // Apply date filter if active
    if (dateFilter.length === 2) {
      const startDate = new Date(dateFilter[0])
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(dateFilter[1])
      endDate.setHours(23, 59, 59, 999)

      filtered = filtered.filter((customer) => {
        const customerDate = new Date(customer.createdAt)
        return customerDate >= startDate && customerDate <= endDate
      })
    }

    // Apply search filter if active
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((customer) => customer.mobileNumber.includes(searchTerm.trim()))
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  // Apply pagination to filtered data
  const applyPagination = (data: CustomerType[], page = 1) => {
    const totalFiltered = data.length
    const calculatedTotalPages = Math.ceil(totalFiltered / customersPerPage)
    const startIndex = (page - 1) * customersPerPage
    const endIndex = startIndex + customersPerPage
    const paginatedCustomers = data.slice(startIndex, endIndex)

    setCustomers(paginatedCustomers)
    setTotalPages(calculatedTotalPages)
    setTotalCustomers(totalFiltered)
    setCurrentPage(page)
  }

  // Load customers from API
  const loadCustomersFromAPI = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setInitialLoading(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const response = await getAllCustomers()
      const responseData = response?.data?.customers || response?.customers || response?.data || response || []
      const customersArray = ensureArray(responseData)

      // Filter to last 30 days
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const last30DaysCustomers = customersArray.filter((customer: CustomerType) => {
        const customerDate = new Date(customer.updatedAt)
        return customerDate >= startDate && customerDate <= endDate
      })

      setAllCustomers(last30DaysCustomers)

      // Apply current filters and pagination
      const filtered = applyFilters(last30DaysCustomers)
      setFilteredCustomers(filtered)
      applyPagination(filtered, 1)
    } catch (err) {
      setError("Failed to load customers.")
      console.error("Load customers error:", err)
      setCustomers([])
      setAllCustomers([])
      setFilteredCustomers([])
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
      const filtered = applyFilters(allCustomers, "", dateRange as Date[])
      setFilteredCustomers(filtered)
      applyPagination(filtered, 1)
    } else {
      // Apply search along with other filters
      const filtered = applyFilters(allCustomers, searchTerm, dateRange as Date[])
      setFilteredCustomers(filtered)
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
        const filtered = applyFilters(allCustomers, search, selectedDates)
        setFilteredCustomers(filtered)
        applyPagination(filtered, 1)
      } catch (err) {
        console.error("Date filter error:", err)
        setError("Failed to filter customers by date.")
      } finally {
        setDateFilterLoading(false)
      }
    } else {
      // If date filter is cleared, apply other filters
      const filtered = applyFilters(allCustomers, search, [])
      setFilteredCustomers(filtered)
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
    const filtered = applyFilters(allCustomers, search, [])
    setFilteredCustomers(filtered)
    applyPagination(filtered, 1)
  }

  // Initial load
  useEffect(() => {
    if (!hasInitiallyLoaded) {
      loadCustomersFromAPI(true)
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

  const toggleRow = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId)
  }

  const getConsentBadge = (consent: boolean) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${consent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
      >
        {consent ? "Given" : "Not Given"}
      </span>
    )
  }

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <span>N/A</span>

    let badgeClass = " "
    switch (status.toLowerCase()) {
      case "active":
        badgeClass += "bg-green-100 text-green-800"
        break
      case "inactive":
        badgeClass += "bg-red-100 text-red-800"
        break
      case "pending":
        badgeClass += "bg-yellow-100 text-yellow-800"
        break
      default:
        badgeClass += ""
    }

    return <span className={badgeClass}>{status}</span>
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

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setExpandedRow(null)
      applyPagination(filteredCustomers, page)
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
                : `Found ${totalCustomers} customer${totalCustomers !== 1 ? "s" : ""} for "${search}" in selected date range`}
            </div>
          )}

          {isSearchMode && !isDateFilterMode && (
            <div className="text-sm text-gray-600">
              {searchLoading
                ? "Searching..."
                : `Found ${totalCustomers} customer${totalCustomers !== 1 ? "s" : ""} for "${search}"`}
            </div>
          )}

          {!isSearchMode && isDateFilterMode && (
            <div className="text-sm text-gray-600">
              {dateFilterLoading
                ? "Filtering by date..."
                : `Found ${totalCustomers} customer${totalCustomers !== 1 ? "s" : ""} in selected date range`}
            </div>
          )}

          {!isSearchMode && !isDateFilterMode && (
            <div className="text-sm text-gray-600">
              Showing {customers.length} customers from page {currentPage} of {totalPages} (Total: {totalCustomers}{" "}
              customers from past 30 days)
            </div>
          )}
        </div>
      </div>

      {(loading || initialLoading) && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">{initialLoading ? "Loading customers..." : "Loading..."}</span>
        </div>
      )}

      {!loading && !initialLoading && (
        <>
          {/* Responsive Table View */}
          <div className="relative">
            <div className="max-h-[500px] overflow-y-auto rounded-lg shadow border border-gray-200">
              <table className="w-full border-collapse bg-white">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="border border-gray-300 p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm">
                      Details
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                      Full Name
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                      Mobile Number
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                      PAN
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                      Income
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                      Store Id
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                      Status
                    </th>
                    <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(customers) && customers.length > 0 ? (
                    customers.map((customer) => {
                      const rowId = customer._id || `customer-${Math.random()}`

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
                              {customer.first_name} {customer.last_name}
                            </td>
                            <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm font-mono">
                              {customer.mobileNumber}
                            </td>
                            <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm font-mono">
                              {customer.pan}
                            </td>
                            <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                              {formatCurrency(customer.income)}
                            </td>
                            <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                              {customer.storeId ? (
                                <a
                                  href={`/admin/merchants-store/edit/${customer.storeId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {customer.storeId}
                                </a>
                              ) : (
                                <span className="ml-2 font-mono text-xs">N/A</span>
                              )}
                            </td>
                            <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm text-center">
                              <span
                                className={`inline-block ${customer.status === "QR Generated"
                                    ? "btn btn-outline-primary btn-sm rounded-full w-full"
                                    : customer.status === "Completed"
                                      ? "btn btn-outline-success btn-sm rounded-full w-full"
                                      : ""
                                  }`}
                              >
                                {getStatusBadge(customer.status)}
                              </span>
                            </td>
                            <td className="border border-gray-300 p-2 sm:p-3 text-xs sm:text-sm">
                              {formatDateTime(customer.createdAt)}
                            </td>
                          </tr>

                          {/* Accordion Row */}
                          {expandedRow === rowId && (
                            <tr>
                              <td colSpan={8} className="border border-gray-300 p-0">
                                <AccordionContent customer={customer} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-500 py-6">
                        No customers found.
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

export default AllCustomers
