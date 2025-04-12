import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { enUS, ar } from "../../../../translation";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { useSession } from "next-auth/react";
function SingleCoupon() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const couponId = router.query.id;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  const [theState, setTheState] = useState<string | number>(0);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [data, setData] = useState<any>("");

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
    setLoading(true);
    if (couponId) {
      const url = `${db_link}api/admin/code/${couponId}`;
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        })
        .then((res) => {
          setData(res.data);

          setTheState(res.data.state);
          setLoading(false);
        })
        .catch(() => {
          router.push("/");
        });
    }
  }, [couponId, db_link]);
  const changeStateHandler = () => {
    const url = `${db_link}api/code/toggle/${couponId}`;
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })
      .then((res) => {
        if (res.data == "updated") {
          setMessage(t.theDataUpdated);
        } else {
          setMessage(t.somethingWentWrong);
        }
      })
      .catch(() => {
        setMessage(t.somethingWentWrong);
      });
  };
  const [showDelete, setShowDelete] = useState(false);
  const areYouSureHandler = () => {
    if (confirm(t.areYouSureToDeleteCoupon)) {
      axios
        .delete(`${db_link}api/code/${couponId}`, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        })
        .then(() => {
          router.push("/admin/coupons");
        })
        .catch(() => {
          setMessage(t.somethingWentWrong);
        });
    }
  };
  return (
    <>
      <Head>
        <title>coupon {couponId}</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section
        dir={t == enUS ? "ltr" : "rtl"}
        className="sm:px-10 md:px-20 lg:px-32 sm:mt-2 md:mt-5 "
      >
        <h1 className="text-3xl font-bold">
          <Link href="/admin/coupons" className="text-main-color ">
            {t.coupon}:
          </Link>{" "}
          {data.code}
        </h1>
        <div>
          {loading ? (
            <div className="relative h-96">
              <div
                className="absolute left-1/2 top-1/2 spinner animate-spin inline-block w-16 h-16 border-t-4  border-main-color rounded-full"
                role="status"
              >
                <span className="visually-hidden"></span>
              </div>
            </div>
          ) : (
            <>
              <div className={`my-10 flex flex-wrap gap-2`}>
                {message == t.theDataUpdated ? (
                  <p className="w-full bg-green-400/40 rounded text-center py-2 my-2">
                    {message}
                  </p>
                ) : (
                  message == t.somethingWentWrong && (
                    <p className="w-full bg-red-400/40 rounded text-center py-2 my-2">
                      {message}
                    </p>
                  )
                )}
              </div>
              <div className={`my-10 flex flex-col gap-2`}>
                <h2 className="font-bold">Id : {data.id}</h2>
                <p>
                  <span className="font-bold">{t.type}:</span>{" "}
                  {data.type == "price" ? t.discount : t.percent}
                </p>
                <p>
                  <span className="font-bold">{t.times}:</span> {data.times}
                </p>
                <p>
                  <span className="font-bold">{t.value}:</span> {data.content}
                </p>
                <p>
                  <span className="font-bold">{t.min}:</span> {data.minimum}
                </p>
                <p>
                  <span className="font-bold">{t.max}:</span> {data.maximum}
                </p>
                <p>
                  <span className="font-bold">{t.state}:</span>{" "}
                  {theState == 1 ? (
                    <span className="bg-green-200 text-green-800 p-1 rounded text-sm">
                      {t.available}
                    </span>
                  ) : (
                    <span className="bg-red-200 text-red-800 p-1 rounded text-sm">
                      {t.notAvailable}
                    </span>
                  )}
                </p>
                <p className="pt-1">
                  <label htmlFor="state">{t.state}: </label>
                  <select
                    id="state"
                    defaultValue={Number(data.state)}
                    name="state"
                    required
                    onChange={(e) => {
                      setTheState(e.target.value);
                      changeStateHandler();
                    }}
                    className="px-1 py-1 outline-none bg-gray-200 dark:bg-gray-400/25 dark:text-gray-400  focus:drop-shadow rounded "
                  >
                    <option className="text-black" value={1}>
                      {t.available}
                    </option>
                    <option className="text-black" value={0}>
                      {t.notAvailable}
                    </option>
                  </select>
                </p>
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
                      {t.deleteCoupon}
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

export default SingleCoupon;
