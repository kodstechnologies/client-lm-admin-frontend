import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import DataTableComponentChainStore from '../../../components/common/DataTableComponentChainStore';
import { fetchStoresByMerchantId, uploadStore } from '../../../api';
import IconPlus from '../../../components/Icon/IconPlus';
import IconFile from '../../../components/Icon/IconFolder';
import { showMessage } from '../../../components/common/ShowMessage';





const StoreData = () => {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { id } = useParams();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortStatus, setSortStatus] = useState({ columnAccessor: 'Name', direction: 'asc' as const });
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const location = useLocation();
    const { storeBrand } = location.state || {};
    // console.log("🚀 ~ StoreData ~ storeBrand:", storeBrand)
    const PAGE_SIZES = [5, 10, 20, 50];
    const columns = [
        {
            accessor: 'serialNo',
            title: 'SERIAL NO.',
            sortable: false,
            render: (row: any, index: number) => {
                const pageSize = 10;
                const currentPage = 1;
                return <>{(currentPage - 1) * pageSize + index + 1}</>;
            },
        },
        {
            accessor: 'StoreCode',
            title: 'STORE ID',
            sortable: false,

        },
        { accessor: 'Name', title: 'STORE NAME', sortable: true },

        { accessor: 'Address', title: 'ADDRESS', sortable: true },
        {
            accessor: 'pinCode',
            title: 'PIN CODE',
            sortable: true,
        },
        { accessor: 'Phone', title: 'PHONE', sortable: true },
        { accessor: 'Email', title: 'EMAIL', sortable: true },
        { accessor: 'State', title: 'BRANCH STATE', sortable: true },
        { accessor: 'GSTIN', title: 'GSTIN', sortable: true },

        // Render GroupId as hyperlink
        {
            accessor: 'ChainStoreId',
            title: 'GroupId',
            sortable: true,
            // render: (row: any) => (
            //     <Link to={`/admin/merchant-store-group`} className="text-blue-600">
            //         {row.MerchantId}
            //     </Link>
            // ),

        },

        // Render AffiliateId as hyperlink
        {
            accessor: 'AffiliateId',
            title: 'AffiliateId',
            sortable: true,
            render: (row: any) => (
                <Link to={`/admin/edit-merchant-affiliate/${row.AffiliateId}`} className="text-blue-600 ">
                    {row.AffiliateId}
                </Link>
            ),
        },

        // Render AccountId as hyperlink
        {
            accessor: 'AccountId',
            title: 'AccountId',
            sortable: true,
            render: (row: any) => (
                <Link to={`/admin/edit-merchant-account/${row.AccountId}`} className="text-blue-600">
                    {row.AccountId}
                </Link>
            ),
        },
        {
            accessor: 'action',
            title: 'ACTION',
            sortable: false,
            render: (row: any) => (
                <Link
                    to={`/admin/merchants-store/edit/${row._id}`}
                    state={{ storeBrand }}
                    className="btn btn-primary gap-2"
                >
                    Edit
                </Link>
            ),
        },
        {
            accessor: 'IsActive',
            title: 'STATUS',
            sortable: true,
            render: (row: any) => (
                <span
                    className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${row.IsActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {row.IsActive ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];
    const fetchStores = async () => {
        if (!id) return;
        try {
            const data = await fetchStoresByMerchantId(id);
            if (Array.isArray(data)) {
                setStores(data);
            } else if (Array.isArray(data?.stores)) {
                setStores(data.stores);
            } else {
                console.error("Invalid response structure:", data);
                setStores([]);
            }
        } catch (error) {
            console.error("Error fetching stores:", error);
            setError('Failed to fetch stores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchStores();
        }
    }, [id]);
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && id) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                setLoading(true);
                const token = localStorage.getItem("authToken")
                const response = await uploadStore(formData, id, token);
                // console.log("Upload response:", response);
                await fetchStores();
                showMessage("Store data uploaded successfully.");
            } catch (err) {
                console.error("Upload failed:", err);
                showMessage("Failed to upload file. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">Dashboard</Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to={`/admin/merchants/${id}`} className="text-primary hover:underline">Stores</Link>
                </li>
            </ul>

            {/* Create and Upload Buttons */}
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <Link to={`/admin/merchants/${id}/create-store`} className="btn btn-primary gap-2">
                    <IconPlus /> Create
                </Link>
                <label className="btn btn-primary gap-2" style={{ cursor: 'pointer' }}>
                    <IconFile /> Upload
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            {/* Data Table */}
            <div style={{ position: 'relative' }}>
                <DataTableComponentChainStore
                    columns={columns}
                    data={stores.slice((page - 1) * pageSize, page * pageSize)}
                    createPage=""
                    totalRecords={stores.length}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    paginationText={({ from, to, totalRecords }) =>
                        `Showing ${from} to ${to} of ${totalRecords} entries`
                    }
                />

            </div>
        </div>
    );
};

export default StoreData;
