import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ar, enUS } from "../../../translation";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
function Orders() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session, status } = useSession();
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any>([]);
  const [locations, setLocations] = useState<any>([]);
  useEffect(() => {
    if (db_link === "") return;
    setLoading(true);
    if (status == "authenticated") {
      axios
        .get(`${db_link}api/orders/user/${session?.user.id}`, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        })
        .then((res) => {
          setItems(res.data.orders);
          setLocations(res.data.locations);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [status, db_link]);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  const [waiting, setWaiting] = useState(false);
  function activeOrder(id: number) {
    setWaiting(true);

    axios
      .get(`${db_link}api/orders/toggle/${id}`, {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })
      .then((res) => {
        setWaiting(false);
      });
  }
  function cancelOrder(id: number) {
    setWaiting(true);

    axios
      .get(`${db_link}api/orders/toggle/${id}`, {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })
      .then((res) => {
        setWaiting(false);
      });
  }
  return (
    <section
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 sm:px-10 md:px-20 lg:px-32 py-8 md:py-12"
      dir={t == enUS ? "ltr" : "rtl"}
    >
      <h1 className="font-bold text-4xl mb-10 text-gray-800 tracking-tight">
        {t.yourOrders}
      </h1>

      <div className="w-full flex flex-col gap-4">
        {loading ? (
          <div className="relative h-56 w-full flex flex-col justify-center items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-100 border-t-main-color border-r-main-color rounded-full animate-spin" />
              <div className="w-14 h-14 border-4 border-gray-100 border-t-main-color rounded-full animate-[spin_1.5s_linear_infinite] absolute top-3 left-3" />
              <div className="w-8 h-8 border-3 border-gray-100 border-b-main-color rounded-full animate-[spin_2s_linear_infinite] absolute top-6 left-6" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-600 font-medium text-lg animate-pulse">
                {t.loading}
              </p>
              <span className="animate-[bounce_1s_infinite_0ms]">.</span>
              <span className="animate-[bounce_1s_infinite_200ms]">.</span>
              <span className="animate-[bounce_1s_infinite_400ms]">.</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="mb-6">
              <svg
                className="w-20 h-20 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1
              className={`text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center`}
            >
              {t.noOrdersYet}
            </h1>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 text-sm font-medium text-white transition-all duration-200 transform bg-main-color rounded-full hover:bg-secondary-color hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main-color"
            >
              {t.nothingInCart2}
            </Link>
          </div>
        ) : (
          items.map((item: any) => {
            const date = new Date(item.created_at);
            const jordanDate = new Date(date.getTime() + 60 * 1000);

            const formattedDate = jordanDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            const formattedTime = jordanDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Amman",
            });

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row justify-between p-6 sm:p-8">
                  {/* Order Details Section */}
                  <div className="flex flex-col gap-4 flex-grow">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        #{item.id}
                      </h3>
                      {/* Status badges with updated styling */}

                      {item.state == 0 ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                          {t.waitingForReview}
                        </span>
                      ) : item.state == 1 ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {t.preparation}
                        </span>
                      ) : item.state == 2 ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                          {t.readyForDelivery}
                        </span>
                      ) : item.state == 3 ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {t.shipping}
                        </span>
                      ) : item.state == 4 ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          {t.delivered}
                        </span>
                      ) : item.state == 5 ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          {t.finished}
                        </span>
                      ) : item.state == 6 ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          {t.canceled}
                        </span>
                      ) : item.state == 7 ? (
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          {t.rejected}
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          !
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <p className="flex items-center gap-3">
                        <span className="font-medium">{t.finalPrice}:</span>
                        {item.coupon ? (
                          <span className="flex items-center gap-2">
                            <span className="text-gray-400 line-through">
                              JD {(item.total + item.charges).toFixed(2)}
                            </span>
                            <span className="text-xl font-bold text-gray-900">
                              JD {(item.prev_price + item.charges).toFixed(2)}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            JD {(item.total + item.charges).toFixed(2)}
                          </span>
                        )}
                      </p>

                      <p className="flex items-center gap-3">
                        <span className="font-medium">{t.orderDate}:</span>
                        <span>{`${formattedDate} at ${formattedTime}`}</span>
                      </p>
                      <p className="flex items-center gap-3">
                        <span className="font-medium">{t.location}:</span>
                        {t == enUS ? (
                          <span>
                            {locations.find(
                              (loc: any) => loc.id === item.location_id
                            )?.name || "N/A"}
                          </span>
                        ) : (
                          <span>
                            {locations.find(
                              (loc: any) => loc.id === item.location_id
                            )?.nameAr || "N/A"}
                          </span>
                        )}
                      </p>
                      {item.coupon && (
                        <p className="flex items-center gap-3">
                          <span className="font-medium">{t.coupon}:</span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                            {item.coupon}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex flex-col sm:flex-col justify-start gap-3 mt-6 sm:mt-0 w-full sm:w-auto">
                    <Link
                      href={`/orders/${item.id}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-main-color text-white font-medium hover:bg-secondary-color hover:scale-105 transition-all duration-200 min-w-[130px]"
                    >
                      <span>{t.details}</span>
                    </Link>

                    <Link
                      href={`/about#contact`}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-yellow-500 text-white font-medium hover:bg-yellow-400 hover:scale-105 transition-all duration-200 min-w-[130px]"
                    >
                      <span>{t.contactUs}</span>
                    </Link>

                    {item.state == 0 ? (
                      <button
                        onClick={() => {
                          if (!waiting) {
                            cancelOrder(item.id);
                            item.state = 6;
                          }
                        }}
                        disabled={waiting}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-red-500 text-white font-medium hover:bg-red-400 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-200 min-w-[130px]"
                      >
                        <span>{t.cancelOrder}</span>
                      </button>
                    ) : (
                      item.state == 6 && (
                        <button
                          onClick={() => {
                            if (!waiting) {
                              activeOrder(item.id);
                              item.state = 0;
                            }
                          }}
                          disabled={waiting}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-green-500 text-white font-medium hover:bg-green-400 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all duration-200 min-w-[130px]"
                        >
                          <span>{t.activeOrder}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default Orders;
