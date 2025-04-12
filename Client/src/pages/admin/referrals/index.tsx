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

function ReferralsController() {
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
        router.push("/");
      }
      return;
    }
    // Fetch Data
    if (!searching) {
      setIsLoading(true);
      // VARS
      const url = `${db_link}api/referrals?page=${page}`;
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
      const url = `${db_link}api/search/referrals?page=${pageSearch}`;
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
    const url = `${db_link}api/search/referrals?page=${page}`;
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
    const url = `${db_link}api/referrals`;
    // Form Data
    const fData = new FormData();
    fData.append("description", e.target[0].value);
    fData.append("descriptionAr", e.target[1].value);
    fData.append("referrer", e.target[2].value);
    fData.append("beneficiary", e.target[3].value);
    fData.append("status", e.target[4].value);
    fData.append("r_status", e.target[5].value);
    fData.append("b_status", e.target[6].value);

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
              <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
              <p className="text-sm text-gray-500 mt-1">
                Here you can find all Referrals in the system
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
              <input
                type="text"
                name="search"
                placeholder="Search Referrals..."
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
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      Id
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      description
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      used
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      R_id
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      B_id
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      Date
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
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
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span
                          className={`whitespace-nowrap inline-flex items-center px-3 py-1 rounded-full font-medium ${
                            item.status == 0
                              ? "bg-yellow-100 text-yellow-800"
                              : item.status == 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status == 0
                            ? "Pending"
                            : item.status == 1
                            ? "Approved"
                            : "Rejected"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex gap-2 items-center">
                          <span
                            className={`whitespace-nowrap inline-flex items-center px-3 py-1 rounded-full font-medium ${
                              item.r_status == 0
                                ? "bg-yellow-100 text-yellow-800"
                                : item.r_status == 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            R:{" "}
                            {item.r_status == 0
                              ? "Not Used"
                              : item.r_status == 1
                              ? "Used"
                              : "Rejected"}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span
                            className={`whitespace-nowrap inline-flex items-center px-3 py-1 rounded-full font-medium ${
                              item.b_status == 0
                                ? "bg-yellow-100 text-yellow-800"
                                : item.b_status == 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            B:{" "}
                            {item.b_status == 0
                              ? "Not Used"
                              : item.b_status == 1
                              ? "Used"
                              : "Rejected"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <Link
                          className="text-blue-600 hover:underline font-bold"
                          href={`/admin/users/${item.referrer}`}
                        >
                          {item.referrer}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <Link
                          className="text-blue-600 hover:underline font-bold"
                          href={`/admin/users/${item.beneficiary}`}
                        >
                          {item.beneficiary}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/referrals/${item.id}`}
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
              pageCount={Math.ceil(response.total / 40)}
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
                Referrals Form
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        description
                      </label>
                      <input
                        required
                        type="text"
                        name="description"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                        placeholder="Enter description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        description Ar
                      </label>
                      <input
                        required
                        type="text"
                        name="descriptionAr"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                        placeholder="Enter descriptionAr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referral ID
                      </label>
                      <input
                        required
                        type="number"
                        name="referral"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                        placeholder="Enter referral"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        beneficiary ID
                      </label>
                      <input
                        required
                        type="number"
                        name="beneficiary"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                        placeholder="Enter beneficiary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        required
                        name="status"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                      >
                        <option value={0}>Pending</option>
                        <option value={1}>Accepted</option>
                        <option value={2}>Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referral Status
                      </label>
                      <select
                        required
                        name="r_status"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                      >
                        <option value={0}>not Used</option>
                        <option value={1}>Used</option>
                        <option value={2}>Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Beneficiary Status
                      </label>
                      <select
                        required
                        name="b_status"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                      >
                        <option value={0}>not Used</option>
                        <option value={1}>Used</option>
                        <option value={2}>Rejected</option>
                      </select>
                    </div>
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
                      {requestSent ? "Processing..." : "Add Referral"}
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

export default ReferralsController;
