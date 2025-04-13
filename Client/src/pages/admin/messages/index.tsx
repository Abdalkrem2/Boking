import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReactPaginate from "react-paginate";
import { FaPencilAlt, FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

function MessageController() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  //Top Level Variables
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const [sent, setSent] = useState<boolean>(false);
  //Response Data
  const [response, setResponse] = useState({
    data: ["Array", " Array"],
    current_page: 0,
    per_page: 0,
    total: 0,
  });

  //State Variables
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<any>([0, "", 0]);
  const [number, setNumber] = useState(1);
  const [page, setPage] = useState(1);
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
      const url = `${db_link}api/messages?page=${page}`;
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
      const url = `${db_link}api/search/messages?page=${pageSearch}`;
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
    const url = `${db_link}api/search/messages?page=${page}`;
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
  const updateHandler = (id: number) => {
    setSent(true);
    const url = `${db_link}api/messages/update/${id}`;
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
        setSent(false);
        const updatedData = response.data.map((item: any) =>
          item.id === id ? { ...item, status: res.data.status } : item
        );
        setResponse((prevState) => ({ ...prevState, data: updatedData }));
      })
      // Error
      .catch(() => {
        window.alert("Something went wrong, Please try again");
        setSent(false);
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
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-500 mt-1">
                Here you can find all Messages in the system
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
              <input
                type="text"
                name="search"
                placeholder="Search Messages..."
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
                      message
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      Info
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      Date
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                      Action
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
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                        {item.message}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-bold text-center">
                        {item.status == 0 ? (
                          <span className="text-red-800 bg-red-200 px-2 py-1 rounded whitespace-nowrap">
                            Not Reviewed
                          </span>
                        ) : item.status == 1 ? (
                          <span className="text-green-800 bg-green-200 px-1 rounded">
                            Reviewed
                          </span>
                        ) : (
                          <span className="text-yellow-800 bg-yellow-200 px-1 rounded">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 justify-center items-center">
                          <p>
                            {item.f_name} - {item.l_name}
                          </p>
                          <p>{item.contact}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            if (!sent) {
                              updateHandler(item.id);
                            }
                          }}
                          className="bg-main-color px-2 py-1 text-white rounded"
                        >
                          {sent ? "updating..." : "update"}
                        </button>
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
        </div>
      </section>
    </>
  );
}

export default MessageController;
