import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { enUS, ar } from "../../../translation";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/lazy";
import "swiper/css/pagination";
import Image from "next/image";
import { useSession } from "next-auth/react";
function Profile() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const orderId = router.query.id;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [items, setItems] = useState<any>("");
  const [data, setData] = useState<any>("");
  const [locations, setLocations] = useState<any>([]);
  const [date, setDate] = useState<any>(["", "", "", "", "", ""]);
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
    if (orderId && session?.user.token) {
      const url = `${db_link}api/orders/${orderId}`;
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        })
        .then((res) => {
          setData(res.data.order);
          setLocations(res.data.locations);

          const details =
            typeof res.data.order.details === "string"
              ? JSON.parse(res.data.order.details)
              : res.data.order.details;

          const date = new Date(res.data.order.created_at);
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

          setDate([formattedDate, formattedTime]);
          setItems(details);
          setLoading(false);
        });
    }
  }, [orderId, session?.user.token, db_link]);
  return (
    <>
      <Head>
        <title>order {orderId}</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section
        dir={t == enUS ? "ltr" : "rtl"}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div>
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
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 pb-4 border-b">
                  {t.orderNumber}:{" "}
                  <span className="text-main-color">{data.id}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="flex justify-between items-center">
                      <span className="font-semibold">{t.finalPrice}:</span>
                      <span className="flex items-center gap-2">
                        {data.coupon && (
                          <span className="text-sm text-gray-400 line-through">
                            JD {(data.total + data.charges).toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-green-600">
                          JD{" "}
                          {(data.coupon
                            ? data.prev_price + data.charges
                            : data.total + data.charges
                          ).toFixed(2)}
                        </span>
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="font-semibold">{t.price}:</span>
                      <span className="flex items-center gap-2">
                        {data.coupon && (
                          <span className="text-sm text-gray-400 line-through">
                            JD {data.total.toFixed(2)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-green-600">
                          JD{" "}
                          {(data.coupon ? data.prev_price : data.total).toFixed(
                            2
                          )}
                        </span>
                      </span>
                    </p>
                    {data.charges && (
                      <p className="flex justify-between items-center">
                        <span className="font-semibold">{t.charges}:</span>
                        <span className="text-gray-600">JD {data.charges}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-3">
                      <span className="font-medium">{t.location}:</span>
                      {t == enUS ? (
                        <span>
                          {locations.find(
                            (loc: any) => loc.id === data.location_id
                          )?.name || "N/A"}
                        </span>
                      ) : (
                        <span>
                          {locations.find(
                            (loc: any) => loc.id === data.location_id
                          )?.nameAr || "N/A"}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="flex justify-between items-center">
                      <span className="font-semibold">{t.orderDate}:</span>
                      <span className="text-gray-600">
                        {`${date[0]} at ${date[1]}`}
                      </span>
                    </p>

                    {data.coupon && (
                      <p className="flex justify-between items-center">
                        <span className="font-semibold">{t.coupon}:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {data.coupon}
                        </span>
                      </p>
                    )}

                    <p className="flex justify-between items-center">
                      <span className="font-semibold">{t.paymentMethod}:</span>
                      <span className="text-gray-600">
                        {data.method == 0
                          ? t.payOnDelivery
                          : data.method == 1
                          ? t.debtCard
                          : t.payPal}
                      </span>
                    </p>

                    <p className="flex justify-between items-center">
                      <span className="font-semibold">{t.orderState}:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
    ${
      data.state === 0
        ? "bg-yellow-100 text-yellow-800"
        : data.state === 1
        ? "bg-blue-100 text-blue-800"
        : data.state === 2
        ? "bg-yellow-100 text-yellow-800"
        : data.state === 3
        ? "bg-green-100 text-green-800"
        : data.state === 4
        ? "bg-red-100 text-red-800"
        : data.state === 5
        ? "bg-green-100 text-green-800"
        : data.state === 6
        ? "bg-red-100 text-red-800"
        : data.state === 7
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800"
    }`}
                      >
                        {data.state == 0
                          ? t.waitingForReview
                          : data.state == 1
                          ? t.preparation
                          : data.state == 2
                          ? t.readyForDelivery
                          : data.state == 3
                          ? t.shipping
                          : data.state == 4
                          ? t.delivered
                          : data.state == 5
                          ? t.finished
                          : data.state == 6
                          ? t.canceled
                          : data.state == 7
                          ? t.rejected
                          : "!"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 `}
              >
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <Link
                      href={`/product/${item.product_id}`}
                      className="block relative h-32 w-full"
                    >
                      <Image
                        src={`${db_link}img/products/${item.image}`}
                        unoptimized={true}
                        alt="item image"
                        fill
                        loading="lazy"
                        className="object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold mb-1.5">
                        {t === enUS ? item.name : item.nameAr}
                        <span className="ml-1.5 text-main-color">
                          ×{item.quantity}
                        </span>
                      </h3>
                      <div className="space-y-1.5 text-sm text-gray-600">
                        {/* <p className="flex justify-between">
                          <span>{t.color}:</span>
                          <span className="font-medium">{item.color}</span>
                        </p>
                        <p className="flex justify-between">
                          <span>{t.size}:</span>
                          <span className="font-medium">
                            {item.size == "X0"
                              ? "XS"
                              : item.size == "S"
                              ? "S"
                              : item.size == "M"
                              ? "M"
                              : item.size == "L"
                              ? "L"
                              : item.size == "X1"
                              ? "Xl"
                              : item.size == "X2"
                              ? "2Xl"
                              : item.size == "normal"
                              ? "normal"
                              : "??"}
                          </span>
                        </p> */}
                        <p className="flex justify-between items-center pt-1.5 border-t">
                          <span>{t.price}:</span>
                          <span className="text-base font-bold text-green-600">
                            JD
                            {item.discounted_price == item.price
                              ? (item.price * item.quantity).toFixed(2)
                              : (item.discounted_price * item.quantity).toFixed(
                                  2
                                )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Profile;
