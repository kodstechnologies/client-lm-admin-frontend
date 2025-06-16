import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import DataTableComponent from '../../../components/common/DataTableComponent';

const rowData = [
    { id: 1, storeBrand: 'Sangeetha Mobiles Pvt Ltd', countOfStores: '491' },
    { id: 2, storeBrand: 'Phonorange Pvt Ltd', countOfStores: '51' },
    { id: 3, storeBrand: 'Unilet', countOfStores: '53' },
    { id: 4, storeBrand: 'Wham Infocom Private Limited', countOfStores: '286' },
    { id: 5, storeBrand: 'Anuradha Mobiles Pvt Ltd', countOfStores: '20' },
    { id: 6, storeBrand: 'GT Chain', countOfStores: '17' },
    { id: 7, storeBrand: 'GT Induvidual', countOfStores: '287' },
    { id: 8, storeBrand: 'H2 Technologies India LLP', countOfStores: '31' },
    { id: 9, storeBrand: 'Lan Mark Shops India Pvt Ltd', countOfStores: '180'  },
    { id: 10, storeBrand: 'SLV', countOfStores: '9' },
    { id: 11, storeBrand: 'Trapasol', countOfStores: '35' },
];

const columns = [
    { accessor: 'id', title: 'SERIAL NO.', sortable: true },
    { accessor: 'storeBrand', title: 'STORE BRAND', sortable: true },
    { accessor: 'countOfStores', title: 'COUNT OF STORES', sortable: true },
    {
        accessor: 'action',
        title: 'ACTION',
        sortable: false,
        render: ({ id, link }: { id: number, link: string }) => (
            <Link to={`/admin/merchants/${id}`} className="btn btn-primary gap-2">
                View
            </Link>
        ),
    },
];
const Merchants = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });
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
                <DataTableComponent data={rowData} columns={columns} createPage="/admin/merchants/create" />
            </div>
        </div>
    );
};

export default Merchants;
