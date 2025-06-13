
import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import { setPageTitle } from "../../../store/themeConfigSlice"
import { Button, Switch, Select, TextInput, FileInput, Group, Text, ActionIcon, Box } from "@mantine/core"
import { IconInfoCircle, IconFile, IconPhoto } from "@tabler/icons-react"
import { fetchAllAffiliates, fetchAllAccounts, fetchStoreById, updateStoreById } from "../../../api"
import { showMessage } from "../../common/ShowMessage"
import { FaSpinner } from "react-icons/fa"
const VITE_BACKEND_LOCALHOST_API_URL = import.meta.env.VITE_BACKEND_API_URL

const EditStore = () => {
  const dispatch = useDispatch()
  const { id } = useParams() //capture store ID from route param
  // const { storeId } = useParams();
  const location = useLocation();
  const { storeBrand } = location.state || {};
  // console.log("🚀 ~ EditStore ~ storeBrand:", storeBrand)

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

  const queryParams = new URLSearchParams(location.search);
  const fromLink = queryParams.get('from') === 'link';
  // console.log("🚀 ~ EditStore ~ fromLink:", fromLink)
  // After setting formData, find the selected affiliate and account names
  const [selectedAffiliateName, setSelectedAffiliateName] = useState<string>("")
  const [selectedAccountName, setSelectedAccountName] = useState<string>("")
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false);

  const [groupOptions, setGroupOptions] = useState<{ _id: string; GroupId: string }[]>([])
  const [affiliateOptions, setAffiliateOptions] = useState<{ _id: string; AffiliateId: string; Name?: string }[]>([])
  const [fetchedstorBrand, setFetchedStoreBrand] = useState()
  const [accountOptions, setAccountOptions] = useState<
    { _id: string; AccountId: string; Name?: string; AccountName?: string }[]
  >([])
  const navigate = useNavigate()

  // 👇 Fetch dropdown + existing store data
  useEffect(() => {
    if (id) {
      const fetchFileFromUrl = async (url: string, filename: string): Promise<File | null> => {
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
          const storeRes = await fetchStoreById(id)
          const store = storeRes.data?.data || storeRes
          // console.log("Fetched store data:", store.ChainStoreId.Name) // Debug store data
          setFetchedStoreBrand(store.ChainStoreId.Name)
          const baseUrl = `${VITE_BACKEND_LOCALHOST_API_URL.replace("/api", "")}/Uploads`

          // Create URLs for files
          const gstUrl = store.gstCertificate ? `${baseUrl}/${store.gstCertificate}` : ""
          const shopUrl = store.shopPhoto ? `${baseUrl}/${store.shopPhoto}` : ""
          const chequeUrl = store.chequePhoto ? `${baseUrl}/${store.chequePhoto}` : ""

          // Convert URLs to File objects
          const gstFile = gstUrl ? await fetchFileFromUrl(gstUrl, store.gstCertificate) : null
          const shopFile = shopUrl ? await fetchFileFromUrl(shopUrl, store.shopPhoto) : null
          const chequeFile = chequeUrl ? await fetchFileFromUrl(chequeUrl, store.chequePhoto) : null

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
          })

          // Fetch dropdown options
          const [affiliateRes, accountRes] = await Promise.all([fetchAllAffiliates(), fetchAllAccounts()])
          const affiliateData = affiliateRes?.data?.data || affiliateRes?.data || []
          const accountData = accountRes?.data?.data || accountRes?.data || []

          // Filter active affiliates and accounts
          const activeAffiliates = Array.isArray(affiliateData) ? affiliateData.filter((a) => a.IsActive === true) : []
          const activeAccounts = Array.isArray(accountData) ? accountData.filter((a) => a.IsActive === true) : []

          // console.log("Active affiliates:", activeAffiliates)
          // console.log("Active accounts:", activeAccounts)

          setAffiliateOptions(activeAffiliates)
          setAccountOptions(activeAccounts)

          // Find and set the names of currently selected affiliate and account
          if (store.AffiliateId) {
            const selectedAffiliate = activeAffiliates.find(
              (a) => a._id === (store.AffiliateId?._id || store.AffiliateId),
            )
            if (selectedAffiliate) {
              setSelectedAffiliateName(selectedAffiliate.Name || selectedAffiliate.AffiliateId || "Unknown Affiliate")
            }
          }

          if (store.AccountId) {
            const selectedAccount = activeAccounts.find((a) => a._id === (store.AccountId?._id || store.AccountId))
            if (selectedAccount) {
              setSelectedAccountName(
                selectedAccount.AccountName || selectedAccount.Name || selectedAccount.AccountId || "Unknown Account",
              )
            }
          }
        } catch (error) {
          console.error("Error fetching store or dropdown data:", error)
        }
      }

      fetchData()
    }
  }, [id])

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
  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.Name.trim()) errors.Name = "Store Name is required"
    if (!formData.Address.trim()) errors.Address = "Address is required"
    if (!formData.Phone.trim()) {
      errors.Phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.Phone)) {
      errors.Phone = "Phone must be 10 digits"
    }

    if (!formData.Email.trim()) {
      errors.Email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.Email)) {
      errors.Email = "Invalid email format"
    }

    if (!formData.State.trim()) errors.State = "State is required"
    if (!formData.GSTIN.trim()) errors.GSTIN = "GSTIN is required"
    if (!formData.pinCode.trim()) errors.pinCode = "Pin Code is required"
    if (!formData.AffiliateId) errors.AffiliateId = "Affiliate selection is required"
    if (!formData.AccountId) errors.AccountId = "Account selection is required"

    return errors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors = validateForm()
    console.log("Validation errors:", errors)

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    } else {
      setFormErrors({})
    }
    setLoading(true); // Start loading

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
      showMessage("Store updated successfully")
      // Navigate back after successful update
      navigate("/admin/merchants-store")
    } catch (error) {
      console.error("Error updating store:", error)
    } finally {
      setLoading(false); // Stop loading
    }
  }

  type FilePreviewProps = {
    file: File | null
    url: string
    fileType?: string
    label?: string
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
          </Group>
        </Group>
      </Box>
    )
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-600" />
      </div>
    );
  }
  return (
    <>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/" className="text-primary hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Edit</span>
        </li>
      </ul>

      {/* {selectedAffiliateName && (
        <div className="panel p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text size="sm" weight={500} className="mb-1">
                Current Affiliate:
              </Text>
              <Text size="md">{selectedAffiliateName}</Text>
            </div>
            <div>
              <Text size="sm" weight={500} className="mb-1">
                Current Account:
              </Text>
              <Text size="md">{selectedAccountName}</Text>
            </div>
          </div>
        </div>
      )} */}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-16 lg:gap-52 mb-4">
          <p className="font-bold text-sm">Store ID: {id}</p>
          <p className="font-bold text-sm">Chain Store Name: {fetchedstorBrand}</p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 panel p-6">

          <TextInput
            label="Name"
            required
            value={formData.Name}
            onChange={(e) => handleChange("Name", e.target.value)}
            error={formErrors.Name}

          />
          <TextInput
            label="Phone"
            placeholder="Phone"
            type="text"
            required
            value={formData.Phone}
            onChange={(e) => {
              const val = e.target.value;
              // Allow only digits and max length 10
              if (/^\d{0,10}$/.test(val)) {
                handleChange("Phone", val);
              }
            }}
            error={formErrors.Phone}
          />


          <TextInput
            label="Email"
            required
            type="email"
            value={formData.Email}
            onChange={(e) => handleChange("Email", e.target.value)}
            error={formErrors.Email}

          />
          <TextInput
            label="State"
            required
            value={formData.State}
            onChange={(e) => handleChange("State", e.target.value)}
            error={formErrors.State}

          />
          <TextInput
            label="Address"
            required
            value={formData.Address}
            onChange={(e) => handleChange("Address", e.target.value)}
            error={formErrors.Address}

          />
          <TextInput
            label="Pin Code"
            type="number"
            value={formData.pinCode}
            onChange={(e) => handleChange("pinCode", e.target.value)}
            error={formErrors.pinCode}

          />
          <TextInput
            label="GSTIN"
            required
            value={formData.GSTIN}
            onChange={(e) => handleChange("GSTIN", e.target.value)}
            error={formErrors.pinCode}
          />

          <input type="hidden" name="GroupId" value={formData.GroupId} />

          <Select
            label="Affiliate"
            required
            value={formData.AffiliateId}
            onChange={(value) => {
              handleChange("AffiliateId", value!)
              // Update the displayed name when selection changes
              const selected = affiliateOptions.find((a) => a._id === value)
              if (selected) {
                setSelectedAffiliateName(selected.Name || selected.AffiliateId || "Unknown Affiliate")
              }
            }}
            data={affiliateOptions.map((affiliate) => ({
              value: affiliate._id,
              label: affiliate.Name || affiliate.AffiliateId || "Unknown Affiliate",
            }))}
            placeholder={selectedAffiliateName || "Select Affiliate"}
          />

          <Select
            label="Account"
            required
            value={formData.AccountId}
            onChange={(value) => {
              handleChange("AccountId", value!)
              // Update the displayed name when selection changes
              const selected = accountOptions.find((a) => a._id === value)
              if (selected) {
                setSelectedAccountName(selected.AccountName || selected.Name || selected.AccountId || "Unknown Account")
              }
            }}
            data={accountOptions.map((account) => ({
              value: account._id,
              label: account.AccountName || account.Name || account.AccountId || "Unknown Account",
            }))}
            placeholder={selectedAccountName || "Select Account"}
          />

          {/* GST Certificate */}
          <div className="space-y-2">
            <Text size="sm" weight={500}>
              GST Certificate
            </Text>
            {!formData.removeGstCertificate && (
              <FilePreview
                file={formData.gstCertificate}
                url={formData.gstCertificateUrl || ''}
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

          {/* Shop Photo */}
          <div className="space-y-2">
            <Text size="sm" weight={500}>
              Shop Photo
            </Text>
            {!formData.removeShopPhoto && (
              <FilePreview
                file={formData.shopPhoto}
                url={formData.shopPhotoUrl || ''}
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

          {/* Cancelled Cheque */}
          <div className="space-y-2">
            <Text size="sm" weight={500}>
              Cancelled Cheque
            </Text>
            {!formData.removeChequePhoto && (
              <FilePreview
                file={formData.chequePhoto}
                url={formData.chequePhotoUrl || ''}
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
          <Button type="submit" disabled={loading}>
            {loading ? <FaSpinner size="sm" /> : "Submit"}

          </Button>
        </div>
      </form>
    </>
  )
}

export default EditStore
