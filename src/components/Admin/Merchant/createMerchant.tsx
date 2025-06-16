import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Button, TextInput, Switch } from '@mantine/core';
import { createMerchantApi } from '../../../api';
import { showMessage } from '../../common/ShowMessage';
import { FaSpinner } from 'react-icons/fa';

const createMerchant = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Create Merchant'));
    }, [dispatch]);

    type MerchantFormData = {
        Name: string;
        Address: string;
        Phone: string;
        Email: string;
        State: string;
        GSTIN: string;
        Description: string,
        // GroupId: string;
        // AffiliateId: string;
        // AccountId: string;
        IsActive: boolean;
    };

    const [formData, setFormData] = useState<MerchantFormData>({
        Name: '',
        Address: '',
        Phone: '',
        Email: '',
        State: '',
        GSTIN: '',
        Description: '',
        // GroupId: '',
        // AffiliateId: '',
        // AccountId: '',
        IsActive: true,
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const handleChange = (field: keyof MerchantFormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const token = localStorage.getItem("authToken");

            const res = await createMerchantApi(formData, token); // Your POST API call
            console.log('Merchant created:', res);
            setFormData({
                Name: '',
                Address: '',
                Phone: '',
                Email: '',
                State: '',
                GSTIN: '',
                Description: '',
                // GroupId: '',
                // AffiliateId: '',
                // AccountId: '',
                IsActive: true,
            });
            showMessage('Merchant created successfully')
            setErrorMsg('');
            navigate("/admin/merchants-store")

        } catch (err: any) {
            if (err.status === 409) {
                setErrorMsg(err.message);// "Phone '9876543345' already exists."
            } else {
                setErrorMsg('An unexpected error occurred');
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-gray-600" />
            </div>
        );
    }
    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to="/admin/merchants-store" className="text-primary hover:underline">
                        Merchants
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Create</span>
                </li>
            </ul>
            {errorMsg && <p className="text-red-500 mb-2 text-center">{errorMsg}</p>}
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 panel p-6">
                    {/* <TextInput label="Merchant Name" required value={formData.Name} onChange={(e) => handleChange('Name', e.target.value)} /> */}
                    <TextInput
                        label="Store Group"
                        placeholder='Enter Store Group'
                        required
                        value={formData.Name}
                        onChange={(e) => handleChange('Name', e.target.value)}
                        onKeyPress={(e) => {
                            const regex = /^[A-Za-z\s]+$/;
                            if (!regex.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />

                    <TextInput label="Phone" placeholder='Enter phone number' required type="tel"
                        maxLength={10} value={formData.Phone} onChange={(e) => handleChange('Phone', e.target.value.replace(/\D/g, ''))} />
                    <TextInput label="Email" placeholder='Enter email' required type="email" value={formData.Email} onChange={(e) => handleChange('Email', e.target.value)} />
                    <TextInput
                        label="Description"
                        placeholder='Enter description'
                        required
                        type="text"
                        value={formData.Description}
                        onChange={(e) => handleChange('Description', e.target.value)}
                    />

                    {/* <TextInput label="State" required value={formData.State} onChange={(e) => handleChange('State', e.target.value)} /> */}
                    {/* <TextInput label="Address" required value={formData.Address} onChange={(e) => handleChange('Address', e.target.value)} /> */}
                    {/* <TextInput label="GSTIN" required value={formData.GSTIN} onChange={(e) => handleChange('GSTIN', e.target.value)} /> */}
                    {/* <TextInput label="Group ID" required value={formData.GroupId} onChange={(e) => handleChange('GroupId', e.target.value)} /> */}
                    {/* <TextInput label="Affiliate ID" required value={formData.AffiliateId} onChange={(e) => handleChange('AffiliateId', e.target.value)} /> */}
                    {/* <TextInput label="Account ID" required value={formData.AccountId} onChange={(e) => handleChange('AccountId', e.target.value)} /> */}
                    <div className="flex items-center mt-2">
                        <Switch
                            label="Active Status"
                            checked={formData.IsActive}
                            onChange={(e) => handleChange('IsActive', e.currentTarget.checked)}
                            color="green"
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <Button type="submit" disabled={loading}>
                        {loading ? <FaSpinner size="sm" /> : "Submit"}
                    </Button>

                </div>
            </form>
        </>
    );
};

export default createMerchant