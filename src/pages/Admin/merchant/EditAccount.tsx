import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextInput, Textarea, Button, Switch } from '@mantine/core';
import { getAccountById, updateAccount } from '../../../api'; 

type AccountFormType = {
    AccountName: string;
    AccountNumber: string;
    IFSCCode: string;
    Description: string;
    IsActive: boolean

};

const EditAccountForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [account, setAccount] = useState<AccountFormType>({
        AccountName: '',
        AccountNumber: '',
        IFSCCode: '',
        Description: '',
        IsActive: true

    });
    const [loading, setLoading] = useState(true);

    // Fetch the existing account data based on the account ID from the URL
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await getAccountById(id!); // Fetch account data by ID
                setAccount(response); // Populate form fields with fetched data
            } catch (err) {
                console.error('Failed to fetch account:', err);
            } finally {
                setLoading(false); // Stop loading after data is fetched
            }
        };

        if (id) fetchAccount(); // If the ID exists, fetch the account data
    }, [id]);

    const handleChange = (field: keyof AccountFormType, value: string|boolean) => {
        setAccount((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateAccount(id!, account); // Update the account data using the update API
            console.log('Account updated successfully');
            navigate('/admin/merchant-account'); // Redirect to the account list page after successful update
        } catch (error: any) {
            console.error('Error updating account:', error.message);
        }
    };

    if (loading) return <div>Loading...</div>; // Display loading state if data is still being fetched

    return (
        <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Edit Account</h2>
            <TextInput
                label="Account Name"
                value={account.AccountName}
                required
                onChange={(e) => handleChange('AccountName', e.target.value)}
            />

            <TextInput
                label="Account Number"
                type="number"
                value={account.AccountNumber}
                required
                onChange={(e) => handleChange('AccountNumber', e.target.value)}
            />

            <TextInput
                label="IFSC Code"
                value={account.IFSCCode}
                required
                onChange={(e) => handleChange('IFSCCode', e.target.value)}
            />

            <Textarea
                label="Description"
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
                <Button type="submit">Update</Button>
            </div>
        </form>
    );
};

export default EditAccountForm;
