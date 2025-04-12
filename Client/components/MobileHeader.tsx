import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsCardText, BsUiRadiosGrid } from "react-icons/bs";
import {
  FaBox,
  FaHeart,
  FaHome,
  FaIdCard,
  FaSearch,
  FaUserAlt,
  FaUserCircle,
  FaUserTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { HiOutlinePhone } from "react-icons/hi";
import { TbDashboard } from "react-icons/tb";
function MobileHeader() {
  const router = useRouter();
  const currentRouter: string = router.pathname;
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showAccount, setShowAccount] = useState(false);
  const { data: session, status } = useSession();
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  const searchFormShow = () => {
    setShowForm(!showForm);
  };
  const searchHandler = (e: any) => {
    e.preventDefault();
    setShowForm(!showForm);
    router.push(`/search/${e.target[0].value}`);
  };
  return (
    <>
      <div
        className={`${
          showForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        } fixed inset-0 bg-black/60 backdrop-blur-sm z-50 sm:hidden transition-all duration-300 flex items-center justify-center`}
      >
        <form
          onSubmit={searchHandler}
          className="w-[90%] max-w-md mx-auto bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="w-full">
            <input
              dir={t == enUS ? "ltr" : "rtl"}
              type="text"
              name="name"
              id="name"
              placeholder={
                t == enUS ? "Search products..." : "البحث عن المنتجات..."
              }
              className="w-full h-12 px-4 rounded-xl bg-white/10 border-2 border-white/30 
                focus:border-main-color/60 outline-none text-white placeholder:text-gray-300
                transition-all duration-300"
              required
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 bg-main-color hover:bg-secondary-color text-complement-color font-bold
                py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-main-color/20"
              type="submit"
            >
              {t.search}
            </button>
            <button
              onClick={searchFormShow}
              type="button"
              className="flex-1 bg-gray-500/50 hover:bg-gray-500/70 text-white font-medium
                py-3 rounded-xl transition-all duration-300"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-gray-800
        py-3 z-10 sm:hidden"
      >
        {session?.user.role == 0 ? (
          <ul className={` grid grid-cols-5 px-1 items-center`}>
            <li>
              <Link
                href="/"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <FaHome
                    className={`text-2xl ${
                      currentRouter === "/"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/" ? "text-main-color" : "text-gray-200"
                  } text-xs font-medium `}
                >
                  {t.home}
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <BsCardText
                    className={`text-2xl ${
                      currentRouter === "/admin/orders"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/admin/orders"
                      ? "text-main-color"
                      : "text-gray-200"
                  } text-xs font-medium `}
                >
                  Card
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <TbDashboard
                    className={`text-2xl ${
                      currentRouter === "/admi"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/admin"
                      ? "text-main-color"
                      : "text-gray-200"
                  } text-xs font-medium `}
                >
                  Admin
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/nets"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <FaIdCard
                    className={`text-2xl ${
                      currentRouter === "/admin/nets"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/admin/nets"
                      ? "text-main-color"
                      : "text-gray-200"
                  } text-xs font-medium `}
                >
                  KNet
                </span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  searchFormShow();
                }}
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <FaSearch
                    className={`text-2xl ${
                      currentRouter === "/search/[name]"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/search/[name]"
                      ? "text-main-color"
                      : "text-gray-200"
                  } text-xs font-medium `}
                >
                  {t.search}
                </span>
              </button>
            </li>
          </ul>
        ) : session?.user.role == 1 ? (
          <ul className={` grid grid-cols-5 px-1 items-center`}>
            <li>
              <Link
                href="/"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <FaHome
                    className={`text-2xl ${
                      currentRouter === "/"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/" ? "text-main-color" : "text-gray-200"
                  } text-xs font-medium `}
                >
                  {t.home}
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <BsCardText
                    className={`text-2xl ${
                      currentRouter === "/admin/orders"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/admin/orders"
                      ? "text-main-color"
                      : "text-gray-200"
                  } text-xs font-medium `}
                >
                  Card
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <TbDashboard
                    className={`text-2xl ${
                      currentRouter === "/admi"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/admin"
                      ? "text-main-color"
                      : "text-gray-200"
                  } text-xs font-medium `}
                >
                  Admin
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/nets"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <FaIdCard
                    className={`text-2xl ${
                      currentRouter === "/admin/nets"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/admin/nets"
                      ? "text-main-color"
                      : "text-gray-200"
                  } text-xs font-medium `}
                >
                  KNet
                </span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  searchFormShow();
                }}
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/80">
                  <FaSearch
                    className={`text-2xl ${
                      currentRouter === "/search/[name]"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/search/[name]"
                      ? "text-main-color"
                      : "text-gray-200"
                  } text-xs font-medium `}
                >
                  {t.search}
                </span>
              </button>
            </li>
          </ul>
        ) : session?.user.role == 2 ? (
          <ul className={` flex justify-around px-1 items-center`}>
            <li>
              <Link
                href="/"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/90">
                  <FaHome
                    className={`text-2xl ${
                      currentRouter === "/"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/" ? "text-main-color" : "text-gray-200"
                  } text-xs font-medium `}
                >
                  {t.home}
                </span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  searchFormShow();
                  setShowAccount(false);
                }}
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-main-color/90">
                  <FaSearch className={`text-2xl text-complement-color`} />
                </div>
              </button>
            </li>
            <li>
              {!session?.user.id ? (
                <button
                  onClick={() => signIn()}
                  className="flex flex-col items-center gap-1 transition-colors duration-300"
                >
                  <div className="relative p-2 rounded-full bg-complement-color/90">
                    <FaUserCircle className="text-2xl text-main-color" />
                  </div>
                  <span className="text-xs font-medium text-gray-200 whitespace-nowrap">
                    {t.login}
                  </span>
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowAccount(!showAccount)}
                    className="flex flex-col items-center gap-1 w-full"
                  >
                    <div
                      className="relative h-9 w-9 rounded-full bg-main-color 
                    flex items-center justify-center text-complement-color font-medium"
                    >
                      {session.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`${
                        currentRouter === "/profile"
                          ? "text-main-color"
                          : "text-gray-200"
                      } text-xs font-medium `}
                    >
                      {t.account}
                    </span>
                  </button>
                  <div
                    className={`${
                      showAccount
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    } absolute bottom-full right-0 mb-2 w-48 bg-white rounded-2xl shadow-xl 
                  border border-gray-100 transition-all duration-300`}
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setShowAccount(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <FaUserAlt className="text-main-color" />
                        <span className="text-sm">{t.profile}</span>
                      </Link>
                      <Link
                        href="/wishList"
                        onClick={() => setShowAccount(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <FaHeart className="text-main-color" />
                        <span className="text-sm">{t.wishList}</span>
                      </Link>

                      <button
                        onClick={() => {
                          if (confirm(t.areYouSureLogout)) {
                            signOut();
                          }
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors w-full"
                      >
                        <FaUserTimes className="text-red-500" />
                        <span className="text-sm text-red-500">{t.logout}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          </ul>
        ) : (
          <ul className={` flex justify-around px-1 items-center`}>
            <li>
              <Link
                href="/"
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-complement-color/90">
                  <FaHome
                    className={`text-2xl ${
                      currentRouter === "/"
                        ? "text-secondary-color"
                        : "text-main-color"
                    }`}
                  />
                </div>
                <span
                  className={`${
                    currentRouter === "/" ? "text-main-color" : "text-gray-200"
                  } text-xs font-medium `}
                >
                  {t.home}
                </span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  searchFormShow();
                  setShowAccount(false);
                }}
                className="flex flex-col items-center gap-1 transition-colors duration-300"
              >
                <div className="relative p-2 rounded-full bg-main-color/90">
                  <FaSearch className={`text-2xl text-complement-color`} />
                </div>
              </button>
            </li>
            <li>
              {!session?.user.id ? (
                <button
                  onClick={() => signIn()}
                  className="flex flex-col items-center gap-1 transition-colors duration-300"
                >
                  <div className="relative p-2 rounded-full bg-complement-color/90">
                    <FaUserCircle className="text-2xl text-main-color" />
                  </div>
                  <span className="text-xs font-medium text-gray-200 whitespace-nowrap">
                    {t.login}
                  </span>
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowAccount(!showAccount)}
                    className="flex flex-col items-center gap-1 w-full"
                  >
                    <div
                      className="relative h-9 w-9 rounded-full bg-main-color 
                  flex items-center justify-center text-complement-color font-medium"
                    >
                      {session.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`${
                        currentRouter === "/profile"
                          ? "text-main-color"
                          : "text-gray-200"
                      } text-xs font-medium `}
                    >
                      {t.account}
                    </span>
                  </button>
                  <div
                    className={`${
                      showAccount
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    } absolute bottom-full right-0 mb-2 w-48 bg-white rounded-2xl shadow-xl 
                border border-gray-100 transition-all duration-300`}
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setShowAccount(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <FaUserAlt className="text-main-color" />
                        <span className="text-sm">{t.profile}</span>
                      </Link>
                      <Link
                        href="/wishList"
                        onClick={() => setShowAccount(false)}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <FaHeart className="text-main-color" />
                        <span className="text-sm">{t.wishList}</span>
                      </Link>

                      <button
                        onClick={() => {
                          if (confirm(t.areYouSureLogout)) {
                            signOut();
                          }
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-colors w-full"
                      >
                        <FaUserTimes className="text-red-500" />
                        <span className="text-sm text-red-500">{t.logout}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          </ul>
        )}
      </div>
    </>
  );
}

export default MobileHeader;
