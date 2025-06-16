import { lazy } from 'react';
import AdminDashboard from '../pages/Admin/Dashboard';
import Merchants from '../pages/Admin/merchant/Merchants';
import MerchantApproval from '../pages/Admin/merchant/MerchantApproval';
import Orders from '../pages/Admin/Orders';
import Reports from '../pages/Admin/Reports';
import Settings from '../pages/Admin/Settings';
import CreateMerchant from '../components/Admin/Merchant/Create';
import EditMerchant from '../components/Admin/Merchant/Edit';
import MerchantData from '../pages/Admin/merchant/MerchantData';
import AdminProtected from '../components/Protected/AdminProtected';
import Login from '../pages/Login';
import OtpVerification from '../pages/OtpVerification';
import ProtectedRoute from '../components/Protected/ProtectedRoute';
import Loans from '../pages/Admin/Loans';
import Offers from '../pages/Admin/Offers';
import StoreGroupForm from '../pages/Admin/merchant/StoreGroupForm';
import AffiliateForm from '../pages/Admin/merchant/AffiliateForm';
import AccountForm from '../pages/Admin/merchant/AccountForm';
import Store from '../pages/Admin/merchant/Store';
import CreateStore from '../components/Admin/Merchant/CreateStore';
import CreateMerchantInStore from '../components/Admin/Merchant/createMerchant';
import StoreData from '../pages/Admin/merchant/StoreData';
import StoreGroupListPage from '../pages/Admin/merchant/StoreGroupListPage';
import AffiliateListPage from '../pages/Admin/merchant/AffiliateListPage';
import AccountListPage from '../pages/Admin/merchant/AccountListPage';
import EditStore from '../components/Admin/Merchant/EditStore';
import EditStoreGroup from '../pages/Admin/merchant/EditStoreGroup';
import EditAffiliate from '../pages/Admin/merchant/EditAffiliate';
import EditAccountForm from '../pages/Admin/merchant/EditAccount';
const KnowledgeBase = lazy(() => import('../pages/Pages/KnowledgeBase'));
const ContactUsBoxed = lazy(() => import('../pages/Pages/ContactUsBoxed'));
const ContactUsCover = lazy(() => import('../pages/Pages/ContactUsCover'));
const Faq = lazy(() => import('../pages/Pages/Faq'));
const ComingSoonBoxed = lazy(() => import('../pages/Pages/ComingSoonBoxed'));
const ComingSoonCover = lazy(() => import('../pages/Pages/ComingSoonCover'));
const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));
const Maintenence = lazy(() => import('../pages/Pages/Maintenence'));
const About = lazy(() => import('../pages/About'));
const Error = lazy(() => import('../components/Error'));
import AllCustomers from '../pages/Admin/AllCustomers';


const routes = [
    // dashboard
    {
        path: '/',
        element: (
            <AdminProtected>
                <AdminDashboard />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/merchants',
        element: (
            <AdminProtected>
                <Merchants />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/merchants/:id',
        element: (
            <AdminProtected>
                <MerchantData />
            </AdminProtected>
        )
    },
    {
        path: '/admin/merchants/create',
        element: (
            <AdminProtected>
                <CreateMerchant />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/merchants/edit',
        element: (
            <AdminProtected>
                <EditMerchant />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/merchant-approval',
        element: (
            <AdminProtected>
                <MerchantApproval />
            </AdminProtected>
        ),
    },
    //store management
    //all merchants
    {
        path: '/admin/merchants-store',
        element: (
            <AdminProtected>
                <Store />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/merchants-store/create-merchant',
        element: (
            <AdminProtected>
                <CreateMerchantInStore />
            </AdminProtected>
        ),
    },
    //create store
    {
        path: '/admin/merchants/:id/create-store',
        element: (
            <AdminProtected>
                <CreateStore />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/merchants-store/:id',
        element: (
            <AdminProtected>
                <StoreData />
            </AdminProtected>
        )
    },

    {
        path: '/admin/merchants-store/edit/:id',
        element: (
            <AdminProtected>
                <EditStore />
            </AdminProtected>
        )
    },
    {
        path: '/admin/merchant-store-group',
        element: (
            <AdminProtected>
                <StoreGroupListPage />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/edit-merchant-store-group/:id',
        element: (
            <AdminProtected>
                <EditStoreGroup />
            </AdminProtected>
        ),
    },
    // {
    //     path: '/admin/create-merchant-store-group',
    //     element: (
    //         <AdminProtected>
    //             <StoreGroupForm />
    //         </AdminProtected>
    //     ),
    // },
    {
        path: '/admin/merchant-affiliate',
        element: (
            <AdminProtected>
                <AffiliateListPage />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/edit-merchant-affiliate/:id',
        element: (
            <AdminProtected>
                <EditAffiliate />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/create-merchant-affiliate',
        element: (
            <AdminProtected>
                <AffiliateForm />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/merchant-account',
        element: (
            <AdminProtected>
                <AccountListPage />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/edit-merchant-account/:id',
        element: (
            <AdminProtected>
                <EditAccountForm />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/create-merchant-account',
        element: (
            <AdminProtected>
                <AccountForm />
            </AdminProtected>
        ),
    },

    {
        path: '/admin/orders',
        element: (
            <AdminProtected>
                <Orders />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/customers',
        element: (
            <AdminProtected>
                <AllCustomers />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/reports',
        element: (
            <AdminProtected>
                <Reports />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/settings',
        element: (
            <AdminProtected>
                <Settings />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/loans',
        element: (
            <AdminProtected>
                <Loans />
            </AdminProtected>
        ),
    },
    {
        path: '/admin/loans/:id',
        element: (
            <AdminProtected>
                <Offers />
            </AdminProtected>
        ),
    },
    // {
    //     path: '/admin/loans/offers/:id',
    //     element: (
    //         <AdminProtected>
    //             <Loans />
    //         </AdminProtected>
    //     ),
    // },

    // pages
    {
        path: '/pages/knowledge-base',
        element: <KnowledgeBase />,
    },
    {
        path: '/pages/contact-us-boxed',
        element: <ContactUsBoxed />,
        layout: 'blank',
    },
    {
        path: '/pages/contact-us-cover',
        element: <ContactUsCover />,
        layout: 'blank',
    },
    {
        path: '/pages/faq',
        element: <Faq />,
    },
    {
        path: '/pages/coming-soon-boxed',
        element: <ComingSoonBoxed />,
        layout: 'blank',
    },
    {
        path: '/pages/coming-soon-cover',
        element: <ComingSoonCover />,
        layout: 'blank',
    },
    {
        path: '/pages/error404',
        element: <ERROR404 />,
        layout: 'blank',
    },
    {
        path: '/pages/error500',
        element: <ERROR500 />,
        layout: 'blank',
    },
    {
        path: '/pages/error503',
        element: <ERROR503 />,
        layout: 'blank',
    },
    {
        path: '/pages/maintenence',
        element: <Maintenence />,
        layout: 'blank',
    },
    {
        path: '/login',
        element: <Login />,
        layout: 'blank',
    },
    {
        path: '/otp-verification',
        element: (
            <ProtectedRoute>
                <OtpVerification />
            </ProtectedRoute>
        ),
        layout: 'blank',
    },

    {
        path: '/about',
        element: <About />,
        layout: 'blank',
    },
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
