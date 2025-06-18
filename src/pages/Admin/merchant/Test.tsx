import React, { useState } from 'react';
import { TextInput, Textarea, Button } from '@mantine/core';

type AccountFormType = {
    AccountName: string;
    AccountNumber: string;
    IFSCCode: string;
    Description: string;
};

type AffiliateFormType = {
    Name: string;
    Phone: string;
    EMail: string;
    Description: string;
};

type StoreGroupFormType = {
    Name: string;
    Phone: string;
    EMail: string;
    Description: string;
};

const Test: React.FC = () => {
    const [account, setAccount] = useState<AccountFormType>({
        AccountName: '',
        AccountNumber: '',
        IFSCCode: '',
        Description: '',
    });

    const [affiliate, setAffiliate] = useState<AffiliateFormType>({
        Name: '',
        Phone: '',
        EMail: '',
        Description: '',
    });

    const [storeGroup, setStoreGroup] = useState<StoreGroupFormType>({
        Name: '',
        Phone: '',
        EMail: '',
        Description: '',
    });

    const handleChange = <T,>(
        setter: React.Dispatch<React.SetStateAction<T>>,
        field: keyof T,
        value: string
    ) => {
        setter((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = <T,>(label: string, data: T) => {
        console.log(`${label} Submitted:`, data);
    };
//test push
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-10">
            {/* Account Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit('Account', account);
                }}
                className="panel p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold mb-2">Account</h2>
                <TextInput label="Account Name" required onChange={(e) => handleChange(setAccount, 'AccountName', e.target.value)} />
                <TextInput label="Account Number" type="number" required onChange={(e) => handleChange(setAccount, 'AccountNumber', e.target.value)} />
                <TextInput label="IFSC Code" required onChange={(e) => handleChange(setAccount, 'IFSCCode', e.target.value)} />
                <Textarea label="Description" onChange={(e) => handleChange(setAccount, 'Description', e.target.value)} />
                <Button type="submit" fullWidth>Submit Account</Button>
            </form>

            {/* Affiliate Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit('Affiliate', affiliate);
                }}
                className="panel p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold mb-2">Affiliate</h2>
                <TextInput label="Affiliate Name" required onChange={(e) => handleChange(setAffiliate, 'Name', e.target.value)} />
                <TextInput label="Phone" required onChange={(e) => handleChange(setAffiliate, 'Phone', e.target.value)} />
                <TextInput label="Email" type="email" required onChange={(e) => handleChange(setAffiliate, 'EMail', e.target.value)} />
                <Textarea label="Description" onChange={(e) => handleChange(setAffiliate, 'Description', e.target.value)} />
                <Button type="submit" fullWidth>Submit Affiliate</Button>
            </form>

            {/* StoreGroup Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit('StoreGroup', storeGroup);
                }}
                className="panel p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold mb-2">Store Group</h2>
                <TextInput label="Group Name" required onChange={(e) => handleChange(setStoreGroup, 'Name', e.target.value)} />
                <TextInput label="Phone" required onChange={(e) => handleChange(setStoreGroup, 'Phone', e.target.value)} />
                <TextInput label="Email" type="email" required onChange={(e) => handleChange(setStoreGroup, 'EMail', e.target.value)} />
                <Textarea label="Description" onChange={(e) => handleChange(setStoreGroup, 'Description', e.target.value)} />
                <Button type="submit" fullWidth>Submit Store Group</Button>
            </form>
        </div>
    )
}

export default Test;