import axios from 'axios';

const VITE_BACKEND_LOCALHOST_API_URL = import.meta.env.VITE_BACKEND_API_URL;
const api = axios.create({
    baseURL: VITE_BACKEND_LOCALHOST_API_URL,
    headers: {
        "Content-Type": "application/json",

    }
});


export const emailVerify = async (payload: any) => {
    try {
        const response = await api.post('/email-verification', payload)
        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred", };
    }

}
export const resendOtp = async (payload: any) => {
    try {
        const response = await api.post('/resend-otp', payload)
        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred", };
    }
}
export const verifyOtp = async (payload: any) => {
    try {
        const response = await api.post('/otp-verification', payload);
        const token = response.data.token; //  get token
        // console.log("Received token:", token);
        localStorage.setItem("authToken", response.data.token);

        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred", };
    }
}

//1.LOANS
//fetch all details
export const getAllDetails = async (search = '') => {
    try {
        const token = localStorage.getItem("authToken");

        const response = await api.get(`/all-details?search=${encodeURIComponent(search)}`, {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Add this
            }
        })
            ;
        return response.data; // Return the actual data to the caller
    } catch (error) {
        console.error("Error fetching all details:", error);
        throw error;
    }
};
//all offers
export const getAllOffers = async (leadId: string) => {
    try {
        const response = await api.get(`/all-offers/${leadId}`);
        return response.data; // Return the actual data to the caller
    } catch (error) {
        console.error("Error fetching all details:", error);
        throw error; // Re-throw so the calling component can handle it
    }
}
//get summary in Loans section
export const getSummary = async (leadId: string) => {
    try {
        const response = await api.get(`/get-summary/${leadId}`)
        // console.log("🚀 ~ getSummary ~ response:", response)
        return response
    } catch (error) {
        console.error("Error fetching summary:", error);
        throw error; // Re-throw so the calling component can handle it
    }
}
//filter by date range
export const fetchFilteredLoanData = async (from: any, to: any, type: any = 'created') => {
    try {
        const response = await api.get(`/get-filtered-data`, {
            params: {
                from,
                to,
                type,
            },
        });
        return response.data;

    } catch (error) {
        console.error("Error ", error);
        throw error;
    }
}
//filter by loan type
export const fetchFilteredLoanDataByType = async (loanType: string) => {
    try {
        if (!loanType) {
            throw new Error('Loan type is required (either "personal" or "business").');
        }

        const response = await api.get('/get-filtered-loans', {
            params: {
                loanType,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching filtered loan data by type:', error);
        throw error;
    }
};

//create account
export const createAccount = async (payload: any, token: string | null) => {
    try {
        const response = await api.post('/create-account', payload, {

            headers: {
                'Authorization': `Bearer ${token}`, // Add this
            }
        }); // adjust URL if needed
        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Server responded with status code outside 2xx
            throw new Error(error.response.data.message || 'Failed to create account');
        } else if (error.request) {
            // Request was made but no response
            throw new Error('No response from server');
        } else {
            // Something else went wrong
            throw new Error('Error: ' + error.message);
        }
    }
};

//create affiliate
export const createAffiliate = async (payload: any, token: string | null) => {
    try {
        const res = await api.post('/create-affiliate', payload, {

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Add this
            }
        }

        );
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Affiliate creation failed');
    }
};

//create group
export const createStoreGroup = async (payload: any) => {
    try {
        const res = await api.post('/create-store', payload);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Store group creation failed');
    }
};



//2.STORE MANAGEMENT
//create store by merchantid|| store by chain store
export const createStoreByMerchantId = async (merchantId: string, payload: FormData, token: string | null) => {
    try {
        // console.log("🚀 ~ createStoreByMerchantId ~ token:", token)

        const res = await api.post(`/merchants/${merchantId}/create-store`, payload, {

            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`, // Add this
            }
        });
        // console.log("🚀 ~ createStoreByMerchantId ~ token:", token)

        // console.log("🚀 ~ createStoreByMerchantId ~ res:", res);

        return res.data;
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);

        // Re-throw structured error to the form/page
        throw {
            status: error.response?.status,
            message: error.response?.data?.message || 'Something went wrong',
            field: error.response?.data?.field || null,
        };
    }
};
//by chain store

export const fetchStoresByMerchantId = async (merchantId: string) => {
    try {
        const response = await api.get(`/get-stores-by-merchant/${merchantId}`);
        // console.log("🚀 ~ fetchStoresByMerchantId ~ response.data:", response.data)
        return response.data;
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

export const fetchAllStores = async () => {
    try {
        const res = await api.get('/get-all-stores')
        return res.data
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}

//create chain store
export const createMerchantApi = async (payload: any, token: string | null) => {
    // console.log("🚀 ~ createMerchantApi ~ token:", token)
    try {
        const res = await api.post('/create-merchant', payload, {

            headers: {
                'Authorization': `Bearer ${token}`, // Add this
            }
        });
        return res.data;
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);

        // Re-throw structured error to the form/page
        throw {
            status: error.response?.status,
            message: error.response?.data?.message || 'Something went wrong',
            field: error.response?.data?.field || null,
        };
    }
};
//fetch all chain stores
export const fetchAllMerchants = async () => {
    try {
        const res = await api.get('/get-all-merchants')
        return res.data

    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}

export const fetchAllAffiliates = async () => {
    try {
        const res = await api.get('/all-affiliates')
        return res
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}
export const fetchAllAccounts = async () => {
    try {
        const res = await api.get('/all-accounts')
        return res
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}
export const fetchAllADataStores = async () => {
    try {
        const res = await api.get('/all-datatstores')
        return res
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}


export const fetchStoreById = async (storeId: string) => {
    try {
        const response = await api.get(`/get-store-by-id/${storeId}`);
        return response.data; // Return store data from the response
    } catch (error) {
        console.error('Error fetching store:', error);
        throw error;
    }
};

export interface StoreData {
    Name?: string;
    Address?: string;
    Phone?: string;
    Email?: string;
    [key: string]: any; // fallback for dynamic keys

    gstCertificate?: File;
    shopPhoto?: File;
    chequePhoto?: File;
}

export const updateStoreById = async (
    storeId: string,
    storeData: StoreData,
    token: string | null
): Promise<any> => {
    try {
        const formData = new FormData();

        // Append all fields except file types first
        for (const key in storeData) {
            if (
                key !== 'gstCertificate' &&
                key !== 'shopPhoto' &&
                key !== 'chequePhoto' &&
                storeData[key] !== undefined
            ) {
                formData.append(key, storeData[key]);
            }
        }

        // Append files if they exist
        if (storeData.gstCertificate instanceof File) {
            formData.append('gstCertificate', storeData.gstCertificate);
        }

        if (storeData.shopPhoto instanceof File) {
            formData.append('shopPhoto', storeData.shopPhoto);
        }

        if (storeData.chequePhoto instanceof File) {
            formData.append('chequePhoto', storeData.chequePhoto);
        }

        const response = await api.put(`/stores/${storeId}`, formData, {

            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`, // Add this
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('Error updating store:', error);
        throw error;
    }
};


//remove both
export const updateStoreGroup = async (id: any, data: any) => {
    try {
        const response = await api.put(`/edit-store-groups/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : new Error('Something went wrong');
    }
};

export const getDataStoreById = async (id: string) => {
    try {
        const response = await api.get(`/get-data-store-by-id/${id}`);
        // console.log("🚀 ~ getDataStoreById ~ response.data:", response.data)
        return response.data;
    } catch (error: any) {
        console.error('Error fetching store group by ID:', error.response?.data || error.message);
        throw error;
    }
}

export const getAffiliateById = async (id: string) => {
    try {
        const response = await api.get(`/get-affiliate-by-id/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching affiliate by ID:', error.response?.data || error.message);
        throw error;
    }
};

export const getAccountById = async (id: string) => {
    try {
        const response = await api.get(`/get-account-by-id/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching account by ID:', error.response?.data || error.message);
        throw error;
    }
};


export const updateAffiliate = async (id: string, affiliateData: any, token: string | null) => {
    try {
        const response = await api.put(`/edit-affiliates/${id}`, affiliateData, {

            headers: {
                'Authorization': `Bearer ${token}`, // Add this
            }
        });
        // console.log("🚀 ~ updateAffiliate ~ token:", token)

        return response.data;
    } catch (error: any) {
        console.error('Error updating affiliate:', error.response?.data || error.message);
        throw error;
    }
};
export const updateAccount = async (id: string, accountData: any, token: string | null) => {
    try {
        const response = await api.put(`/edit-accounts/${id}`, accountData, {

            headers: {
                'Authorization': `Bearer ${token}`, // Add this
            }
        });
        // console.log("🚀 ~ updateAccount ~ token:", token)
        return response.data;
    } catch (error: any) {
        console.error('Error updating account:', error.response?.data || error.message);
        throw error;
    }
};


export const uploadStore = async (formData: FormData, merchantId: string, token: string | null) => {
    const response = await api.post(`/upload-store/${merchantId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
// export const uploadStore = async (formData: FormData, merchantId: string) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//         const response = await api.post(`/upload-store/${merchantId}`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data;
//     } catch (error: any) {
//         console.error('Upload failed:', error);
//         throw error;
//     }
// };

export const getAllOrders = async () => {
    try {
        const res = await api.get('/all-orders')
        return res.data;
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}

export const searchOrdersByPhoneNumber = async (phoneNumber: any) => {
    try {
        const res = await api.get('/search-orders-by-phone-number', {
            params: { number: phoneNumber }
        },)
        return res.data;
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}

export const getAllCustomers = async () => {
    try {
        const res = await api.get('/all-customers')
        // console.log("🚀 ~ getAllCustomers ~ res:", res)
        return res.data
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}
export const searchCustomersByPhoneNumber = async (phoneNumber: any) => {
    try {
        const res = await api.get('/search-customers-by-phone', {
            params: { mobileNumber: phoneNumber }
        });
        return res;
    } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
}
export const updateOrderById = async (orderId: string) => {
    try {
        // console.log("🚀 ~ updateOrderById ~ token:", token);

        const res = await api.put(
            `/update-order-by-id/${orderId}`,
            { status: "Completed" },

        );

        return res;
    } catch (error) {
        console.error("error:", error);
        throw error;
    }
};