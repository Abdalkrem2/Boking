import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ar, enUS } from "../../../../translation";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { useSession } from "next-auth/react";
function Profile() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const categoryId = router.query.id;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [categoryData, setCategoryData] = useState<any>("");
  const [message, setMessage] = useState<any>(false);
  const [number, setNumber] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [nameAr, setNameAr] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  useEffect(() => {
    if (db_link === "") return;
    axios
      .get(`${db_link}api/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        const data = res.data[0];
        setCategoryData(data);
        setName(data.name);
        setNameAr(data.nameAr);
        setOrder(data.order);
        setLoading(false);
      })
      .catch((error) => {
        router.push("/");
      });
  }, [categoryId, number, db_link]);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  const [showForm, setShowForm] = useState(false);
  const [backError, setBackError] = useState<any>(false);
  const [requestSent, setRequestSent] = useState(false);
  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const fData = new FormData();
    fData.append("_method", "PUT");
    fData.append("name", e.target[0].value);
    fData.append("nameAr", e.target[1].value);
    fData.append("order", e.target[2].value);

    axios
      .post(`${db_link}api/categories/edit/${categoryId}`, fData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setRequestSent(false);
        if (res.data.errors) {
          setBackError(res.data.errors);
          setMessage(false);
        } else {
          setBackError(false);
          if (t == enUS) {
            setMessage(t.theDataUpdated);
          }
          window.scroll(0, 0);
          e.target.reset();
          setNumber(number + 1);
        }
      });
  };
  const changeNameHandler = (e: any) => {
    setName(e.target.value);
  };
  const changeNameArHandler = (e: any) => {
    setNameAr(e.target.value);
  };
  const changeOrderHandler = (e: any) => {
    setOrder(e.target.value);
  };
  const [showDelete, setShowDelete] = useState(false);
  const areYouSureHandler = () => {
    if (confirm(t.areYouSureToDeleteCategory)) {
      axios
        .delete(`${db_link}api/categories/delete/${categoryId}`, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        })
        .then(() => {
          router.push("/admin/category");
        })
        .catch(() => {
          setMessage(t.somethingWentWrong);
        });
    }
  };
  return (
    <>
      <Head>
        <title>Category {categoryId}</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section className="sm:px-10 md:px-20 lg:px-32 py-10 bg-white">
        <div>
          {loading ? (
            "loading"
          ) : (
            <>
              {/* message */}
              {message == t.theDataUpdated && (
                <p className="w-full bg-green-400/40 rounded text-center py-2 my-2">
                  {message}
                </p>
              )}
              {message == t.somethingWentWrong && (
                <p className="w-full bg-red-400/40 rounded text-center py-2 my-2">
                  {message}
                </p>
              )}
              {/* category details */}
              <div className="flex flex-col-reverse items-center text-center sm:text-start sm:flex-row sm:justify-between gap-5">
                <div className="basis-1/2">
                  <h1 className="text-3xl mb-3">
                    <Link
                      href={"/admin/category"}
                      className="text-main-color hover:text-secondary-color"
                    >
                      Category
                    </Link>
                    : {categoryData.name}
                  </h1>
                  <p className="text-secondary-text mb-2">
                    Name: {categoryData.name}
                  </p>
                  <p className="text-secondary-text mb-2 ">
                    <span>NameAr</span>: {categoryData.nameAr}
                  </p>
                  <p className="text-secondary-text mb-2 ">
                    <span>{t.order}</span>: {categoryData.order}
                  </p>
                </div>
              </div>

              {/* --update category form section-- */}
              <div
                className="border-t mt-4 pt-3"
                dir={t == enUS ? "ltr" : "rtl"}
              >
                <h2 className="w-full flex justify-start gap-2 items-center text-lg font-bold mb-2 ltr:font-rorboto rtl:font-notoKufi">
                  {t.edit}{" "}
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
                    className={`flex flex-col gap-4 w-full md:w-1/2 items-center sm:items-start sm:rtl:items-end mb-2`}
                  >
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="name" className="text-xl w-fit">
                        {t.categoryForm}{" "}
                        <span className="text-sm font-rorboto">(En)</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={changeNameHandler}
                        placeholder="Electronics"
                        className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="nameAr" className="text-xl w-fit">
                        {t.categoryForm}{" "}
                        <span className="text-sm font-rorboto">(Ar)</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="nameAr"
                        id="nameAr"
                        value={nameAr}
                        onChange={changeNameArHandler}
                        placeholder="الإلكترونيات"
                        className="h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid font-notoKufi"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="order" className="text-xl w-fit">
                        {t.order}
                      </label>
                      <input
                        required
                        type="number"
                        name="order"
                        id="order"
                        value={order}
                        onChange={changeOrderHandler}
                        placeholder="2"
                        className="h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid font-notoKufi"
                      />
                    </div>
                    <div className="flex justify-center sm:justify-start gap-8 px-2 pb-4 w-full">
                      <button
                        type="submit"
                        disabled={requestSent ? true : false}
                        className={`transition-all text-gray-200 rounded px-10 py-2 font-bold bg-main-color`}
                      >
                        {t.update}
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

              {/* --delete category section-- */}
              <div
                className="border-t mt-4 pt-3"
                dir={t == enUS ? "ltr" : "rtl"}
              >
                <h2 className="w-full flex justify-start gap-2 items-center text-lg font-bold mb-2 ltr:font-rorboto rtl:font-notoKufi">
                  {t.delete}{" "}
                  <button
                    onClick={() => {
                      if (showDelete) {
                        setShowDelete(false);
                      } else {
                        setShowDelete(true);
                      }
                    }}
                    className={`bg-red-500 p-1 rounded-full text-white ${
                      showDelete ? "rotate-180" : "rotate-0"
                    } transition-all hover:bg-red-400`}
                  >
                    <IoIosArrowDown />
                  </button>
                </h2>
                {showDelete && (
                  <p>
                    <button
                      onClick={areYouSureHandler}
                      className="bg-red-500 text-white p-2 rounded ltr:font-rorboto rtl:font-notoKufi"
                    >
                      {t.deleteCategory}
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Profile;
