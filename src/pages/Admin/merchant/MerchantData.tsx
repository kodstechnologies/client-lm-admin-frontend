import { Link, useNavigate, useParams } from 'react-router-dom'
import DataTableComponent from '../../../components/common/DataTableComponent'
import { data } from '../../../data/merchantdata';

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
    { accessor: 'storeName', title: 'STORE NAME', sortable: true },
    { accessor: 'address', title: 'ADDRESS', sortable: true },
    { accessor: 'phone', title: 'PHONE', sortable: true },
    { accessor: 'email', title: 'EMAIL', sortable: true },
    { accessor: 'companyGroup', title: 'COMPANY GROUP', sortable: true },
    { accessor: 'state', title: 'BRANCH STATE', sortable: true },
    { accessor: 'gstin', title: 'GSTIN', sortable: true },
    { accessor: 'accountNumber', title: 'ACCOUNT NUMBER', sortable: true },

]

const MerchantData = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const newData = data.filter(dat => {
        if (id == dat.id.toString()) {
            return dat;
        }
    })

    return (
        <>
            <div>
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/" className="text-primary hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>MerchantData</span>
                    </li>
                </ul>

                {/* <div>MerchantApproval</div> */}
            </div>
            <div style={{ position: "relative" }}>
                <DataTableComponent columns={columns} data={newData} createPage='' />
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'end' }}>
                    <Link to="/admin/merchants" className="btn btn-primary gap-2" style={{ width: '20%' }}>
                        Back
                    </Link>
                </div>
            </div>
        </>
    )
}

export default MerchantData
