import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
function historiesControl() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSearch, setPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [histories, setHistories] = useState({
    data: ["Array", " Array"],
    current_page: 0,
    per_page: 0,
    total: 0,
  });
  const [searching, setSearching] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (db_link === "") return;
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/");
      }
      return;
    }
    if (session.user.role != 0) {
      router.push("/");
    }
    if (!searching) {
      setIsLoading(true);
      const url = `${db_link}api/history?page=${page}`;
      const token = session.user.token;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data == "you are not allowed here") {
            router.push("/");
          }
          setHistories(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          router.push("/");
        });
    }
  }, [page, status, db_link]);
  useEffect(() => {
    if (db_link === "") return;
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/");
      }
      return;
    }
    if (session.user.role != 0) {
      router.push("/");
    }
    if (searching) {
      const value = searchInput;
      setIsLoading(true);
      const url = `${db_link}api/search/history?page=${pageSearch}`;
      const token = session.user.token;
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
        .then((res) => {
          setHistories(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [pageSearch, db_link]);
  const handleSearch = (e: any) => {
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/");
      }
      return;
    }
    if (session.user.role != 0) {
      router.push("/");
    }
    e.preventDefault();
    setSearching(true);
    const value = e.target[0].value;
    setSearchInput(e.target[0].value);
    setIsLoading(true);
    const url = `${db_link}api/search/history?page=${page}`;
    const token = session.user.token;
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
      .then((res) => {
        setHistories(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    if (searching) {
      setPageSearch(selectedItem.selected + 1);
    } else {
      setPage(selectedItem.selected + 1);
    }
  };
  return (
    <>
      <Head>
        <title>History</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-b">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">History</h1>
              <p className="text-sm text-gray-500 mt-1">This is all history</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
              <input
                type="text"
                name="search"
                placeholder="Action, id, admin_id"
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
                      Admin
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">
                      Action
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {histories.data.map((history: any, i: number) => (
                    <tr
                      key={history.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {history.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <Link
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          href={`/admin/stuff/${history.user_id}`}
                        >
                          {history.user_id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {history.action}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          new Date(history.created_at).getTime() +
                            3 * 60 * 60 * 1000
                        ).toLocaleString("en-US", { timeZone: "GMT" })}
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
              pageCount={Math.ceil(histories.total / 100)}
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

export default historiesControl;
