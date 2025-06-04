import React, { useState } from 'react';
import { TextInput, Textarea, Button, Switch } from '@mantine/core';
import { createAccount } from '../../../api';
import { useNavigate } from 'react-router-dom';
import { showMessage } from '../../../components/common/ShowMessage';
import { FaSpinner } from 'react-icons/fa';

type AccountFormType = {
    AccountName: string;
    AccountNumber: string;
    IFSCCode: string;
    Description: string;
    IsActive: true,

};

const AccountForm: React.FC = () => {
    const [account, setAccount] = useState<AccountFormType>({
        AccountName: '',
        AccountNumber: '',
        IFSCCode: '',
        Description: '',
        IsActive: true,

    });

    const handleChange = (field: string, value: string | boolean) => {
        setAccount((prev) => ({ ...prev, [field]: value }));
    };
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const token = localStorage.getItem("authToken");

            const response = await createAccount(account, token);
            // console.log('Account Created:', response);
            setAccount({
                AccountName: '',
                AccountNumber: '',
                IFSCCode: '',
                Description: '',
                IsActive: true,

            });
            showMessage('Account created successfully')
            navigate('/admin/merchant-account')
        } catch (error: any) {
            console.error(error.message);
            // Optionally show error message
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-6">
            <div className=" md:grid-cols-2 gap-4 panel p-6">            <h2 className="text-xl font-semibold mb-2">Account</h2>
                <TextInput
                    label="Account Name"
                    className='mb-4'

                    value={account.AccountName}
                    required
                    onChange={(e) => handleChange('AccountName', e.target.value)}
                />

                <TextInput
                    label="Account Number"
                    type="number"
                    className='mb-4'

                    value={account.AccountNumber}
                    required
                    onChange={(e) => handleChange('AccountNumber', e.target.value)}
                />

                <TextInput
                    label="IFSC Code"
                    className='mb-4'

                    value={account.IFSCCode}
                    required
                    onChange={(e) => handleChange('IFSCCode', e.target.value)}
                />

                <Textarea
                    label="Description"
                    className='mb-4'

                    value={account.Description}
                    onChange={(e) => handleChange('Description', e.target.value)}
                />
                <div className="flex items-center mt-2">
                    <Switch
                        label="Active Status"
                        checked={account.IsActive}
                        onChange={(e) => handleChange('IsActive', e.currentTarget.checked)}
                        color="green"
                    />
                </div>
                <div className="flex justify-center mt-6">
                    <Button type="submit" disabled={loading}>
                        {loading ? <FaSpinner size="sm" /> : "Submit"}
                    </Button>                </div>
            </div>
        </form>
    );
};

export default AccountForm;