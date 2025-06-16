import React, { useState } from 'react';
import { TextInput, Textarea, Button, Switch } from '@mantine/core';
import { createStoreGroup } from '../../../api'; 

type StoreGroupFormType = {
    Name: string;
    Phone: string;
    Email: string;
    Description: string;
    IsActive: boolean;

};

const StoreGroupForm: React.FC = () => {
    const [storeGroup, setStoreGroup] = useState<StoreGroupFormType>({
        Name: '',
        Phone: '',
        Email: '',
        Description: '',
        IsActive: true,

    });

    const handleChange = (field: keyof StoreGroupFormType, value: string|boolean) => {
        setStoreGroup((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await createStoreGroup(storeGroup);
            // console.log('Store Group Created:', response);
            // Clear the form after successful submission
            setStoreGroup({
                Name: '',
                Phone: '',
                Email: '',
                Description: '',
                IsActive: true,

            });
        } catch (error: any) {
            console.error('Error creating store group:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Store Group</h2>
            <TextInput
                label="Group Name"
                required
                value={storeGroup.Name}
                onChange={(e) => handleChange('Name', e.target.value)}
            />
            <TextInput
                label="Phone"
                required
                value={storeGroup.Phone}
                onChange={(e) => handleChange('Phone', e.target.value)}
            />
            <TextInput
                label="Email"
                type="email"
                required
                value={storeGroup.Email}
                onChange={(e) => handleChange('Email', e.target.value)}
            />
            <Textarea
                label="Description"
                value={storeGroup.Description}
                onChange={(e) => handleChange('Description', e.target.value)}
            />
            <div className="flex items-center mt-2">
                <Switch
                    label="Active Status"
                    checked={storeGroup.IsActive}
                    onChange={(e) => handleChange('IsActive', e.currentTarget.checked)}
                    color="green"
                />
            </div>
            <div className="flex justify-center mt-6">
                <Button type="submit">Submit</Button>
            </div>
        </form>
    );
};

export default StoreGroupForm;
