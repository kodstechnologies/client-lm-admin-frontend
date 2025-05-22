import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchFilteredLoanDataByType, getAllDetails, getSummary } from "../../api/index";
import DataTableComponent from "../../components/common/DataTableComponent";
import DataTableComponentsAllDetails from "../../components/common/DataTableComponentsAllDetails";

const businessRegistrationTypeMap: Record<number, string> = {
  1: "GST",
  2: "Shop & Establishment",
  3: "Municipal Corporation / Mahanagar",
  4: "Palika Gramapanchayat",
  5: "Udyog Aadhar",
  6: "Drugs License / Food & Drugs Control",
  7: "Other",
  8: "No Business Proof",
};

interface LoanRow {
  id: string;
  leadId: string;
  loanType: "Personal Loan" | "Business Loan";
  firstName?: string;
  lastName?: string;
  dob?: string;
  email?: string;
  mobileNumber: string;
  monthlyIncome?: number;
  employerName?: string;
  businessRegistrationType?: number;
  pan?: string;
  referal?: string;
  pincode?: string;
  loginCount?: number;
  lenderName?: string;
  createdAt?: string;
  updatedAt?: string;
  offersTotal?: number;
  maxLoanAmount?: string;
  minMPR?: number;
  maxMPR?: number;
  serialNo?: number;
}

