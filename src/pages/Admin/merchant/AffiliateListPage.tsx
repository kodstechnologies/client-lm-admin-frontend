
import type React from "react"
import { useEffect, useState } from "react"
import { DataTable, type DataTableSortStatus } from "mantine-datatable"
import { Link } from "react-router-dom"
import IconPlus from "../../../components/Icon/IconPlus"
import { fetchAllAffiliates } from "../../../api"

type Affiliate = {
    _id: string
    Name: string
    Phone: string
    Email: string
    Description: string
}

type Column = {
    accessor: string
    title: string
    sortable?: boolean
    render?: (row: Affiliate, index: number) => React.ReactNode
}

const PAGE_SIZES = [10, 20, 50]

const AffiliateListPage: React.FC = () => {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: "Name",
        direction: "asc",
    })
    const [selectedRecords, setSelectedRecords] = useState<Affiliate[]>([])
    const [totalRecords, setTotalRecords] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchAllAffiliates()
                const fetchedAffiliates = res.data.data
                setAffiliates(fetchedAffiliates)
                // Update totalRecords with the actual count
                setTotalRecords(fetchedAffiliates.length)
            } catch (error) {
                console.error("Failed to fetch affiliates", error)
                // Reset to empty state on error
                setAffiliates([])
                setTotalRecords(0)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const columns: Column[] = [
        { accessor: "_id", title: "Affiliate ID", sortable: true },
        { accessor: "Name", title: "Affiliate Name", sortable: true },
        { accessor: "Phone", title: "Phone", sortable: true },
        { accessor: "Email", title: "Email", sortable: true },
        { accessor: "Description", title: "Description" },
        {
            accessor: "IsActive",
            title: "STATUS",
            sortable: true,
            render: (row: any) => (
                <span
                    className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${row.IsActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {row.IsActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            accessor: "actions",
            title: "Actions",
            render: (row: Affiliate) => (
                <Link to={`/admin/edit-merchant-affiliate/${row._id}`} className="btn btn-primary gap-2">
                    Edit
                </Link>
            ),
        },
    ]

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <Link to="/admin/create-merchant-affiliate" className="btn btn-primary gap-2">
                    <IconPlus />
                    Create Affiliate
                </Link>
            </div>

            <DataTable
                className="whitespace-nowrap table-hover"
                highlightOnHover
                fetching={loading}
                records={affiliates}
                columns={columns}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                totalRecords={totalRecords}
                withBorder={false}
                paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
            />
        </div>
    )
}

export default AffiliateListPage
