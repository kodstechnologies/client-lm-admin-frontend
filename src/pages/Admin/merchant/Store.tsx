import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import DataTableComponentsStore from '../../../components/common/DataTableComponentsStore';
import { fetchAllMerchants, fetchStoresByMerchantId } from '../../../api';
const columns = [
    {
        accessor: 'id',
        title: 'Group ID',
        sortable: true,
        render: (row: any) => `${row.merchantId}`,
    },
    { accessor: 'storeBrand', title: 'STORE BRAND', sortable: true },
    { accessor: 'countOfStores', title: 'COUNT OF STORES', sortable: true },
    { accessor: 'Phone', title: 'PHONE', sortable: true },
    { accessor: 'Email', title: 'EMAIL', sortable: true },
    { accessor: 'Description', title: 'DESCRIPTION', sortable: true },

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
    {
        accessor: 'action',
        title: 'ACTION',
        sortable: false,
        render: ({ merchantId, storeBrand }: { merchantId: string; storeBrand: string }) => (
            <Link
                to={`/admin/merchants-store/${merchantId}`}
                state={{ storeBrand }}
                className="btn btn-primary gap-2"
            >
                View
            </Link>
        ),
    },
];


const Store = () => {
    const dispatch = useDispatch();
    const [rowData, setRowData] = useState<any[]>([]);


    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
        loadMerchants();
    }, []);

    const loadMerchants = async () => {
        try {
            const data = await fetchAllMerchants();
            const merchantsWithCounts = await Promise.all(
                data.merchants.map(async (merchant: any, index: number) => {
                    const stores = await fetchStoresByMerchantId(merchant._id);
                    return {
                        id: index + 1,
                        merchantId: merchant._id,
                        storeBrand: merchant.Name,
                        countOfStores: stores.length || 0,
                        Phone: merchant.Phone || '-',
                        Email: merchant.Email || '-',
                        Description: merchant.Description || '-',
                        IsActive: merchant.IsActive ?? false,
                    };
                })
            );

            setRowData(merchantsWithCounts);
        } catch (err) {
            console.error('Failed to fetch merchants or store counts:', err);
        }
    };


    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Merchants</span>
                </li>
            </ul>
            <div>
                <DataTableComponentsStore
                    data={rowData}
                    columns={columns}
                    createPage="/admin/merchants-store/create-merchant"
                />
            </div>
        </div>
    );
};

export default Store;
