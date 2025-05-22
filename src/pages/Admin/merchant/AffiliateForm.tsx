import React, { useState } from 'react';
import { TextInput, Textarea, Button, Switch } from '@mantine/core';
import { createAffiliate } from '../../../api'; //  Import your API method

type AffiliateFormType = {
    Name: string;
    Phone: string;
    Email: string;
    Description: string;
    IsActive: true,

};

const AffiliateForm: React.FC = () => {
    const [affiliate, setAffiliate] = useState<AffiliateFormType>({
        Name: '',
        Phone: '',
        Email: '',
        Description: '',
        IsActive: true,

    });

    const handleChange = (field: keyof AffiliateFormType, value: string | boolean) => {
        setAffiliate((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");

            const response = await createAffiliate(affiliate, token);
            console.log('Affiliate Created:', response);
            setAffiliate({
                Name: '',
                Phone: '',
                Email: '',
                Description: '',
                IsActive: true,

            });
        } catch (error: any) {
            console.error('Error creating affiliate:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Affiliate</h2>
            <TextInput
                label="Name"
                required
                value={affiliate.Name}
                onChange={(e) => handleChange('Name', e.target.value)}
            />
            <TextInput
                label="Phone"
                required
                value={affiliate.Phone}
                onChange={(e) => handleChange('Phone', e.target.value)}
            />
            <TextInput
                label="Email"
                type="email"
                required
                value={affiliate.Email}
                onChange={(e) => handleChange('Email', e.target.value)}
            />
            <Textarea
                label="Description"
                value={affiliate.Description}
                onChange={(e) => handleChange('Description', e.target.value)}
            />
            <div className="flex items-center mt-2">
                <Switch
                    label="Active Status"
                    checked={affiliate.IsActive}
                    onChange={(e) => handleChange('IsActive', e.currentTarget.checked)}
                    color="green"
                />
            </div>
            {/* <div className="flex items-center mt-2">
                <Switch
                    label="Active status"
                    checked={formData.IsActive}
                    onChange={(e) => {
                        // console.log('Switch changed to:', e.currentTarget.checked);
                        handleChange('IsActive', e.currentTarget.checked);
                    }} color="green"

                />

            </div> */}
            <div className="flex justify-center mt-6">
                <Button type="submit">Submit</Button>
            </div>
        </form>
    );
};

export default AffiliateForm;
