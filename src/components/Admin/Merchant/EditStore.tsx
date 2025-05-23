"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useParams, useNavigate } from "react-router-dom"
import { setPageTitle } from "../../../store/themeConfigSlice"
import { Button, Switch, Select, TextInput, FileInput, Group, Text, ActionIcon, Box } from "@mantine/core"
import { IconInfoCircle, IconFile, IconPhoto } from "@tabler/icons-react"
import { fetchAllAffiliates, fetchAllAccounts, fetchStoreById, updateStoreById } from "../../../api"
import { showMessage } from "../../common/ShowMessage"
const VITE_BACKEND_LOCALHOST_API_URL = import.meta.env.VITE_BACKEND_API_URL

const EditStore = () => {
    const dispatch = useDispatch()
    const { id } = useParams() //capture store ID from route param
    console.log("🚀 ~ EditStore ~ storeId:", id)

    useEffect(() => {
        dispatch(setPageTitle("Edit Store"))
    }, [dispatch])

    type StoreFormData = {
        Name: string
        Address: string
        Phone: string
        Email: string
        State: string
        GSTIN: string
        GroupId: string
        AffiliateId: string
        AccountId: string
        IsActive: boolean
        pinCode: string
        // ifscCode: string
        // accountNumber: string
        gstCertificate: File | null
        shopPhoto: File | null
        chequePhoto: File | null
        gstCertificateUrl?: string | null
        shopPhotoUrl?: string | null
        chequePhotoUrl?: string | null
        // Track if files should be removed
        removeGstCertificate?: boolean
        removeShopPhoto?: boolean
        removeChequePhoto?: boolean
    }

    const [formData, setFormData] = useState<StoreFormData>({
        Name: "",
        Address: "",
        Phone: "",
        Email: "",
        State: "",
        GSTIN: "",
        GroupId: "",
        AffiliateId: "",
        AccountId: "",
        IsActive: true,
        // accountNumber: "",
        // ifscCode: "",
        pinCode: "",
        gstCertificate: null,
        gstCertificateUrl: "",
        shopPhoto: null,
        shopPhotoUrl: "",
        chequePhoto: null,
        chequePhotoUrl: "",
        removeGstCertificate: false,
        removeShopPhoto: false,
        removeChequePhoto: false,
    })

    const [groupOptions, setGroupOptions] = useState<{ _id: string; GroupId: string }[]>([])
    const [affiliateOptions, setAffiliateOptions] = useState<{ _id: string; AffiliateId: string }[]>([])
    const [accountOptions, setAccountOptions] = useState<{ _id: string; AccountId: string }[]>([])
    const navigate = useNavigate()

    // 👇 Fetch dropdown + existing store data
    useEffect(() => {
        if (id) {
            const fetchFileFromUrl = async (url, filename) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`Failed to fetch file from ${url}`);
                    const blob = await response.blob();
                    return new File([blob], filename, { type: blob.type });
                } catch (err) {
                    console.error(`Failed to fetch file from ${url}:`, err);
                    return null;
                }
            };

            const fetchData = async () => {
                try {
                    // Fetch store data
                    const storeRes = await fetchStoreById(id);
                    const store = storeRes.data?.data || storeRes;
                    console.log("Fetched store data:", store); // Debug store data

                    const baseUrl = `${VITE_BACKEND_LOCALHOST_API_URL.replace("/api", "")}/Uploads`;

                    // Create URLs for files
                    const gstUrl = store.gstCertificate ? `${baseUrl}/${store.gstCertificate}` : "";
                    const shopUrl = store.shopPhoto ? `${baseUrl}/${store.shopPhoto}` : "";
                    const chequeUrl = store.chequePhoto ? `${baseUrl}/${store.chequePhoto}` : "";

                    // Convert URLs to File objects
                    const gstFile = gstUrl ? await fetchFileFromUrl(gstUrl, store.gstCertificate) : null;
                    const shopFile = shopUrl ? await fetchFileFromUrl(shopUrl, store.shopPhoto) : null;
                    const chequeFile = chequeUrl ? await fetchFileFromUrl(chequeUrl, store.chequePhoto) : null;

                    // Set form data
                    setFormData({
                        Name: store.Name || "",
                        Address: store.Address || "",
                        Phone: store.Phone || "",
                        Email: store.Email || "",
                        State: store.State || "",
                        GSTIN: store.GSTIN || "",
                        GroupId: store.GroupId?._id || store.GroupId || "",
                        AffiliateId: store.AffiliateId?._id || store.AffiliateId || "",
                        AccountId: store.AccountId?._id || store.AccountId || "",
                        IsActive: store.IsActive ?? true,
                        pinCode: store.pinCode || "",
                        gstCertificate: gstFile,
                        shopPhoto: shopFile,
                        chequePhoto: chequeFile,
                        gstCertificateUrl: gstUrl,
                        shopPhotoUrl: shopUrl,
                        chequePhotoUrl: chequeUrl,
                        removeGstCertificate: false,
                        removeShopPhoto: false,
                        removeChequePhoto: false,
                    });

                    // Fetch dropdown options
                    const [affiliateRes, accountRes] = await Promise.all([fetchAllAffiliates(), fetchAllAccounts()]);
                    const affiliateData = affiliateRes?.data?.data || affiliateRes?.data || [];
                    const accountData = accountRes?.data?.data || accountRes?.data || [];

                    // Filter active affiliates and accounts
                    const activeAffiliates = Array.isArray(affiliateData)
                        ? affiliateData.filter((a) => a.IsActive === true)
                        : [];
                    const activeAccounts = Array.isArray(accountData)
                        ? accountData.filter((a) => a.IsActive === true)
                        : [];

                    console.log("Active affiliates:", activeAffiliates);
                    console.log("Active accounts:", activeAccounts);

                    setAffiliateOptions(activeAffiliates);
                    setAccountOptions(activeAccounts);

                    // Check if the store's AffiliateId and AccountId exist in options
                    if (!activeAffiliates.find((a) => a._id === (store.AffiliateId?._id || store.AffiliateId))) {
                        console.warn(`AffiliateId ${store.AffiliateId?._id || store.AffiliateId} not found in active affiliates`);
                    }
                    if (!activeAccounts.find((a) => a._id === (store.AccountId?._id || store.AccountId))) {
                        console.warn(`AccountId ${store.AccountId?._id || store.AccountId} not found in active accounts`);
                    }
                } catch (error) {
                    console.error("Error fetching store or dropdown data:", error);
                }
            };

            fetchData();
        }
    }, [id]);

    const handleChange = (field: keyof StoreFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Handle file removal
    const handleRemoveFile = (fileType: "gstCertificate" | "shopPhoto" | "chequePhoto") => {
        const removeField = `remove${fileType.charAt(0).toUpperCase() + fileType.slice(1)}` as keyof StoreFormData
        const urlField = `${fileType}Url` as keyof StoreFormData

        setFormData((prev) => ({
            ...prev,
            [fileType]: null,
            [removeField]: true,
            [urlField]: "",
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            // Prepare submission data with file removal flags
            const submissionData = {
                ...formData,
                // Only include files if they exist and aren't marked for removal
                gstCertificate: formData.removeGstCertificate ? undefined : formData.gstCertificate || undefined,
                shopPhoto: formData.removeShopPhoto ? undefined : formData.shopPhoto || undefined,
                chequePhoto: formData.removeChequePhoto ? undefined : formData.chequePhoto || undefined,
                // Include removal flags for backend processing
                removeGstCertificate: formData.removeGstCertificate,
                removeShopPhoto: formData.removeShopPhoto,
                removeChequePhoto: formData.removeChequePhoto,
            }
            const token = localStorage.getItem("authToken")

            const response = await updateStoreById(id!, submissionData, token)
            // console.log("✅ Store updated:", response)
            showMessage("Store updated sucessfully")
            // Navigate back after successful update
            navigate("/admin/merchants-store")
        } catch (error) {
            console.error(" Error updating store:", error)
        }
    }

    // Ensure current selection exists in groupOptions
    // Normalize GroupId
    const groupExists = groupOptions.find((g) => g._id === formData.GroupId)
    const normalizedGroupOptions = groupExists
        ? groupOptions
        : [...groupOptions, { _id: formData.GroupId, GroupId: "Unknown Group" }]

    // Replace the existing normalizedAffiliateOptions code with:

    // For affiliates - don't add "Unknown Affiliate" to the dropdown
    // Normalize AffiliateId and AccountId options
    // Normalize AffiliateId and AccountId options
    // Normalize AffiliateId and AccountId options
    const normalizedAffiliateOptions = affiliateOptions.some((a) => a._id === formData.AffiliateId)
        ? affiliateOptions // If AffiliateId exists, use original options
        : [
            ...affiliateOptions,
            ...(formData.AffiliateId
                ? [
                    {
                        _id: formData.AffiliateId,
                        AffiliateId: `AFID_${formData.AffiliateId}`, // Fallback label
                        IsActive: false, // Mark as inactive
                    },
                ]
                : []),
        ].filter(
            (v, i, a) => a.findIndex((t) => t._id === v._id) === i // Remove duplicates by _id
        );

    const normalizedAccountOptions = accountOptions.some((a) => a._id === formData.AccountId)
        ? accountOptions // If AccountId exists, use original options
        : [
            ...accountOptions,
            ...(formData.AccountId
                ? [
                    {
                        _id: formData.AccountId,
                        AccountId: `ACID_${formData.AccountId}`, // Fallback label
                        IsActive: false, // Mark as inactive
                    },
                ]
                : []),
        ].filter(
            (v, i, a) => a.findIndex((t) => t._id === v._id) === i // Remove duplicates by _id
        );
    console.log("Affiliate options:", affiliateOptions);
    console.log("Account options:", accountOptions);
    console.log("Normalized affiliate options:", normalizedAffiliateOptions);
    console.log("Normalized account options:", normalizedAccountOptions);
    type FilePreviewProps = {
        file: File | null
        url: string
        fileType?: string // optional
        label?: string // optional
    }
    // Custom file input value display component
    const FilePreview: React.FC<FilePreviewProps> = ({ file, url, fileType, label }) => {
        if (!file && !url) return null

        const fileName = file?.name || url.split("/").pop() || "File"
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)

        return (
            <Box className="border rounded p-3 mb-2 bg-gray-50">
                <Group position="apart">
                    <Group>
                        {isImage ? <IconPhoto size={20} /> : <IconFile size={20} />}
                        <Text size="sm" className="truncate max-w-[200px]">
                            {fileName}
                        </Text>
                    </Group>
                    <Group spacing={8}>
                        {url && (
                            <ActionIcon
                                component="a"
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="blue"
                                variant="subtle"
                                size="sm"
                            >
                                <IconInfoCircle size={16} />
                            </ActionIcon>
                        )}
                        {/* <ActionIcon color="red" variant="subtle" size="sm" onClick={() => handleRemoveFile(fileType)}>
              <IconTrash size={16} />
            </ActionIcon> */}
                    </Group>
                </Group>
            </Box>
        )
    }

    return (
        <>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                {/* <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to={`/admin/merchants-store/${id}`} className="text-primary hover:underline">
                        Stores
                    </Link>
                </li> */}
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Edit</span>
                </li>
            </ul>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 panel p-6">
                    <TextInput
                        label="Name"
                        required
                        value={formData.Name}
                        onChange={(e) => handleChange("Name", e.target.value)}
                    />
                    <TextInput
                        label="Phone"
                        required
                        value={formData.Phone}
                        onChange={(e) => handleChange("Phone", e.target.value)}
                    />
                    <TextInput
                        label="Email"
                        required
                        type="email"
                        value={formData.Email}
                        onChange={(e) => handleChange("Email", e.target.value)}
                    />
                    <TextInput
                        label="State"
                        required
                        value={formData.State}
                        onChange={(e) => handleChange("State", e.target.value)}
                    />
                    <TextInput
                        label="Address"
                        required
                        value={formData.Address}
                        onChange={(e) => handleChange("Address", e.target.value)}
                    />
                    <TextInput
                        label="Pin Code"
                        type="number"
                        value={formData.pinCode}
                        onChange={(e) => handleChange("pinCode", e.target.value)}
                    />
                    <TextInput
                        label="GSTIN"
                        required
                        value={formData.GSTIN}
                        onChange={(e) => handleChange("GSTIN", e.target.value)}
                    />
                    {/* <TextInput
                        label="Account Number"
                        type="number"
                        value={formData.accountNumber}
                        onChange={(e) => handleChange("accountNumber", e.target.value)}
                    />
                    <TextInput
                        label="IFSC Code"
                        value={formData.ifscCode}
                        onChange={(e) => handleChange("ifscCode", e.target.value)}
                    /> */}

                    <input type="hidden" name="GroupId" value={formData.GroupId} />

                    <Select
                        label="Affiliate"
                        required
                        value={formData.AffiliateId}
                        onChange={(value) => handleChange("AffiliateId", value!)}
                        data={normalizedAffiliateOptions.map((affiliate) => ({
                            value: affiliate._id, // Use _id as the value
                            label: affiliate.AffiliateId || `AFID_${affiliate._id}`, // Display AffiliateId
                        }))}
                    />

                    <Select
                        label="Account"
                        required
                        value={formData.AccountId}
                        onChange={(value) => handleChange("AccountId", value!)}
                        data={normalizedAccountOptions.map((account) => ({
                            value: account._id, // Use _id as the value
                            label: account.AccountId || `ACID_${account._id}`, // Display AccountId
                        }))}
                    />

                    {/* GST Certificate */}
                    <div className="space-y-2">
                        <Text size="sm" weight={500}>
                            GST Certificate
                        </Text>
                        {!formData.removeGstCertificate && (
                            <FilePreview
                                file={formData.gstCertificate}
                                url={formData.gstCertificateUrl}
                                fileType="gstCertificate"
                                label="GST Certificate"
                            />
                        )}
                        <FileInput
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(file) => {
                                handleChange("gstCertificate", file)
                                handleChange("removeGstCertificate", false)
                            }}
                        />
                    </div>

                    {/*  Shop Photo */}
                    <div className="space-y-2">
                        <Text size="sm" weight={500}>
                            Shop Photo
                        </Text>
                        {!formData.removeShopPhoto && (
                            <FilePreview
                                file={formData.shopPhoto}
                                url={formData.shopPhotoUrl}
                                fileType="shopPhoto"
                                label="Shop Photo"
                            />
                        )}
                        <FileInput
                            accept=".jpg,.jpeg,.png"
                            onChange={(file) => {
                                handleChange("shopPhoto", file)
                                handleChange("removeShopPhoto", false)
                            }}
                        />
                    </div>

                    {/*  Cancelled Cheque */}
                    <div className="space-y-2">
                        <Text size="sm" weight={500}>
                            Cancelled Cheque
                        </Text>
                        {!formData.removeChequePhoto && (
                            <FilePreview
                                file={formData.chequePhoto}
                                url={formData.chequePhotoUrl}
                                fileType="chequePhoto"
                                label="Cancelled Cheque"
                            />
                        )}
                        <FileInput
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(file) => {
                                handleChange("chequePhoto", file)
                                handleChange("removeChequePhoto", false)
                            }}
                        />
                    </div>

                    <div className="flex items-center mt-2">
                        <Switch
                            label="Active status"
                            checked={formData.IsActive}
                            onChange={(e) => handleChange("IsActive", e.currentTarget.checked)}
                            color="green"
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <Button type="submit" className="btn btn-primary gap-2">
                        Update
                    </Button>
                </div>
            </form>
        </>
    )
}

export default EditStore
