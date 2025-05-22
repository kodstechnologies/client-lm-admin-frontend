import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextInput, Textarea, Button, Switch } from '@mantine/core';
import { getAffiliateById, updateAffiliate } from '../../../api'; // ✅ Import the necessary API methods

type AffiliateFormType = {
    Name: string;
    Phone: string;
    Email: string;
    Description: string;
    IsActive: boolean
};

const EditAffiliate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [affiliate, setAffiliate] = useState<AffiliateFormType>({
        Name: '',
        Phone: '',
        Email: '',
        Description: '',
        IsActive: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAffiliate = async () => {
            try {
                const response = await getAffiliateById(id!); // Fetch the existing affiliate by ID
                setAffiliate(response); // Populate the form fields
            } catch (err) {
                console.error('Failed to fetch affiliate:', err);
            } finally {
                setLoading(false); // Stop loading after data is fetched
            }
        };

        if (id) fetchAffiliate(); // If ID exists, fetch affiliate data
    }, [id]);

    const handleChange = (field: keyof AffiliateFormType, value: string|boolean) => {
        setAffiliate((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateAffiliate(id!, affiliate);
            console.log('affiliate updated');
            setAffiliate({
                Name: '',
                Phone: '',
                Email: '',
                Description: '',
                IsActive: true
            });
            // Use the update API to update the affiliate
            console.log('Affiliate updated successfully');
        } catch (error: any) {
            console.error('Error updating affiliate:', error.message);
        }
    };

    if (loading) return <div>Loading...</div>; // Display a loading state if data is still being fetched

    return (
        <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Edit Affiliate</h2>
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
            <div className="flex justify-center mt-6">
                <Button type="submit">Update</Button>
            </div>
        </form>
    );
};

export default EditAffiliate;