const Loans = () => {
  const [loanData, setLoanData] = useState<LoanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loanTypeFilter, setLoanTypeFilter] = useState<"All" | "Personal Loan" | "Business Loan">("All");
  const [noRecordsFound, setNoRecordsFound] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewOffers = (loan: LoanRow) => {
    navigate(`/admin/loans/${loan.serialNo}`, {
      state: {
        leadId: loan.leadId,
        name: `${loan.firstName || ""} ${loan.lastName || ""}`.trim(),
        loanType: loan.loanType,
        lenderName: loan.lenderName || "-",
      },
    });
  };

  const columns = useMemo(
    () => [
      { accessor: "serialNo", title: "S.No." },
      {
        accessor: "loanType",
        title: (
          <div className="flex items-center space-x-2 ">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="bg-inherit text-black border-2 border-gray-300 px-4 py-2 rounded flex items-center"
            >
              <span>{loanTypeFilter === "All" ? "Type of loan" : loanTypeFilter}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute bg-white border rounded shadow-md mt-10 w-40 z-10">
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${loanTypeFilter === "All" ? "bg-blue-100" : ""}`}
                  onClick={() => {
                    setLoanTypeFilter("All")
                    setIsDropdownOpen(false)
                  }}
                >
                  All
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${loanTypeFilter === "Personal Loan" ? "bg-blue-100" : ""}`}
                  onClick={() => {
                    setLoanTypeFilter("Personal Loan")
                    setIsDropdownOpen(false)
                  }}
                >
                  Personal Loan
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${loanTypeFilter === "Business Loan" ? "bg-blue-100" : ""}`}
                  onClick={() => {
                    setLoanTypeFilter("Business Loan")
                    setIsDropdownOpen(false)
                  }}
                >
                  Business Loan
                </button>
              </div>
            )}
          </div>
        ),
      },
      { accessor: "leadId", title: "Lead Id" },
      { accessor: "firstName", title: "First Name" },
      { accessor: "lastName", title: "Last Name" },
      { accessor: "dob", title: "DOB" },
      { accessor: "email", title: "Email" },
      { accessor: "mobileNumber", title: "Phone" },
      { accessor: "monthlyIncome", title: "Monthly Income" },
      { accessor: "employerName", title: "Employer Name" },
      {
        accessor: "businessRegistrationType",
        title: "Business Reg Type",
        render: (row: LoanRow) =>
          row.businessRegistrationType ? businessRegistrationTypeMap[row.businessRegistrationType] : "-",
      },
      { accessor: "pan", title: "PAN", render: (row: LoanRow) => row.pan || "-" },
      { accessor: "referal", title: "Referal Code", render: (row: LoanRow) => row.referal || "-" },
      { accessor: "pincode", title: "Pincode", render: (row: LoanRow) => row.pincode || "-" },
      { accessor: "loginCount", title: "Login Count", render: (row: LoanRow) => row.loginCount || "-" },
      { accessor: "lenderName", title: "Offer Clicked", render: (row: LoanRow) => row.lenderName || "-" },
      { accessor: "offersTotal", title: "Total Offers", render: (row: LoanRow) => row.offersTotal || "-" },
      { accessor: "maxLoanAmount", title: "Max Loan Amount", render: (row: LoanRow) => row.maxLoanAmount || "-" },
      { accessor: "minMPR", title: "Min MPR", render: (row: LoanRow) => row.minMPR || "-" },
      { accessor: "maxMPR", title: "Max MPR", render: (row: LoanRow) => row.maxMPR || "-" },
      {
        accessor: "createdAt",
        title: "Created At",
        render: (row: LoanRow) => (row.createdAt ? new Date(row.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) : "-")
      },
      {
        accessor: "updatedAt",
        title: "Updated At",
        render: (row: LoanRow) => (row.updatedAt ?new Date(row.updatedAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }): "-")

      },
      {
        accessor: "actions",
        title: "Actions",
        render: (row: LoanRow) => (

          <button onClick={() => handleViewOffers(row)} className="btn btn-primary gap-2">
            View Offers
          </button>
        ),
      },
    ],
    [isDropdownOpen]
  );

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await getAllDetails();
        const rawData = response?.data;

        if (!Array.isArray(rawData)) throw new Error("Invalid response");

        const normalizedData: LoanRow[] = [];

        for (const item of rawData) {
          const leadId = item.leadId;
          const loginCount = item.loginCountRef?.count ?? 0;
          const lenderName = item.appliedCustomerRef?.lenderName ?? "";

          const createdAt = item.createdAt;
          console.log("🚀 ~ fetchData ~ createdAt:", createdAt)
          const updatedAt = item.updatedAt;
          console.log("🚀 ~ fetchData ~ updatedAt:", updatedAt)

          let offersTotal, maxLoanAmount, minMPR, maxMPR;
          try {
            const summaryResponse = await getSummary(leadId);
            const summary = summaryResponse?.data?.summary;
            offersTotal = summary?.offersTotal;
            maxLoanAmount = summary?.maxLoanAmount;
            minMPR = summary?.minMPR;
            maxMPR = summary?.maxMPR;
          } catch (e) {
            console.warn(`Failed to fetch summary for leadId: ${leadId}`);
          }

          if (item.personalLoanRef) {
            normalizedData.push({
              id: `${leadId}-personal`,
              leadId,
              loanType: "Personal Loan",
              ...item.personalLoanRef,
              loginCount,
              lenderName,
              createdAt,
              updatedAt,
              offersTotal,
              maxLoanAmount,
              minMPR,
              maxMPR,
            });
          }

          if (item.businessLoanRef) {
            normalizedData.push({
              id: `${leadId}-business`,
              leadId,
              loanType: "Business Loan",
              ...item.businessLoanRef,
              loginCount,
              lenderName,
              createdAt,
              updatedAt,
              offersTotal,
              maxLoanAmount,
              minMPR,
              maxMPR,
            });
          }
        }

        const flatData = normalizedData.flat();
        const uniqueMap = new Map<string, LoanRow>();

        flatData.forEach((item) => {
          const key = `${item.leadId}-${item.loanType}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        });

        const deduplicatedData = [...uniqueMap.values()];

        if (deduplicatedData.length === 0) {
          setNoRecordsFound(true);
          setLoanData([]);
        } else {
          const dataWithSerialNo = deduplicatedData.map((row, index) => ({
            ...row,
            serialNo: index + 1,
          }));
          setLoanData(dataWithSerialNo);
          setNoRecordsFound(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch loan data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
  }, [loanTypeFilter]);

  const filteredLoanData =
    loanTypeFilter === "All" ? loanData : loanData.filter((loan) => loan.loanType === loanTypeFilter);

  return (
    <div>
      {/* UI for breadcrumb & loading state remains unchanged */}
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/" className="text-primary hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Loans</span>
        </li>
      </ul>
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : noRecordsFound ? (
          <p className="text-red-500"></p>
        ) : (
          <DataTableComponentsAllDetails data={filteredLoanData} columns={columns} />
          // <p>hi</p>
          
        )}
      </div>
    </div>
  );
};

export default Loans;