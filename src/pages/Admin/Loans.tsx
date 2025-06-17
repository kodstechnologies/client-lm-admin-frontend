import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllDetails, getSummary } from "../../api/index";
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

  const loanTypes = ["All", "Personal Loan", "Business Loan"] as const;
  type LoanType = typeof loanTypes[number];
  const [loanTypeFilter, setLoanTypeFilter] = useState<LoanType>("All");

  const [noRecordsFound, setNoRecordsFound] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

const fetchLoanData = async () => {
  try {
    setLoading(true);
    const response = await getAllDetails();
    const rawData = response?.data;

    if (!Array.isArray(rawData)) throw new Error("Invalid response");

    const normalizedData: LoanRow[] = [];

    // Prepare an array of promises for fetching summaries
    const summaryPromises = rawData.map((item) =>
      getSummary(item.leadId)
        .then((summaryResponse) => ({
          leadId: item.leadId,
          summary: summaryResponse?.data?.summary,
        }))
        .catch(() => ({
          leadId: item.leadId,
          summary: null,
        }))
    );

    // Await all summaries in parallel
    const summaryResults = await Promise.all(summaryPromises);

    const summaryMap = new Map<string, any>();
    summaryResults.forEach(({ leadId, summary }) => {
      summaryMap.set(leadId, summary);
    });

    for (const item of rawData) {
      const leadId = item.leadId;
      const loginCount = item.loginCountRef?.count ?? 0;
      const lenderName = item.appliedCustomerRef?.lenderName ?? "";
      const createdAt = item.createdAt;
      const updatedAt = item.updatedAt;

      const summary = summaryMap.get(leadId);
      const offersTotal = summary?.offersTotal ?? "-";
      const maxLoanAmount = summary?.maxLoanAmount ?? "-";
      const minMPR = summary?.minMPR ?? "-";
      const maxMPR = summary?.maxMPR ?? "-";

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

    // De-duplicate and assign serial numbers
    const uniqueDataMap = new Map<string, LoanRow>();
    normalizedData.forEach((item) => {
      const key = `${item.leadId}-${item.loanType}`;
      if (!uniqueDataMap.has(key)) {
        uniqueDataMap.set(key, item);
      }
    });

    const deduplicatedData = [...uniqueDataMap.values()];
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


  useEffect(() => {
    fetchLoanData();
  }, [loanTypeFilter]);

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
                {loanTypes.map((type) => (
                  <button
                    key={type}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${loanTypeFilter === type ? "bg-blue-100" : ""}`}
                    onClick={() => {
                      setLoanTypeFilter(type);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {type}
                  </button>
                ))}
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
        render: (row: LoanRow) => (row.createdAt ? new Date(row.createdAt).toLocaleString("en-GB") : "-"),
      },
      {
        accessor: "updatedAt",
        title: "Updated At",
        render: (row: LoanRow) => (row.updatedAt ? new Date(row.updatedAt).toLocaleString("en-GB") : "-"),
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
    [loanTypeFilter, isDropdownOpen]
  );

  const filteredLoanData = loanTypeFilter === "All" ? loanData : loanData.filter((loan) => loan.loanType === loanTypeFilter);

  return (
    <div>
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
          <p className="text-red-500">No records found</p>
        ) : (
          <DataTableComponentsAllDetails data={filteredLoanData} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default Loans;