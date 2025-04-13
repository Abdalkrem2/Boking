import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ar, enUS } from "../../../../translation";
import Head from "next/head";
import { useSession } from "next-auth/react";
function ProductsControl() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSearch, setPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [orders, setOrders] = useState({
    data: ["Array", " Array"],
    current_page: 0,
    per_page: 0,
    total: 0,
  });
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  useEffect(() => {
    if (db_link === "") return;
    if (!session?.user?.token) return;
    if (!searching) {
      setIsLoading(true);
      const url = `${db_link}api/admin/nets?page=${page}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        .then((res) => {
          console.log(res);
          setOrders(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          router.push("/");
          setIsLoading(false);
        });
    }
  }, [page, db_link, session?.user?.token]);
  useEffect(() => {
    if (db_link === "") return;
    if (searching) {
      const value = searchInput;
      setIsLoading(true);
      const url = `${db_link}api/nets/search?page=${pageSearch}`;
      axios
        .post(
          url,
          { value },
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setOrders(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [pageSearch, db_link]);
  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearching(true);
    const value = e.target[0].value;
    setSearchInput(e.target[0].value);
    setIsLoading(true);
    const url = `${db_link}api/nets/search?page=${page}`;
    axios
      .post(
        url,
        { value },
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      )
      .then((res) => {
        setOrders(res.data);
        setIsLoading(false);
      })
      .catch(() => {
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
        <title>K-Nets</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section
        className="sm:px-10 sm:pt-2 md:pt-5 bg-white"
        dir={t == enUS ? "ltr" : "rtl"}
      >
        <div>
          {/* heading section */}
          <div className="flex sm:justify-between sm:flex-row gap-5 my-4 mx-2 flex-col justify-center items-center">
            <div>
              <h1 className="text-xl font-bold text-main-color">K-Net</h1>
            </div>
            <form
              onSubmit={handleSearch}
              className="border flex h-fit w-fit rounded overflow-hidden"
            >
              <input
                type="text"
                name="search"
                placeholder={t == enUS ? "order" : "الطلب"}
                className="h-8 p-2 w-40 bg-gray-100 outline-none focus:bg-gray-200 transition-all"
              />
              <button
                type="submit"
                className="h-8 w-10 text-gray-500 hover:text-gray-600 hover:bg-gray-300 transition-all bg-gray-200 flex justify-center items-center"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          {/* table section */}
          <div className="overflow-x-scroll overflow-y-hidden w-full">
            <table className="w-full">
              <thead className="border-b-2 w-full">
                <tr>
                  <th>Id</th>
                  <th>{t.name}</th>
                  <th>{t.total}</th>
                  <th>{t.phone}</th>
                  <th>{t.date}</th>
                  <th>{t.state}</th>
                  <th>{t.details}</th>
                </tr>
              </thead>
              {!isLoading ? (
                <tbody className="w-full">
                  {orders.data.map((order: any, i: number) => {
                    const date = new Date(order.created_at);
                    const day = date.getUTCDate();
                    const month = date.getUTCMonth() + 1;
                    const year = date.getUTCFullYear();
                    const hours = date.getUTCHours();
                    const minutes = date.getUTCMinutes();
                    const dateString = date.toString();
                    let timeZone = dateString.substring(
                      dateString.lastIndexOf("(") + 1,
                      dateString.lastIndexOf(")")
                    );
                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-200 transition-all mb-2 ${
                          i % 2 == 0 && "bg-gray-100"
                        }`}
                      >
                        <td className="px-2  text-center p-3">{order.id}</td>
                        <td className="px-2 whitespace-nowrap text-center font-notoKufi">
                          {order.name}
                        </td>
                        <td className="px-2 whitespace-nowrap text-center font-notoKufi">
                          {order.total}
                        </td>
                        <td className="px-2 whitespace-nowrap text-center font-rorboto">
                          {order.phone}
                        </td>
                        <td className="px-2 whitespace-nowrap text-center font-notoKufi">
                          {day}/{month}/{year} - {hours}:{minutes} - "{timeZone}
                          "
                        </td>
                        <td className="px-2 whitespace-nowrap text-center">
                          {order.status == 0 ? (
                            <span className="bg-blue-200 text-blue-800 p-1 rounded text-sm">
                              {t.waitingForReview}
                            </span>
                          ) : order.status == 1 ? (
                            <span className="bg-purple-200 text-purple-800 p-1 rounded text-sm">
                              {t.finished}
                            </span>
                          ) : order.status == 2 ? (
                            <span className="bg-red-200 text-red-800 p-1 rounded text-sm">
                              {t.canceled}
                            </span>
                          ) : (
                            order.status == 3 && (
                              <span className="bg-cyan-200 text-cyan-800 p-1 rounded text-sm">
                                N/A
                              </span>
                            )
                          )}
                        </td>

                        <td className="px-2 py-3 flex justify-center">
                          <Link
                            href={`/admin/nets/${order.id}`}
                            className="w-20 bg-sky-500 hover:bg-sky-400 text-white px-2 py-1 rounded transition-all text-sm block text-center"
                          >
                            {t.details}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <td className="relative h-44" colSpan={10}>
                  <div
                    className="absolute left-1/2 top-1/2 spinner animate-spin inline-block w-10 h-10 border-t-4  border-main-color rounded-full"
                    role="status"
                  >
                    <span className="visually-hidden"></span>
                  </div>
                </td>
              )}
            </table>
          </div>
          {/* pagination section */}
          <div>
            <ReactPaginate
              pageCount={Math.ceil(orders.total / 25)}
              previousLabel="<"
              nextLabel=">"
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              activeClassName="active"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductsControl;
