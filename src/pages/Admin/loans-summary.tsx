
import { useMemo } from "react"

interface LoanSummaryProps {
  loanData: any[]
  loanTypeFilter: "All" | "Personal Loan" | "Business Loan"
}

export default function LoansSummary({ loanData, loanTypeFilter }: LoanSummaryProps) {
  const summaryData = useMemo(() => {
    const totalLoans = loanData.length
    const personalLoans = loanData.filter((loan) => loan.loanType === "Personal Loan").length
    const businessLoans = loanData.filter((loan) => loan.loanType === "Business Loan").length

    return {
      totalLoans,
      personalLoans,
      businessLoans,
    }
  }, [loanData])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-white">
      <div
        className={`panel p-5 rounded-md ${loanTypeFilter === "All" ? "bg-gradient-to-r from-cyan-600 to-cyan-500" : "bg-gradient-to-r from-cyan-500 to-cyan-400"}`}
      >
        <div className="flex justify-between">
          <div className="text-md font-semibold">Total Loans</div>
        </div>
        <div className="flex items-center mt-5">
          <div className="text-3xl font-bold">{summaryData.totalLoans}</div>
        </div>
      </div>

      {/* <div
        className={`panel p-5 rounded-md ${loanTypeFilter === "Personal Loan" ? "bg-gradient-to-r from-blue-600 to-blue-500" : "bg-gradient-to-r from-blue-500 to-blue-400"}`}
      >
        <div className="flex justify-between">
          <div className="text-md font-semibold">Personal Loans</div>
        </div>
        <div className="flex items-center mt-5">
          <div className="text-3xl font-bold">{summaryData.personalLoans}</div>
        </div>
      </div>

      <div
        className={`panel p-5 rounded-md ${loanTypeFilter === "Business Loan" ? "bg-gradient-to-r from-violet-600 to-violet-500" : "bg-gradient-to-r from-violet-500 to-violet-400"}`}
      >
        <div className="flex justify-between">
          <div className="text-md font-semibold">Business Loans</div>
        </div>
        <div className="flex items-center mt-5">
          <div className="text-3xl font-bold">{summaryData.businessLoans}</div>
        </div>
      </div> */}
    </div>
  )
}
