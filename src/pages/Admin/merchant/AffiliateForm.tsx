import React, { useState } from 'react';
import { TextInput, Textarea, Button, Switch } from '@mantine/core';
import { createAffiliate } from '../../../api'; //  Import your API method
import { showMessage } from '../../../components/common/ShowMessage';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

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
    const [errors, setErrors] = useState({
        Name: '',
        Phone: '',
        Email: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: any) => {
        setAffiliate((prev) => ({ ...prev, [field]: value }));
        // Clear errors while user types
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validate = () => {
        const newErrors: any = {};
        if (!affiliate.Name.trim()) newErrors.Name = 'Name is required';
        if (!affiliate.Phone || affiliate.Phone.length !== 10)
            newErrors.Phone = 'Phone must be exactly 10 digits';
        if (!affiliate.Email) {
            newErrors.Email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(affiliate.Email)) {
            newErrors.Email = 'Enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;
        setLoading(true); // Start loading

        try {
            const token = localStorage.getItem("authToken");

            const response = await createAffiliate(affiliate, token);
            // console.log('Affiliate Created:', response);
            setAffiliate({
                Name: '',
                Phone: '',
                Email: '',
                Description: '',
                IsActive: true,

            });
            showMessage('Affiliate created successfully')
            navigate('/admin/merchant-affiliate')
        } catch (error: any) {
            console.error('Error creating affiliate:', error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-6">
            <div className=" md:grid-cols-2 gap-4 panel p-6">
                <h2 className="text-xl font-semibold mb-2">Affiliate</h2>

                <TextInput
                    label="Name"
                    required
                    value={affiliate.Name}
                    onChange={(e) => handleChange('Name', e.target.value)}
                    error={errors.Name}
                />

                <TextInput
                    label="Phone"
                    required
                    type="tel"
                    maxLength={10}
                    value={affiliate.Phone}
                    onChange={(e) =>
                        handleChange('Phone', e.target.value.replace(/\D/g, ''))
                    }
                    error={errors.Phone}
                />

                <TextInput
                    label="Email"
                    type="email"
                    required
                    value={affiliate.Email}
                    onChange={(e) => handleChange('Email', e.target.value)}
                    error={errors.Email}
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
                    <Button type="submit" disabled={loading}>
                        {loading ? <FaSpinner size="sm" /> : "Submit"}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AffiliateForm;
