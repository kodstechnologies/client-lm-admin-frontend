import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Link } from 'react-router-dom';
import IconPlus from '../../../components/Icon/IconPlus';
import { fetchAllADataStores } from '../../../api';
type StoreGroup = {
    _id: string;
    Name: string;
    Phone: string;
    Email: string;
    Description: string;
};

type Column = {
    accessor: string;
    title: string;
    sortable?: boolean;
    render?: (row: StoreGroup, index: number) => React.ReactNode;
};

const PAGE_SIZES = [10, 20, 50];

const StoreGroupListPage: React.FC = () => {
    const [storeGroups, setStoreGroups] = useState<StoreGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'Name',
        direction: 'asc',
    });
    const [selectedRecords, setSelectedRecords] = useState<StoreGroup[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchAllADataStores();
                // console.log("🚀 ~ fetchData ~ res:", res)
                setStoreGroups(res.data.data);
            } catch (error) {
                console.error('Failed to fetch store groups', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns: Column[] = [
        // { accessor: '_id', title: 'ID', sortable: true },
        { accessor: 'GroupId', title: 'Group ID', sortable: true },
        { accessor: 'Name', title: 'Group Name', sortable: true },
        { accessor: 'Phone', title: 'Phone', sortable: true },
        { accessor: 'Email', title: 'Email', sortable: true },
        { accessor: 'Description', title: 'Description' },
        {
            accessor: 'actions',
            title: 'Actions',
            render: (row: StoreGroup) => (
                <Link
                    to={`/admin/edit-merchant-store-group/${row._id}`}
                    className="btn btn-primary gap-2"                >
                    Edit
                </Link>
            ),
        },
    ];
    const [totalRecords, setTotalRecords] = useState<number>(0);


    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-5">
                <Link to='/admin/create-merchant-store-group' className="btn btn-primary gap-2">
                    <IconPlus />
                    Create Group
                </Link>
            </div>

            <DataTable
                className="whitespace-nowrap table-hover"
                highlightOnHover
                fetching={loading}
                records={storeGroups}
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
                paginationText={({ from, to, totalRecords }) =>
                    `Showing ${from} to ${to} of ${totalRecords} entries`
                }
            />
        </div>
    );
};

export default StoreGroupListPage;
