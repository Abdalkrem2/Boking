import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
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
  const [products, setProducts] = useState({
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
    if (!session?.user.token) return;
    if (!searching) {
      setIsLoading(true);
      const url = `${db_link}api/halls?page=${page}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        .then((res) => {
          setProducts(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          router.push("/");
        });
    }
  }, [page, db_link, session?.user.token]);
  useEffect(() => {
    if (db_link === "") return;
    if (searching) {
      const value = searchInput;
      setIsLoading(true);
      const url = `${db_link}api/admin/search/halls?page=${pageSearch}`;
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
          setProducts(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, [pageSearch]);
  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearching(true);
    const value = e.target[0].value;
    setSearchInput(e.target[0].value);
    setIsLoading(true);
    const url = `${db_link}api/admin/search/products?page=${page}`;
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
        setProducts(res.data);
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
        <title>Halls</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section
        className="sm:px-10 sm:pt-2 md:pt-5 bg-white"
        dir={t == enUS ? "ltr" : "rtl"}
      >
        <div className={`${t == enUS ? "font-rorboto" : "font-notoKufi"}`}>
          {/* heading section */}
          <div className="flex sm:justify-between sm:flex-row gap-5 my-4 mx-2 flex-col justify-center items-center">
            <div>
              <h1 className="text-xl font-bold text-main-color">{t.hall}</h1>
            </div>
            <form
              onSubmit={handleSearch}
              className="border flex h-fit w-fit rounded overflow-hidden"
            >
              <input
                type="text"
                name="search"
                placeholder={t == enUS ? "Product" : "المنتج"}
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
          {/* add category successfully */}
          {/* table section */}
          <div className="overflow-x-scroll overflow-y-hidden w-full">
            <table className="w-full">
              <thead className="border-b-2 w-full">
                <tr>
                  <th>ID</th>
                  <th>Main ID</th>
                  <th>{t.event} ID</th>
                  <th>{t.nameEn}</th>
                  <th>{t.nameAr}</th>
                  <th>{t.state}</th>
                  <th>{t.edit}</th>
                </tr>
              </thead>
              {!isLoading ? (
                <tbody className="w-full">
                  {products.data.map((product: any, i: number) => {
                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-200 transition-all mb-2 ${
                          i % 2 == 0 && "bg-gray-100"
                        }`}
                      >
                        <td className="px-2  text-center p-3">{product.id}</td>
                        <td className="px-2  text-center p-3 text-blue-600 font-bold underline">
                          <Link
                            href={`/admin/main_halls/${product.main_hall_id}`}
                          >
                            {product.main_hall_id}
                          </Link>
                        </td>
                        <td className="px-2  text-center p-3 text-blue-600 font-bold underline">
                          <Link href={`/admin/products/${product.product_id}`}>
                            {product.product_id}
                          </Link>
                        </td>
                        <td className="px-2 whitespace-nowrap text-center font-rorboto">
                          {product.name}
                        </td>
                        <td className="px-2 whitespace-nowrap text-center font-notoKufi">
                          {product.nameAr}
                        </td>
                        <td className="px-2 whitespace-nowrap text-center ">
                          {product.state == 0 ? (
                            <span className="bg-green-100 p-1 rounded">
                              {" "}
                              {t.available}
                            </span>
                          ) : product.state == 1 ? (
                            <span className="bg-red-100 p-1 rounded">
                              {" "}
                              {t.outOfTickets}
                            </span>
                          ) : (
                            <span className="bg-red-100 p-1 rounded">
                              {" "}
                              {t.notActive}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-3 flex justify-center">
                          <Link
                            href={`/admin/halls/${product.id}`}
                            className="w-20 bg-sky-500 hover:bg-sky-400 text-white px-2 py-1 rounded transition-all text-sm block text-center"
                          >
                            <FaPencilAlt className="inline" /> {t.edit}
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
              pageCount={Math.ceil(products.total / 25)}
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
