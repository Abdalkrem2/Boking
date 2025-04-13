import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import { BiChair, BiLogOut } from "react-icons/bi";
import axios from "axios";
import {
  FaBrush,
  FaCoins,
  FaFileInvoice,
  FaHistory,
  FaIcons,
  FaMoneyBillWave,
  FaUserEdit,
  FaChartLine,
  FaMoneyCheck,
  FaBox,
  FaClipboardCheck,
  FaEnvelope,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsCheckAll } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
import { ar, enUS } from "../../../translation";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { AiOutlineBlock } from "react-icons/ai";
const CACHE_KEY = "adminData";
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

interface CachedData {
  data: any;
  timestamp: number;
}

function getCachedData(): CachedData | null {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  return JSON.parse(cached);
}

function AdminPage() {
  const { data: session, status } = useSession();
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [newOrders, setNewOrders] = useState<any>([
    { id: 1, total: "Loading...", created_at: "Loading..." },
  ]);
  const [nets, setNets] = useState<any>([
    { id: 1, total: "Loading...", created_at: "Loading..." },
  ]);
  const [data, setData] = useState<any>("");

  const fetchData = async () => {
    if (db_link === "") return;
    if (!session?.user?.token) return;

    setIsLoading(true);
    const url = `${db_link}api/adminData`;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      if (res.data === "you are not allowed here") {
        signOut();
        // router.push("/");

        return;
      }

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: res.data,
          timestamp: Date.now(),
        })
      );
      setData(res.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (db_link && session?.user?.token) {
        const url = `${db_link}api/newOrders`;
        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          })
          .then((res) => {
            setNewOrders(res.data.orders);
            setNets(res.data.nets);
          })
          .catch((er) => {
            console.log(er);
            setNewOrders([
              { id: 1, total: "Error getting new orders", created_at: "" },
            ]);
            setNets([
              { id: 1, total: "Error getting new nets", created_at: "" },
            ]);
          });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [db_link, session]);
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
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/");
      }
      return;
    }
    if (session.user.role == 1 || session.user.role == 0) {
      const cached = getCachedData();
      const now = Date.now();

      // Check if we have valid cached data
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const url = `${db_link}api/adminData`;
      const token = session.user.token;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data == "you are not allowed here") {
            // signOut();
            // router.push("/");
          }

          // Cache the new data
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              data: res.data,
              timestamp: Date.now(),
            })
          );
          setData(res.data);
          setIsLoading(false);
        })
        .catch((er) => {
          console.log(er);
          setIsLoading(false);
        });
    }
  }, [status, db_link]);
  if (isLoading == false && status == "authenticated") {
    return (
      <>
        <Head>
          <title>Admin Page</title>
          <link rel="icon" href="/logo.ico" />
        </Head>
        <section className="bg-white sm:px-10 mb-3 pt-12">
          {/* welcoming section */}
          <div className="relative mb-8">
            {/* Background Gradient Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl transform -skew-y-2"></div>

            {/* Main Content Container */}
            <div className="relative flex flex-col md:flex-row items-center justify-between p-6 md:p-8 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              {/* Welcome Section */}
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-70 group-hover:opacity-100 blur transition duration-300"></div>
                  <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-white transform group-hover:scale-105 transition duration-300">
                    <span className="text-xl font-bold text-blue-600">
                      {session.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 font-medium">
                    {t.welcomBack}
                  </span>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {session.user.name}
                  </h1>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm border border-gray-100">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem(CACHE_KEY);
                    fetchData();
                  }}
                  className="relative group bg-gradient-to-r from-blue-500 to-purple-500 p-0.5 rounded-full hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative px-4 py-2 bg-white rounded-full group-hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2">
                    <IoReload className="w-4 h-4 text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                      {t.refreshData}
                    </span>
                  </div>
                </button>
              </div>
            </div>
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
                  {t.newOrders}
                </h3>
              </div>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                {t.viewAll}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="space-y-3">
              {newOrders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors duration-200 shadow-sm"
                >
                  <span className="text-base font-medium text-gray-700">
                    {order.total}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(
                      new Date(order.created_at).getTime() + 3 * 60 * 60 * 1000
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
                </Link>
              ))}
              {newOrders.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center">
                  No new orders.
                </p>
              )}
            </div>
          </div>

          {/* New Nets */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 20l9-5-9-5-9 5 9 5z" />
                  <path d="M12 12V4l9 5" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">{t.newNets}</h3>
              </div>
              <Link
                href="/admin/nets"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                {t.viewAll}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="space-y-3">
              {nets.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/nets/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors duration-200 shadow-sm"
                >
                  <span className="text-base font-medium text-gray-700">
                    {order.total}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(
                      new Date(order.created_at).getTime() + 3 * 60 * 60 * 1000
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
                </Link>
              ))}
              {nets.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center">
                  No new nets.
                </p>
              )}
            </div>
          </div>
          {/* Main Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-400/30 rounded-lg">
                  <FaUsers className="text-2xl" />
                </div>
                <span className="text-xs bg-blue-400/30 px-2 py-1 rounded-full">
                  {t.users}
                </span>
              </div>
              <h4 className="text-2xl font-bold mt-4">{data.usersCount}</h4>
              <p className="text-blue-100 text-sm">{t.users}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-400/30 rounded-lg">
                  <FaBox className="text-2xl" />
                </div>
                <span className="text-xs bg-purple-400/30 px-2 py-1 rounded-full">
                  {t.last30d}
                </span>
              </div>
              <h4 className="text-2xl font-bold mt-4">
                {data.last30DaysOrders}
              </h4>
              <p className="text-purple-100 text-sm">{t.orderSold}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-400/30 rounded-lg">
                  <BsCheckAll className="text-2xl" />
                </div>
                <span className="text-xs bg-emerald-400/30 px-2 py-1 rounded-full">
                  {t.activeProducts}
                </span>
              </div>
              <h4 className="text-2xl font-bold mt-4">{data.activeProducts}</h4>
              <p className="text-emerald-100 text-sm">{t.activeProduct}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all shadow-lg">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-400/30 rounded-lg">
                  <FaMoneyBillWave className="text-2xl" />
                </div>
                <span className="text-xs bg-amber-400/30 px-2 py-1 rounded-full">
                  {t.last30d}
                </span>
              </div>
              <h4 className="text-2xl font-bold mt-4">
                KD {data.last30DayIncomeOrder}
              </h4>
              <p className="text-amber-100 text-sm">{t.totalProfit}</p>
            </div>
          </div>
          {/* Detailed Analytics */}

          <div className="mt-16">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {session.user.role == 0 ? (
                <div className="space-y-8">
                  {/* Navigation Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                      {
                        icon: FaHistory,
                        label: "History",
                        path: "/admin/history",
                      },
                      {
                        icon: FaUserEdit,
                        label: "Users",
                        path: "/admin/users",
                      },
                      {
                        icon: FaIcons,
                        label: "Category",
                        path: "/admin/category",
                      },
                      {
                        icon: FaBox,
                        label: "Events",
                        path: "/admin/products",
                      },

                      {
                        icon: AiOutlineBlock,
                        label: "Main Halls",
                        path: "/admin/main_halls",
                      },
                      {
                        icon: BiChair,
                        label: "Halls",
                        path: "/admin/halls",
                      },

                      {
                        icon: FaFileInvoice,
                        label: "K-Net",
                        path: "/admin/nets",
                      },
                      {
                        icon: FaFileInvoice,
                        label: "Orders",
                        path: "/admin/orders",
                      },
                      {
                        icon: FaMoneyBillWave,
                        label: "Coupons",
                        path: "/admin/coupons",
                      },
                    ].map((item, index) => (
                      <Link
                        key={index}
                        href={item.path}
                        className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200"
                      >
                        <div className="p-6 flex flex-col items-center space-y-3">
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors duration-200">
                            <item.icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                            {item.label}
                          </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-b-xl" />
                      </Link>
                    ))}
                  </div>

                  {/* Logout Button */}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to logout?")) {
                          signOut();
                        }
                      }}
                      className="inline-flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <BiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : session.user.role == 1 ? (
                <div className="space-y-8">
                  {/* Navigation Grid for Role 1 */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      {
                        icon: FaIcons,
                        label: "Category",
                        path: "/admin/category",
                      },
                      {
                        icon: BiChair,
                        label: "Halls",
                        path: "/admin/halls",
                      },
                      {
                        icon: AiOutlineBlock,
                        label: "Main Halls",
                        path: "/admin/main_halls",
                      },
                      {
                        icon: FaMoneyBillWave,
                        label: "Coupons",
                        path: "/admin/coupons",
                      },
                      {
                        icon: FaFileInvoice,
                        label: "Orders",
                        path: "/admin/orders",
                      },
                      {
                        icon: FaFileInvoice,
                        label: "K-Net",
                        path: "/admin/nets",
                      },
                      {
                        icon: FaBox,
                        label: "Events",
                        path: "/admin/products",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        onClick={() => router.push(item.path)}
                        className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200"
                      >
                        <div className="p-6 flex flex-col items-center space-y-3">
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-50 to-purple-100 group-hover:from-purple-100 group-hover:to-purple-200 transition-colors duration-200">
                            <item.icon className="w-6 h-6 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-200">
                            {item.label}
                          </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-b-xl" />
                      </div>
                    ))}
                  </div>

                  {/* Logout Button */}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to logout?")) {
                          signOut();
                        }
                      }}
                      className="inline-flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <BiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-600 font-medium">
                  Access Denied
                </div>
              )}
              <div className="mt-10"></div>
            </div>
          </div>
        </section>
      </>
    );
  } else {
    return (
      <div className="w-full h-screen flex flex-col gap-4 justify-center items-center bg-gray-50">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }
}
export default AdminPage;
