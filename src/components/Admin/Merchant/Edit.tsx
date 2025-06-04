import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { Button, FileInput, Textarea, TextInput } from '@mantine/core';

const EditMerchant = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });
    const [formData, setFormData] = useState({
        merchantName: '',
        storeName: '',
        email: '',
        mobileNumber: '',
        pinCode: '',
        gstin: '',
        shopAddress: '',
        accountNumber: '',
        ifscCode: '',
        gstCertificate: null,
        shopPhoto: null,
        chequePhoto: null,
        captcha: '',
    });

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(formData);
    };
    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to="/admin/merchants" className="text-primary hover:underline">
                        Merchant
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Edit</span>
                </li>
            </ul>

            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Side */}
                    <div className="panel p-6">
                        <div className="space-y-4">
                            <TextInput label="Merchant Name" required onChange={(e) => handleChange('merchantName', e.target.value)} />
                            <TextInput label="Store Name (as per GSTIN)" required onChange={(e) => handleChange('storeName', e.target.value)} />
                            <TextInput label="Email ID" type="email" required onChange={(e) => handleChange('email', e.target.value)} />
                            <TextInput label="Mobile Number" type="tel" required onChange={(e) => handleChange('mobileNumber', e.target.value)} />
                            <TextInput label="Pin Code" type="number" required onChange={(e) => handleChange('pinCode', e.target.value)} />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="panel p-6">
                        <div className="space-y-4">
                            <TextInput label="GSTIN" required onChange={(e) => handleChange('gstin', e.target.value)} />
                            <Textarea label="Shop Address" required onChange={(e) => handleChange('shopAddress', e.target.value)} />
                            <TextInput label="Account Number" type="number" required onChange={(e) => handleChange('accountNumber', e.target.value)} />
                            <TextInput label="IFSC Code" required onChange={(e) => handleChange('ifscCode', e.target.value)} />
                        </div>
                    </div>

                    {/* Full-Width Inputs */}
                    <div className="col-span-1 lg:col-span-2 panel p-6 space-y-4">
                        <FileInput label="Upload GST Certificate" required accept=".pdf,.jpg,.png" onChange={(file) => handleChange('gstCertificate', file)} />
                        <FileInput label="Upload Shop Photo" required accept=".jpg,.png" onChange={(file) => handleChange('shopPhoto', file)} />
                        <FileInput label="Upload Cancelled Cheque" required accept=".jpg,.png" onChange={(file) => handleChange('chequePhoto', file)} />
                        <TextInput label="Captcha" required onChange={(e) => handleChange('captcha', e.target.value)} />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </>
    );
};

export default EditMerchant;
