
import { useEffect, useState } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { getAllOffers } from "../../api"

// Define the structure of an individual offer
interface Offer {
  lenderId: number
  lenderName: string
  lenderLogo: string
  offerAmountUpTo: string
  offerTenure: string
  offerInterestRate: string
  offerProcessingFees: string
  offerLink: string
  status: string
}

// Define the structure of the location state
interface LocationState {
  leadId: string
  name: string
  loanType: string
  lenderName:string
}

const Offers = () => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get data from React Router instead of localStorage
  const location = useLocation()
  const { serialNo } = useParams<{ serialNo: string }>()
  const navigate = useNavigate()

  // Get the state passed from the previous page
  const state = location.state as LocationState
  // console.log("🚀 ~ Offers ~ state:", state)
// console.log(state.);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Check if we have the leadId in the state
        if (!state || !state.leadId) {
          setError("Lead ID not found. Please go back to the loans page.")
          return
        }

        // Fetch offers using the leadId from the state
        const data = await getAllOffers(state.leadId)
        // console.log("🚀 ~ fetchOffers ~ data:", data)

        // Assuming the response structure is an array directly (or it could be data.offers if wrapped in an object)
        if (Array.isArray(data)) {
          setOffers(data)
        } else {
          setOffers(data.offers || data.data || []) // Handle different response structures
        }
      } catch (err) {
        setError("Failed to fetch offers")
        console.error("Error fetching offers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [state])

  // If we don't have the state, show an error with a button to go back
  if (!state && !loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>No loan information found. Please go back to the loans page and try again.</p>
          <button
            onClick={() => navigate("/admin/loans")}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Loans
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/" className="text-primary hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <Link to="/admin/loans" className="text-primary hover:underline">
            Loans
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Offers</span>
        </li>
      </ul>

      {/* Display customer information */}
      {state && (
        <div className="mt-4 mb-6">
          <h2 className="text-2xl font-bold mb-2">Offers for {state.name}</h2>
          <p className="text-gray-600">
            Loan Type: {state.loanType}
          </p>
          <p className="text-green-500">
            Last Clicked Offer: {state.lenderName}
          </p>
        </div>
      )}

      <div className="offers-container mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading && <p className="text-center col-span-full">Loading offers...</p>}
        {error && <p className="text-center col-span-full text-red-500">{error}</p>}

        {!loading && !error && offers.length === 0 && (
          <p className="text-center col-span-full">No offers available for this customer.</p>
        )}

        {offers.length > 0 &&
          offers.map((offer) => (
            <div
              key={offer.lenderId}
              className="offer-card bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col h-full"
            >
              <img
                src={offer.lenderLogo || "/placeholder.svg"}
                alt={offer.lenderName}
                className="w-24 h-24 object-contain mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-center mb-2">{offer.lenderName}</h3>
              <p className="text-gray-700">
                <strong>Lender ID:</strong> {offer.lenderId}
              </p>
              <p className="text-gray-700">
                <strong>Offer Amount Up To:</strong> {offer.offerAmountUpTo}
              </p>
              <p className="text-gray-700">
                <strong>Tenure:</strong> {offer.offerTenure}
              </p>
              <p className="text-gray-700">
                <strong>Interest Rate:</strong> {offer.offerInterestRate}
              </p>
              <p className="text-gray-700">
                <strong>Processing Fees:</strong> {offer.offerProcessingFees}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong> {offer.status}
              </p>

              {/* The button is pushed to the bottom using mt-auto */}
              <div className="mt-auto">
                <a
                  href={offer.offerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 w-full text-center"
                >
                  View Offer
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Offers
