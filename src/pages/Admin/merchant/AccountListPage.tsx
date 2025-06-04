
import type React from "react"
import { useEffect, useState } from "react"
import { DataTable, type DataTableSortStatus } from "mantine-datatable"
import { Link } from "react-router-dom"
import IconPlus from "../../../components/Icon/IconPlus"
import { fetchAllAccounts } from "../../../api"

type Account = {
    _id: string
    AccountName: string
    AccountNumber: string
    IFSCCode: string
    Description: string
}

type Column = {
    accessor: string
    title: string
    sortable?: boolean
    render?: (row: Account, index: number) => React.ReactNode
}

const PAGE_SIZES = [10, 20, 50]

const AccountListPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: "AccountName",
        direction: "asc",
    })
    const [selectedRecords, setSelectedRecords] = useState<Account[]>([])
    const [totalRecords, setTotalRecords] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchAllAccounts()
                // console.log("🚀 ~ fetchData ~ res:", res)
                const fetchedAccounts = res.data.data
                setAccounts(fetchedAccounts)
                // Update totalRecords with the actual count
                setTotalRecords(fetchedAccounts.length)
            } catch (error) {
                console.error("Failed to fetch accounts", error)
                // Reset to empty state on error
                setAccounts([])
                setTotalRecords(0)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const columns: Column[] = [
        { accessor: "_id", title: "Account ID", sortable: true },
        { accessor: "AccountName", title: "Account Name", sortable: true },
        { accessor: "AccountNumber", title: "Account Number", sortable: true },
        { accessor: "IFSCCode", title: "IFSC Code", sortable: true },
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
            render: (row: Account) => (
                <Link to={`/admin/edit-merchant-account/${row._id}`} className="btn btn-primary gap-2">
                    Edit
                </Link>
            ),
        },
    ]

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <Link to="/admin/create-merchant-account" className="btn btn-primary gap-2">
                    <IconPlus />
                    Create Account
                </Link>
            </div>

            <DataTable
                className="whitespace-nowrap table-hover"
                highlightOnHover
                fetching={loading}
                records={accounts}
                columns={columns}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={setPage}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                withBorder={false}
                totalRecords={totalRecords}
                paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
            />
        </div>
    )
}

export default AccountListPage
