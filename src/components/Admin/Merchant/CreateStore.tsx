import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { showMessage } from '../../common/ShowMessage';


import {
  Button,
  Switch,
  Select,
  TextInput,
  FileInput
} from '@mantine/core';
import {
  // createChainStore,
  fetchAllADataStores,
  fetchAllAffiliates,
  fetchAllAccounts,
  createStoreByMerchantId,
  fetchAllMerchants

} from '../../../api';
import { FaSpinner } from 'react-icons/fa';

const CreateStore = () => {
  const dispatch = useDispatch();
  const { id: merchantId } = useParams();
  // console.log("🚀 ~ CreateStore ~ merchantId:", merchantId)
  useEffect(() => {
    dispatch(setPageTitle('Create Store'));
  }, [dispatch]);

  type StoreFormData = {
    Name: string;
    Address: string;
    Phone: string;
    Email: string;
    State: string;
    GSTIN: string;
    GroupId: string;
    AffiliateId: string;
    AccountId: string;
    IsActive: boolean;
    pinCode: string;
    ifscCode: string;
    accountNumber: string;
    gstCertificate: File | null;
    shopPhoto: File | null;
    chequePhoto: File | null;
  };

  const [formData, setFormData] = useState<StoreFormData>({
    Name: '',
    Address: '',
    Phone: '',
    Email: '',
    State: '',
    GSTIN: '',
    GroupId: merchantId!,
    AffiliateId: '',
    AccountId: '',
    IsActive: true,
    accountNumber: '',
    ifscCode: '',
    pinCode: '',
    gstCertificate: null,
    shopPhoto: null,
    chequePhoto: null
  });

  const [groupOptions, setGroupOptions] = useState<{ _id: string; GroupId: string }[]>([]);
  const [affiliateOptions, setAffiliateOptions] = useState<{ _id: string; AffiliateId: string, Name: string }[]>([]);
  const [accountOptions, setAccountOptions] = useState<{ _id: string; AccountId: string, AccountName: string }[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [merchantOptions, setMerchantOptions] = useState<{ _id: string; }[]>([]); // new state
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState<{ Phone?: string }>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()



  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const merchantRes = await fetchAllMerchants();
        // console.log("🚀 ~ fetchDropdownOptions ~ merchantRes:", merchantRes);
        const merchants = merchantRes.merchants;
        // console.log("🚀 ~ fetchDropdownOptions ~ merchants:", merchants);

        const affiliateRes = await fetchAllAffiliates();
        // console.log("🚀 ~ fetchDropdownOptions ~ affiliateRes:", affiliateRes);

        const accountRes = await fetchAllAccounts();
        // console.log("🚀 ~ fetchDropdownOptions ~ accountRes:", accountRes);

        setMerchantOptions(merchants);

        // Filter only IsActive === true
        const activeAffiliates = affiliateRes.data.data.filter((affiliate: { IsActive: boolean }) => affiliate.IsActive);
        const activeAccounts = accountRes.data.data.filter((account: { IsActive: boolean }) => account.IsActive);
        // console.log("🚀 ~ fetchDropdownOptions ~ activeAffiliates:", activeAffiliates)

        setAffiliateOptions(activeAffiliates);
        setAccountOptions(activeAccounts);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchDropdownOptions();
  }, []);


  const handleChange = (key: string, value: any) => {
    switch (key) {
      case 'Phone':
        // Allow only digits and max 10
        if (!/^\d*$/.test(value) || value.length > 10) return;
        break;

      case 'pinCode':
        // Allow only digits and max 6
        if (!/^\d*$/.test(value) || value.length > 6) return;
        break;

      case 'accountNumber':
        // Allow only digits
        if (!/^\d*$/.test(value)) return;
        break;

      case 'State':
        // Allow only letters and spaces
        if (!/^[A-Za-z\s]*$/.test(value)) return;
        break;

      case 'GSTIN':
        // Allow only uppercase alphanumeric and max 15 chars
        if (!/^[0-9A-Z]*$/.test(value) || value.length > 15) return;
        break;

      case 'ifscCode':
        // Allow uppercase alphanumeric and max 11 chars
        if (!/^[A-Z0-9]*$/i.test(value) || value.length > 11) return;
        break;

      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBlur = (key: string) => {
    if (key === 'Phone') {
      const value = formData.Phone;
      if (value.length < 10) {
        setErrors((prev) => ({
          ...prev,
          Phone: 'Phone number must be exactly 10 digits',
        }));
      } else {
        setErrors((prev) => ({ ...prev, Phone: undefined }));
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const submissionData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          if (typeof value === 'boolean') {
            submissionData.append(key, value.toString());
          } else {
            submissionData.append(key, value as any);
          }
        }
      });

      if (typeof merchantId !== 'string') {
        console.error('Invalid merchant ID');
        return;
      }
      const token = localStorage.getItem("authToken");

      const res = await createStoreByMerchantId(merchantId, submissionData, token);
      // console.log('Store created successfully:', res);

      // Show success message
      showMessage('store created successfully')
      navigate(`/admin/merchants-store/${merchantId}`)

      successMessage && (
        <div className="text-green-600 text-center font-semibold my-4">
          {successMessage}
        </div>
      )
      // Clear form
      setFormData({
        Name: '',
        Address: '',
        Phone: '',
        Email: '',
        State: '',
        GSTIN: '',
        GroupId: '',
        AffiliateId: '',
        AccountId: '',
        IsActive: true,
        accountNumber: '',
        ifscCode: '',
        pinCode: '',
        gstCertificate: null,
        shopPhoto: null,
        chequePhoto: null,
      });

      //  Hide message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error: any) {
      if (error.status === 409) {
        setErrorMsg(error.message);// "Phone '9876543345' already exists."
      }
      // else {
      //   setErrorMsg('An unexpected error occurred');
      // }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (loading) if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-600" />
      </div>
    );
  } <div>  <FaSpinner /></div>;
  return (
    <>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/" className="text-primary hover:underline">Dashboard</Link>
        </li>
        {/* <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <Link to={`/admin/merchants-store/${merchantId}`} className="text-primary hover:underline">
            Stores
          </Link>
        </li> */}
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Create</span>
        </li>
      </ul>
      {errorMsg && <p className="text-red-500 mb-2 text-center">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 panel p-6">

          <TextInput label="Store Name" placeholder='Enter store name ' required value={formData.Name} onChange={(e) => handleChange('Name', e.target.value)} />
          <TextInput
            label="Phone"
            placeholder="Enter phone number"
            type="text"
            required
            value={formData.Phone}
            onChange={(e) => handleChange('Phone', e.target.value)}
            onBlur={() => handleBlur('Phone')}
            error={errors.Phone}
          />

          <TextInput label="Email" placeholder='Enter email' required type="email" value={formData.Email} onChange={(e) => handleChange('Email', e.target.value)} />
          <TextInput label="State" placeholder='Enter state' required value={formData.State} onChange={(e) => handleChange('State', e.target.value)} />
          <TextInput label="Address" placeholder='Enter store address' required value={formData.Address} onChange={(e) => handleChange('Address', e.target.value)} />
          <TextInput label="Pin Code" placeholder='Enter pincode' type="text" value={formData.pinCode} onChange={(e) => handleChange('pinCode', e.target.value)} />
          <TextInput label="GSTIN" placeholder='Enter GSTIN ' required value={formData.GSTIN} onChange={(e) => handleChange('GSTIN', e.target.value.toUpperCase())} />
          {/* <Select
            label="Merchant (GRID)"
            placeholder="Select merchant"
            required
            value={merchantId}
            onChange={(value) => handleChange('GroupId', value!)}
            data={merchantOptions.map((merchant) => ({
              value: merchant._id,
              label: `GRID_${merchant._id}`,
            }))}
          /> */}
          <Select
            label="Affiliate"
            placeholder="Select affiliate"
            required
            value={formData.AffiliateId}
            onChange={(value) => handleChange('AffiliateId', value!)}
            data={affiliateOptions.map((affiliate) => ({
              value: affiliate._id,
              label: affiliate.Name // ✅ uses name now
            }))}
          />

          <Select
            label="Account"
            placeholder="Select account"
            required
            value={formData.AccountId}
            onChange={(value) => handleChange('AccountId', value!)}
            data={accountOptions.map((account) => ({
              value: account._id,
              label: account.AccountName // ✅ uses account name now
            }))}
          />

          {/* <TextInput label="Account Number" type="text" value={formData.accountNumber} onChange={(e) => handleChange('accountNumber', e.target.value)} />
          <TextInput label="IFSC Code" value={formData.ifscCode} onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())} /> */}



          {/*  File Uploads */}
          <FileInput
            label="Upload GST Certificate"
            description="Choose GST certificate file (PDF, JPG, PNG)"
            accept=".pdf,.jpg,.png"
            onChange={(file) => handleChange('gstCertificate', file)}
          />

          <FileInput
            label="Upload Shop Photo"
            description="Choose a shop photo (JPG, PNG)"
            accept=".jpg,.png"
            onChange={(file) => handleChange('shopPhoto', file)}
          />

          <FileInput
            label="Upload Cancelled Cheque"
            description="Choose cancelled cheque image (JPG, PNG)"
            accept=".jpg,.png"
            onChange={(file) => handleChange('chequePhoto', file)}
          />


          <div className="flex items-center mt-2">
            <Switch
              label="Active status"
              checked={formData.IsActive}
              onChange={(e) => {
                // console.log('Switch changed to:', e.currentTarget.checked);
                handleChange('IsActive', e.currentTarget.checked);
              }} color="green"

            />

          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? <FaSpinner size="sm" /> : "Submit"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CreateStore;
