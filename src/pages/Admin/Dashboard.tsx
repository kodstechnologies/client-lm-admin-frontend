
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { setPageTitle } from "../../store/themeConfigSlice"
import { getAllDetails } from "../../api/index"

const Dashboard = () => {
  const dispatch = useDispatch()
  const [totalLoans, setTotalLoans] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(setPageTitle("Dashboard"))

    // Fetch total loans count
    const fetchLoanCount = async () => {
      try {
        const response = await getAllDetails()
        const rawData = response?.data

        if (Array.isArray(rawData)) {
          // Count unique lead IDs to get total loans
          const uniqueLeadIds = new Set()

          rawData.forEach((item) => {
            if (item.leadId) {
              uniqueLeadIds.add(item.leadId)
            }
          })

          setTotalLoans(uniqueLeadIds.size)
        }
      } catch (error) {
        console.error("Error fetching loan count:", error)
        setTotalLoans(0)
      } finally {
        setLoading(false)
      }
    }

    fetchLoanCount()
  }, [dispatch])

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Dashboard
          </Link>
        </li>
      </ul>

      <div className="pt-11">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
          <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold"> Total Merchants Registered</div>
            </div>
            <div className="flex items-center mt-5">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 1460 </div>
            </div>
          </div>
          <div className="panel bg-gradient-to-r from-cyan-500 to-cyan-400">
            <div className="flex justify-between">
              <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold"> Total Loans</div>
            </div>
            <div className="flex items-center mt-5">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                {loading ? <div className="animate-pulse h-8 w-16 bg-cyan-300 rounded"></div> : totalLoans}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
