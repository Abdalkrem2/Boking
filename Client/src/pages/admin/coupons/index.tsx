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
import { useSession } from "next-auth/react";
function couponsControl() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [page, setPage] = useState(1);
  const [number, setNumber] = useState<number>(1);
  const [pageSearch, setPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [coupons, setCoupons] = useState({
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
    if (!searching) {
      setIsLoading(true);
      const url = `${db_link}api/codes?page=${page}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        .then((res) => {
          setCoupons(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          router.push("/");
        });
    }
  }, [page, number, db_link]);
  useEffect(() => {
    if (db_link === "") return;
    if (searching) {
      const value = searchInput;
      setIsLoading(true);
      const url = `${db_link}api/search/codes?page=${pageSearch}`;
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
          setCoupons(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
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
    const url = `${db_link}api/search/codes?page=${page}`;
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
        setCoupons(res.data);
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
  const [showForm, setShowForm] = useState(false);
  const [backError, setBackError] = useState<any>(false);
  const [message, setMessage] = useState<any>(false);
  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const fData = new FormData();
    fData.append("code", e.target[0].value);
    fData.append("type", e.target[1].value);
    fData.append("state", e.target[2].value);
    fData.append("times", e.target[3].value);
    fData.append("content", e.target[4].value);
    fData.append("minimum", e.target[5].value);
    fData.append("maximum", e.target[6].value);

    axios
      .post(`${db_link}api/code/add`, fData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setRequestSent(false);
        if (res.data.errors) {
          setBackError(res.data.errors);
          setMessage(false);
          window.scroll(0, document.body.scrollHeight + 20);
        } else {
          setBackError(false);
          if (t == enUS) {
            setMessage("added successfully");
          } else {
            setMessage("تم الإضافة بنجاح");
          }
          window.scroll(0, 0);
          e.target.reset();
          setNumber(number + 1);
        }
      });
  };
  return (
    <section
      className="sm:px-10 sm:mt-2 md:mt-5"
      dir={t == enUS ? "ltr" : "rtl"}
    >
      <div>
        {/* heading section */}
        <div className="flex sm:justify-between sm:flex-row gap-5 my-4 mx-2 flex-col justify-center items-center">
          <div>
            <h1 className="text-xl font-bold text-main-color">
              {t.couponTable}
            </h1>
            <p className="text-secondary-text">{t.thisIsAllCoupons}</p>
          </div>
          <form
            onSubmit={handleSearch}
            className="border flex h-fit w-fit rounded overflow-hidden"
          >
            <input
              type="text"
              name="search"
              placeholder={t == enUS ? "coupon" : "الكوبون"}
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
        {/* add coupon successfully */}
        {message && (
          <p className=" w-full bg-green-100 text-center p-2 my-5 rounded">
            {message}
          </p>
        )}
        {/* table section */}
        <div className="overflow-x-scroll overflow-y-hidden w-full">
          <table className="w-full">
            <thead className="border-b-2 w-full">
              <tr>
                <th>Id</th>
                <th>{t.coupon}</th>
                <th>{t.value}</th>
                <th>{t.times}</th>
                <th>{t.type}</th>
                <th>{t.min}</th>
                <th>{t.max}</th>
                <th>{t.state}</th>
                <th>{t.edit}</th>
              </tr>
            </thead>
            {!isLoading ? (
              <tbody className="w-full">
                {coupons.data.map((coupon: any, i: number) => {
                  return (
                    <tr
                      key={coupon.id}
                      className={`hover:bg-gray-200 transition-all mb-2 ${
                        i % 2 == 0 && "bg-gray-100"
                      }`}
                    >
                      <td className="px-2  text-center p-3">{coupon.id}</td>

                      <td className="px-2 whitespace-nowrap text-center">
                        {coupon.code}
                      </td>
                      <td className="px-2 whitespace-nowrap text-center">
                        {coupon.content}
                      </td>
                      <td className="px-2 whitespace-nowrap text-center">
                        {coupon.times}
                      </td>
                      <td className="px-2 whitespace-nowrap text-center">
                        {coupon.type == "price" ? t.discount : t.percent}
                      </td>
                      <td className="px-2 whitespace-nowrap text-center">
                        ${coupon.minimum}
                      </td>
                      <td className="px-2 whitespace-nowrap text-center">
                        ${coupon.maximum}
                      </td>
                      <td className="px-2 whitespace-nowrap text-center">
                        {coupon.state == 1 && coupon.times > 0 ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {t.active}
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                            {t.notActive}
                          </span>
                        )}
                      </td>

                      <td className="px-2 py-3 flex justify-center">
                        <Link
                          href={`/admin/coupons/${coupon.id}`}
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
              <div className="relative h-80 w-screen ">
                <div
                  className="absolute left-1/2 top-1/2 spinner animate-spin inline-block w-10 h-10 border-t-4  border-main-color rounded-full"
                  role="status"
                >
                  <span className="visually-hidden"></span>
                </div>
              </div>
            )}
          </table>
        </div>
        {/* pagination section */}
        <div>
          <ReactPaginate
            pageCount={Math.ceil(coupons.total / 25)}
            previousLabel="<"
            nextLabel=">"
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>

        {/* add coupon form section */}
        <div className="border-t mt-4 pt-3">
          <h2 className="w-full flex justify-start gap-2 items-center text-lg font-bold mb-2">
            {t.addCoupon}{" "}
            <button
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                } else {
                  setShowForm(true);
                }
              }}
              className={`bg-main-color p-1 rounded-full text-white ${
                showForm ? "rotate-180" : "rotate-0"
              } transition-all hover:bg-secondary-color`}
            >
              <IoIosArrowDown />
            </button>
          </h2>
          {showForm && (
            <form
              onSubmit={submitHandler}
              className="flex flex-col gap-4 w-full md:w-1/2 items-center sm:items-start sm:rtl:items-end mb-2"
            >
              <div className="flex flex-col gap-2 px-2 w-full">
                <label htmlFor="coupon" className="text-xl w-fit">
                  {t.coupon}
                </label>
                <input
                  required
                  type="text"
                  name="coupon"
                  id="coupon"
                  placeholder={"NEPNET2022"}
                  className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 px-2 w-full">
                <div className=" basis-1/2">
                  <label htmlFor="type" className="text-xl w-fit">
                    {t.type}:{" "}
                  </label>
                  <select
                    id="type"
                    defaultValue={1}
                    name="type"
                    required
                    className="px-1 py-1 outline-none bg-gray-200 dark:bg-gray-400/25 dark:text-gray-400  focus:drop-shadow rounded "
                  >
                    <option className="text-black" value={"price"}>
                      {t.price}
                    </option>
                    <option className="text-black" value={"percent"}>
                      {t.percent}
                    </option>
                  </select>
                </div>
                <div className=" basis-1/2">
                  <label htmlFor="state" className="text-xl w-fit">
                    {t.state}:{" "}
                  </label>
                  <select
                    id="state"
                    defaultValue={1}
                    name="state"
                    required
                    className="px-1 py-1 outline-none bg-gray-200 dark:bg-gray-400/25 dark:text-gray-400  focus:drop-shadow rounded "
                  >
                    <option className="text-black" value={1}>
                      {t.available}
                    </option>
                    <option className="text-black" value={0}>
                      {t.notAvailable}
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 px-2 w-full">
                <div className=" basis-1/2">
                  <label htmlFor="times" className="text-xl w-fit block">
                    {t.times}:
                  </label>
                  <input
                    required
                    type="number"
                    name="times"
                    id="times"
                    placeholder={"10"}
                    className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
                <div className=" basis-1/2">
                  <label htmlFor="content" className="text-xl w-fit block">
                    {t.value}:
                  </label>
                  <input
                    required
                    type="number"
                    name="content"
                    id="content"
                    placeholder={"30"}
                    className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 px-2 w-full">
                <div className=" basis-1/2">
                  <label htmlFor="min" className="text-xl w-fit block">
                    {t.min}:
                  </label>
                  <input
                    required
                    type="number"
                    name="min"
                    id="min"
                    placeholder={"50"}
                    className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
                <div className=" basis-1/2">
                  <label htmlFor="max" className="text-xl w-fit block">
                    {t.max}:
                  </label>
                  <input
                    required
                    type="number"
                    name="max"
                    id="max"
                    placeholder={"300"}
                    className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
              </div>
              <div className="flex justify-center sm:justify-start gap-8 px-2 pb-4 w-full">
                <button
                  type="submit"
                  disabled={requestSent ? true : false}
                  className={`transition-all text-gray-200 rounded px-10 py-2 font-bold bg-main-color`}
                >
                  {t.addCoupon}
                </button>
              </div>

              <ul className="w-full">
                {backError &&
                  backError.map((error: any, index: number) => {
                    return (
                      <li className="text-red-500" key={index}>
                        - {error}
                      </li>
                    );
                  })}
              </ul>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default couponsControl;
