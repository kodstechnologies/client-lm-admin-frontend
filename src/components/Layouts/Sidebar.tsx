import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FiBook, FiBox, FiCreditCard, FiDollarSign, FiFileText, FiGift, FiGrid, FiPlusSquare, FiSettings, FiShoppingBag, FiShoppingCart, FiSquare, FiUser, FiUsers, FiVideo } from 'react-icons/fi';
import { FaStore } from 'react-icons/fa';



import Logo from '../../assets/logo/LittleLogo_01.png';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0 justify-center">
                            <img className="w-28 ml-[5px] flex-none" src={Logo} alt="logo" />
                            {/* <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('Little Money')}</span> */}
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            <li className="nav-item">
                                <ul>
                                    <li className="nav-item">
                                        <NavLink to="/" className="group">
                                            <div className="flex items-center gap-2">
                                                <FiGrid className="group-hover:!text-primary shrink-0" />
                                                <span>{t('Dashboard')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    {/* Merchant Management */}
                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'merchants' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('merchants')}>
                                            <div className="flex items-center gap-2">
                                                <FiUsers className="text-xl" />
                                                <span>{t('Merchant Management')}</span>
                                            </div>
                                            <div className={currentMenu !== 'merchants' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'merchants' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <NavLink to="/admin/merchants">{t('All Merchants')}</NavLink>
                                                </li>

                                                {/* <li>
                                                    <NavLink to="/admin/merchant-approval">{t('Approval Requests')}</NavLink>
                                                </li> */}


                                            </ul>
                                        </AnimateHeight>
                                    </li>

                                    {/* store management */}
                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'store' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('store')}>
                                            <div className="flex items-center gap-2">
                                                <FaStore className="text-xl" />
                                                <span>{t('Store Management')}</span>
                                            </div>
                                            <div className={currentMenu !== 'store' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'store' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <NavLink to="/admin/merchants-store">{t('Store Group')}</NavLink>
                                                </li>

                                                {/* <li>
                                                    <NavLink to="/admin/merchant-approval">{t('Approval Requests')}</NavLink>
                                                </li> */}

                                                {/* <li>
                                                    <NavLink to="/admin/merchant-store-group">{t('Store Group')}</NavLink>
                                                </li> */}
                                                <li>
                                                    <NavLink to="/admin/merchant-affiliate">{t('Affiliate')}</NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to="/admin/merchant-account">{t('Account')}</NavLink>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/admin/loans" className="group">
                                            <div className="flex items-center gap-2">
                                                {/* <FiSettings className="group-hover:!text-primary shrink-0" /> */}
                                                <RiMoneyRupeeCircleLine className="group-hover:!text-primary shrink-0" />

                                                <span>{t('Loans')}</span>
                                            </div>
                                        </NavLink>

                                    </li>
                                    {/* Orders & Compliance */}
                                    <li className="nav-item">
                                        <NavLink to="/admin/orders" className="group">
                                            <div className="flex items-center gap-2">
                                                <FiShoppingBag className="group-hover:!text-primary shrink-0" />
                                                <span>{t('Orders')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/admin/customers" className="group">
                                            <div className="flex items-center gap-2">
                                                <FiUser className="group-hover:!text-primary shrink-0" />
                                                <span>{t('Customers')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    {/* Reports & Logs */}
                                    <li className="nav-item">
                                        <NavLink to="/admin/reports" className="group">
                                            <div className="flex items-center gap-2">
                                                <FiFileText className="group-hover:!text-primary shrink-0" />
                                                <span>{t('Reports & Logs')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    {/* Settings */}
                                    <li className="nav-item">
                                        <NavLink to="/admin/settings" className="group">
                                            <div className="flex items-center gap-2">
                                                <FiSettings className="group-hover:!text-primary shrink-0" />
                                                <span>{t('Settings')}</span>
                                            </div>
                                        </NavLink>
                                    </li>

                                </ul>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
