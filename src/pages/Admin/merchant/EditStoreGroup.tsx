import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextInput, Textarea, Button } from '@mantine/core';
import { getDataStoreById, updateStoreGroup } from '../../../api';

type StoreGroupFormType = {
    Name: string;
    Phone: string;
    Email: string;
    Description: string;
};

const EditStoreGroup: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [storeGroup, setStoreGroup] = useState<StoreGroupFormType>({
        Name: '',
        Phone: '',
        Email: '',
        Description: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreGroup = async () => {
            try {
                const res = await getDataStoreById(id!);
                setStoreGroup(res);
            } catch (err) {
                console.error('Failed to fetch store group:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStoreGroup();
    }, [id]);

    const handleChange = (field: keyof StoreGroupFormType, value: string) => {
        setStoreGroup((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateStoreGroup(id!, storeGroup);
            // console.log('Store group updated');

            //  Clear the form
            setStoreGroup({
                Name: '',
                Phone: '',
                Email: '',
                Description: '',
            });

        
        } catch (err: any) {
            console.error('Error updating store group:', err.message);
        }
    };


    if (loading) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-2">Edit Store Group</h2>
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
            <div className="flex justify-center mt-6">
                <Button type="submit">Update</Button>
            </div>
        </form>
    );
};

export default EditStoreGroup;
