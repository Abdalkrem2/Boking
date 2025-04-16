import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReactPaginate from "react-paginate";
import { FaPencilAlt, FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";

function PaymentsController() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  //Top Level Variables
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.user.token;

  //Response Data
  const [response, setResponse] = useState({
    data: ["Array", " Array"],
    current_page: 0,
    per_page: 0,
    total: 0,
  });

  //State Variables
  const [isLoading, setIsLoading] = useState(true);
  const [backError, setBackError] = useState<any>(false);
  const [message, setMessage] = useState<any>([0, "", 0]);
  const [requestSent, setRequestSent] = useState(false);
  const [number, setNumber] = useState(1);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [searching, setSearching] = useState(false);
  const [pageSearch, setPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  // Data Fetch
  useEffect(() => {
    if (db_link === "") return;
    // Auth Check
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/mustLogin");
      }
      return;
    }
    // Fetch Data
    if (!searching) {
      setIsLoading(true);
      // VARS
      const url = `${db_link}api/payments?page=${page}`;
      // Function
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // Success
        .then((res) => {
          if (res.data == "you are not allowed here") {
            router.push("/");
          }
          setResponse(res.data);
          setIsLoading(false);
        })
        // Error
        .catch(() => {
          router.push("/");
        });
    }
  }, [page, number, status, db_link]);

  //Page Change Handler
  const handlePageChange = (selectedItem: { selected: number }) => {
    if (searching) {
      setPageSearch(selectedItem.selected + 1);
    } else {
      setPage(selectedItem.selected + 1);
    }
  };

  //Search Handler
  useEffect(() => {
    if (db_link === "") return;
    // Auth Check
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/mustLogin");
      }
      return;
    }
    // Fetch Data
    if (searching) {
      setIsLoading(true);
      // VARS
      const value = searchInput;
      const url = `${db_link}api/search/payments?page=${pageSearch}`;
      // Function
      axios
        .post(
          url,
          { value },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        // Success
        .then((res) => {
          setResponse(res.data);
          setIsLoading(false);
        })
        // Error
        .catch(() => {
          setMessage([1, "Something went wrong, Please try again", 0]);
          setIsLoading(false);
        });
    }
  }, [pageSearch, db_link]);
  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearching(true);
    setIsLoading(true);
    // VARS
    const url = `${db_link}api/search/payments?page=${page}`;
    const value = e.target[0].value;
    setSearchInput(e.target[0].value);
    // Function
    axios
      .post(
        url,
        { value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // Success
      .then((res) => {
        setResponse(res.data);
        setIsLoading(false);
      })
      // Error
      .catch(() => {
        setMessage([1, "Something went wrong, Please try again", 0]);
        setIsLoading(false);
      });
  };

  // Submit Form
  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    // VARS
    const url = `${db_link}api/payments`;
    // Form Data
    const fData = new FormData();
    fData.append("amount", e.target[0].value);
    fData.append("type", e.target[1].value);
    fData.append("payment_details", e.target[2].value);
    // Function
    axios
      .post(url, fData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // Success
      .then((res) => {
        setRequestSent(false);
        if (res.data == "you are not allowed here") {
          router.push("/");
          return;
        }
        if (res.data.errors) {
          setBackError(res.data.errors);
        } else {
          setBackError(false);
          setMessage([1, "Payment Added Successfully", 1]);
          window.scroll(0, 0);
          setNumber(number + 1);
          e.target.reset();
        }
      })
      // Error
      .catch(() => {
        setRequestSent(false);
        setMessage([1, "Something went wrong, Please try again", 0]);
        window.scroll(0, 0);
      });
  };

  // Return Function
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Message Alert */}
          {message[0] == 1 && (
            <div
              className={`${
                message[2] == 0
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              } border-l-4 p-4 mb-6 rounded-r`}
            >
              <p className="text-sm font-medium text-gray-800">{message[1]}</p>
            </div>
          )}

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-b">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
              <p className="text-sm text-gray-500 mt-1">
                Here you can find all Payments in the system
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
              <input
                type="text"
                name="search"
                placeholder="Search payments..."
                className="w-full sm:w-80 h-10 pl-4 pr-12 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaSearch className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Table Section */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">
                      Id
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">
                      Type
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">
                      Date
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {response.data.map((item: any, i: number) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.type == 0
                          ? "Buy Products"
                          : item.type == 1
                          ? "Services"
                          : item.type == 2
                          ? "Equipments"
                          : item.type == 3
                          ? "Maintenance"
                          : item.type == 4
                          ? "Salary"
                          : "Others"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/payments/${item.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <FaPencilAlt className="w-3 h-3" />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t">
            <ReactPaginate
              pageCount={Math.ceil(response.total / 25)}
              previousLabel="Previous"
              nextLabel="Next"
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName="flex justify-center gap-2"
              pageClassName="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              activeClassName="!bg-blue-50 !text-blue-600"
              previousClassName="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              nextClassName="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              disabledClassName="opacity-50 cursor-not-allowed"
            />
          </div>

          {/* Add Form Section */}
          <div className="border-t">
            <div className="p-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 px-4 py-2 rounded-md shadow-lg transition-all duration-300"
              >
                Payments Form
                <IoIosArrowDown
                  className={`w-5 h-5 transition-transform ${
                    showForm ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showForm && (
                <form
                  onSubmit={submitHandler}
                  className="mt-6 space-y-6 max-w-2xl bg-white p-8 rounded-lg shadow-md"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Amount Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        required
                        type="number"
                        name="amount"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                        placeholder="Enter amount"
                      />
                    </div>
                    {/* Type Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        required
                        name="type"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                      >
                        <option value={0}>Buy Products</option>
                        <option value={1}>Services</option>
                        <option value={2}>Equipments</option>
                        <option value={3}>Maintenance</option>
                        <option value={4}>Salary</option>
                        <option value={5}>Others</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Details Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Details
                    </label>
                    <textarea
                      required
                      name="payment_details"
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                      placeholder="Enter payment details"
                    ></textarea>
                  </div>

                  {backError && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                      <ul className="list-disc pl-5 space-y-1">
                        {backError.map((error: string, index: number) => (
                          <li key={index} className="text-sm text-red-700">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={requestSent}
                      className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {requestSent ? "Processing..." : "Add Payment"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PaymentsController;
