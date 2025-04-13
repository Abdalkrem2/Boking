import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BiBasket,
  BiBox,
  BiCurrentLocation,
  BiMessage,
  BiScreenshot,
  BiSearchAlt,
} from "react-icons/bi";
import { TfiWorld } from "react-icons/tfi";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { initializeBasket } from "../src/slice/basketSlice";
import { initializeApi } from "../src/slice/apiSlice";
import { ar, enUS } from "../translation";
import { changeToArabic, changeToEnglish } from "../src/slice/langSlice";
import {
  FaBox,
  FaUserAlt,
  FaUserTimes,
  FaHistory,
  FaUsers,
  FaCoins,
  FaChalkboard,
  FaList,
  FaStar,
  FaCodepen,
  FaMoneyBill,
  FaHeart,
  FaSearch,
  FaIdCard,
} from "react-icons/fa";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
function Header() {
  const { db_link, name } = useSelector((state: RootState) => state.apiData);
  const [cartLoading, setCartLoading] = useState(true);
  const language = useSelector((state: RootState) => state.language.value);
  const dispatch = useDispatch();
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const router = useRouter();
  const [showLang, setShowLang] = useState(false);
  const { data: session, status } = useSession();
  const [activeDropdown, setActiveDropdown] = useState<
    "account" | "language" | "adminMenu" | null
  >(null);
  //API
  useEffect(() => {
    dispatch(
      initializeApi({
        id: 1,
        db_link: "https://backend.eventat.io/",
        name: "Not",
        nameAr: "Not",
      })
    );
  }, [router.pathname]);

  //get cart data
  useEffect(() => {
    if (db_link === "") return;
    setCartLoading(true);
    if (status != "loading") {
      if (status == "authenticated") {
        // For logged-in users, fetch from API
        axios
          .get(`${db_link}api/cart_data`, {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          })
          .then((res) => {
            let sum: number = 0;
            for (let i = 0; i < res.data.length; i++) {
              let item = res.data[i];
              if (item.discounted_price == item.price) {
                sum = sum + item.price * item.quantity;
              } else {
                sum = sum + item.discounted_price * item.quantity;
              }
            }
            dispatch(initializeBasket({ cart: res.data, totalCart: sum }));

            setCartLoading(false);
          })
          .catch((error) => {
            setCartLoading(false);
            signOut();
          });
      } else if (status == "unauthenticated") {
        // For non-logged in users, get data from localStorage
        const savedCart = localStorage.getItem("cart");
        const savedTotal = localStorage.getItem("cartTotal");

        if (savedCart && savedTotal) {
          dispatch(
            initializeBasket({
              cart: JSON.parse(savedCart),
              totalCart: Number(savedTotal),
            })
          );
        } else {
          // Initialize empty cart if no localStorage data
          dispatch(
            initializeBasket({
              cart: [],
              totalCart: 0,
            })
          );
        }

        setCartLoading(false);
      }
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
  const showLangHandler = () => {
    if (showLang == false) {
      setShowLang(true);
    } else {
      setShowLang(false);
    }
  };
  const languageToArabic = () => {
    dispatch(changeToArabic());
    showLangHandler();
    tHandler(ar);
  };
  const languageToEnglish = () => {
    dispatch(changeToEnglish());
    showLangHandler();
    tHandler(enUS);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown &&
        !(event.target as Element).closest(".dropdown-container")
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);
  // state
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const searchFormShow = () => {
    setShowForm(!showForm);
  };
  const searchHandler = (e: any) => {
    e.preventDefault();
    setShowForm(!showForm);
    router.push(`/search/${e.target[0].value}`);
  };
  // if current router = "/checkout/k-net" then hide the header
  if (
    router.pathname == "/checkout/knet" ||
    router.pathname == "/checkout/card-code"
  )
    return <span></span>;
  return (
    <header dir={t == enUS ? "ltr" : "rtl"} className="top-0 z-10">
      {session?.user.role == 0 ? (
        <>
          <div className="w-full z-20 bg-complement-color px-4 sm:px-10 md:px-20 lg:px-32 py-1 flex md:gap-4  justify-between rtl:flex-row-reverse">
            {/* logo */}
            <div
              className="cursor-pointer flex rtl:flex-row-reverse"
              onClick={() => router.push("/admin")}
            >
              <Link
                href={"/admin"}
                className="text-2xl font-bold text-main-color py-2 hover:scale-105 transition-all"
              >
                Eventat
              </Link>
            </div>
            {/* links */}
            <div className="flex rtl:flex-row-reverse items-center justify-end  dark:text-black-text text-white-text">
              <ul className="flex rtl:flex-row-reverse gap-6 sm:gap-5 md:gap-6 lg:gap-7 justify-end items-center">
                <li>
                  <Link
                    className="transition cursor-pointer text-white relative hidden sm:block"
                    href={`/admin/orders`}
                  >
                    <BiBox className="inline" /> <span>{t.orders}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition cursor-pointer text-white relative hidden sm:block"
                    href={`/admin/nets`}
                  >
                    <FaIdCard className="inline" /> <span>K-Net</span>
                  </Link>
                </li>

                <li>
                  <Link
                    className="transition cursor-pointer text-white relative hidden sm:block "
                    href={`/admin/products`}
                  >
                    <FaChalkboard className="inline" /> <span>{t.event}</span>
                  </Link>
                </li>
                {/* drop menu */}
                <li className="relative">
                  <p
                    className="transition cursor-pointer text-white relative hover:text-gray-200 flex items-center gap-2"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <FaList className="text-lg" />
                    <span className="font-medium">{t.allLinks}</span>
                  </p>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl pb-2 pt-8 z-50 transform transition-all duration-200 ease-in-out border border-gray-100">
                      <button
                        className="font-bold text-xl absolute top-2 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDropdown(false);
                        }}
                      >
                        ✕
                      </button>

                      <Link
                        href="/admin/users"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaUsers className="text-lg mr-3" />
                        <span>{t.users}</span>
                      </Link>
                      <Link
                        href="/admin/category"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaList className="text-lg mr-3" />
                        <span>{t.category}</span>
                      </Link>

                      <Link
                        href="/admin/coupons"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaCodepen className="text-lg mr-3" />
                        <span>{t.coupon}</span>
                      </Link>
                      <Link
                        href="/admin/slider-home"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <BiScreenshot className="text-lg mr-3" />
                        <span>{t.sliderView}</span>
                      </Link>
                    </div>
                  )}
                </li>
                <li className="relative dropdown-container z-30">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "language" ? null : "language"
                      )
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                      activeDropdown === "language"
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <TfiWorld className="text-lg text-white" />
                    <span className="text-sm text-white font-bold">
                      {t.language}
                    </span>
                    <IoIosArrowDown
                      className={`transition-transform text-white ${
                        activeDropdown === "language" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "language" && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                      <div className="p-3 bg-gray-50 border-b">
                        <p className="text-sm font-medium text-gray-700">
                          {t.selectLanguage}
                        </p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={languageToArabic}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="arabic flag"
                            width={24}
                            height={24}
                            src="/languages/arabicLang.svg"
                          />
                          <div className="text-left">
                            <p className="font-medium">العربية</p>
                            <p className="text-xs text-gray-500">Arabic (Ar)</p>
                          </div>
                        </button>

                        <button
                          onClick={languageToEnglish}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="english flag"
                            width={24}
                            height={24}
                            src="/languages/englishLang.webp"
                          />
                          <div className="text-left">
                            <p className="font-medium">English</p>
                            <p className="text-xs text-gray-500">
                              English (En)
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : session?.user.role == 1 ? (
        <>
          <div className="w-full z-20 bg-complement-color px-4 sm:px-10 md:px-20 lg:px-32 py-1 flex md:gap-4  justify-between rtl:flex-row-reverse">
            {/* logo */}
            <div
              className="cursor-pointer flex rtl:flex-row-reverse"
              onClick={() => router.push("/admin")}
            >
              <Link
                href={"/admin"}
                className="text-2xl font-bold text-main-color py-2 hover:scale-105 transition-all"
              >
                Eventat
              </Link>
            </div>
            {/* links */}
            <div className="flex rtl:flex-row-reverse items-center justify-end  dark:text-black-text text-white-text">
              <ul className="flex rtl:flex-row-reverse gap-6 sm:gap-5 md:gap-6 lg:gap-7 justify-end items-center">
                <li>
                  <Link
                    className="transition cursor-pointer text-white relative hidden sm:block"
                    href={`/admin/orders`}
                  >
                    <BiBox className="inline" /> <span>{t.orders}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition cursor-pointer text-white relative hidden sm:block"
                    href={`/admin/nets`}
                  >
                    <FaIdCard className="inline" /> <span>K-Net</span>
                  </Link>
                </li>

                <li>
                  <Link
                    className="transition cursor-pointer text-white relative hidden sm:block "
                    href={`/admin/products`}
                  >
                    <FaChalkboard className="inline" /> <span>{t.event}</span>
                  </Link>
                </li>
                {/* drop menu */}
                <li className="relative">
                  <p
                    className="transition cursor-pointer text-white relative hover:text-gray-200 flex items-center gap-2"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <FaList className="text-lg" />
                    <span className="font-medium">{t.allLinks}</span>
                  </p>
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl pb-2 pt-8 z-50 transform transition-all duration-200 ease-in-out border border-gray-100">
                      <button
                        className="font-bold text-xl absolute top-2 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDropdown(false);
                        }}
                      >
                        ✕
                      </button>

                      <Link
                        href="/admin/users"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaUsers className="text-lg mr-3" />
                        <span>{t.users}</span>
                      </Link>
                      <Link
                        href="/admin/category"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaList className="text-lg mr-3" />
                        <span>{t.category}</span>
                      </Link>

                      <Link
                        href="/admin/coupons"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <FaCodepen className="text-lg mr-3" />
                        <span>{t.coupon}</span>
                      </Link>
                      <Link
                        href="/admin/slider-home"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-5 py-3 text-gray-600 hover:bg-gray-50 hover:text-main-color transition-all duration-200"
                      >
                        <BiScreenshot className="text-lg mr-3" />
                        <span>{t.sliderView}</span>
                      </Link>
                    </div>
                  )}
                </li>
                <li className="relative dropdown-container z-30">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "language" ? null : "language"
                      )
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                      activeDropdown === "language"
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <TfiWorld className="text-lg text-white" />
                    <span className="text-sm text-white font-bold">
                      {t.language}
                    </span>
                    <IoIosArrowDown
                      className={`transition-transform text-white ${
                        activeDropdown === "language" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "language" && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                      <div className="p-3 bg-gray-50 border-b">
                        <p className="text-sm font-medium text-gray-700">
                          {t.selectLanguage}
                        </p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={languageToArabic}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="arabic flag"
                            width={24}
                            height={24}
                            src="/languages/arabicLang.svg"
                          />
                          <div className="text-left">
                            <p className="font-medium">العربية</p>
                            <p className="text-xs text-gray-500">Arabic (Ar)</p>
                          </div>
                        </button>

                        <button
                          onClick={languageToEnglish}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                        >
                          <Image
                            className="rounded"
                            alt="english flag"
                            width={24}
                            height={24}
                            src="/languages/englishLang.webp"
                          />
                          <div className="text-left">
                            <p className="font-medium">English</p>
                            <p className="text-xs text-gray-500">
                              English (En)
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={`${
              showForm
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            } fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300 flex items-center justify-center`}
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
                    t == enUS ? "Search products..." : "البحث عن ايفنتات...."
                  }
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border-2 border-white/30 
                focus:border-main-color/60 outline-none text-white placeholder:text-gray-300
                transition-all duration-300"
                  required
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 bg-main-color hover:bg-secondary-color text-black font-bold
                py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-main-color/20"
                  type="submit"
                >
                  {t.search}
                </button>
                <button
                  onClick={searchFormShow}
                  type="button"
                  className="flex-1 bg-gray-500/50 hover:bg-gray-500/70 text-white font-bold
                py-3 rounded-xl transition-all duration-300"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
          <div className="fixed w-full z-20 bg-complement-color px-2 sm:px-10 md:px-20 lg:px-32 py-4 flex md:gap-4 justify-between rtl:flex-row-reverse backdrop-blur-sm shadow-lg">
            <div className="flex gap-5 ltr:flex-row-reverse">
              <div className="relative dropdown-container flex justify-center items-center basis-3/12 sm:basis-1/12 md:basis-1/12">
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "adminMenu" ? null : "adminMenu"
                    )
                  }
                  className={`
                  px-4 py-2.5 
                  flex items-center gap-2
                  font-bold text-complement-color 
                  bg-main-color hover:bg-secondary-color
                  rounded-lg shadow-md hover:shadow-lg
                  transform transition-all duration-300 hover:scale-105 w-36
                  ${t == enUS ? "flex-row" : "flex-row-reverse"}
                `}
                >
                  {name ? (
                    <>
                      <Image
                        className="rounded"
                        alt="kuwait flag"
                        width={36}
                        height={30}
                        src="/languages/kuwaitFlag.png"
                      />
                      {t == enUS ? "Kuwait" : "الكويت"}
                    </>
                  ) : (
                    t.location
                  )}
                </button>

                {activeDropdown === "adminMenu" && (
                  <div className="absolute -left-20 top-full mt-3 w-[320px] bg-complement-color rounded-2xl shadow-2xl overflow-hidden animate-fadeIn z-50">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-main-color to-secondary-color px-6 py-4">
                      <h3 className="font-bold text-lg text-complement-color text-center mb-1">
                        {t == enUS ? "Kuwait" : "الكويت"}
                      </h3>
                      <p className="text-xs font-bold text-complement-color/80 text-center">
                        {t == enUS ? "Current Location" : "الموقع الحالي"}
                      </p>
                    </div>

                    {/* Warning Notice */}
                    <div className="px-5 py-4 bg-complement-color backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="animate-bounce text-xl">⚠️</span>
                        </div>
                        <div>
                          <p className="text-white/75 font-medium text-sm leading-snug">
                            {t.changeLocationNotice1}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Decoration */}
                  </div>
                )}
              </div>
              <Link
                href={"/"}
                className="hover:scale-105 hover:text-white text-2xl transition-all mx-2 whitespace-nowrap text-main-color font-extrabold flex justify-center items-center"
              >
                Eventat
              </Link>
            </div>
            {cartLoading ? (
              <div className="flex items-center justify-center basis-9/12 sm:basis-7/12 md:basis-7/12 lg:basis-5/12 xl:basis-5/12">
                <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent" />
              </div>
            ) : (
              <div className="flex rtl:flex-row-reverse items-center justify-end text-white basis-9/12 sm:basis-7/12 md:basis-7/12 lg:basis-5/12 xl:basis-5/12">
                <ul className="flex rtl:flex-row-reverse gap-6 sm:gap-5 md:gap-6 lg:gap-8 justify-end items-center">
                  <li className="hidden sm:flex dropdown-container">
                    <button
                      onClick={searchFormShow}
                      className="flex gap-2 justify-center items-center p-2 bg-main-color text-complement-color hover:bg-opacity-90 rounded-full transition-all shadow-md hover:shadow-lg"
                    >
                      <FaSearch className="block" />{" "}
                      <span className="hidden lg:block">{t.search}</span>
                    </button>
                  </li>
                  <li className="hidden sm:flex dropdown-container">
                    {!session?.user.id ? (
                      <button
                        onClick={() => signIn()}
                        className="whitespace-nowrap px-6 py-2 bg-main-color text-complement-color hover:bg-opacity-90 font-semibold rounded-full transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        {t.login}
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === "account" ? null : "account"
                            )
                          }
                          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                            activeDropdown === "account"
                              ? "bg-white/20"
                              : "hover:bg-white/10"
                          }`}
                        >
                          <div className="h-8 w-8 rounded-full ring-2 ring-white bg-white/20 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {session.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {session.user.name}
                          </span>
                          <IoIosArrowDown
                            className={`transition-transform ${
                              activeDropdown === "account" ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {activeDropdown === "account" && (
                          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                            <div className="p-4 bg-gradient-to-r from-main-color to-secondary-color text-white">
                              <p className="font-medium text-complement-color">
                                {session.user.name}
                              </p>
                              <p className="text-sm opacity-90">
                                {session.user.email}
                              </p>
                            </div>

                            <div className="p-2">
                              <Link
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                              >
                                <FaUserAlt className="text-gray-400 text-lg" />
                                <div>
                                  <p className="font-medium">{t.profile}</p>
                                  <p className="text-xs text-gray-500">
                                    {t.manageYourProfile}
                                  </p>
                                </div>
                              </Link>
                              <Link
                                href="/wishList"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                              >
                                <FaHeart className="text-gray-400 text-lg" />
                                <div>
                                  <p className="font-medium">{t.wishList}</p>
                                  <p className="text-xs text-gray-500">
                                    {t.wishList}
                                  </p>
                                </div>
                              </Link>

                              <div className="h-px bg-gray-200 my-2"></div>

                              <button
                                onClick={() => {
                                  if (confirm(t.areYouSureLogout)) {
                                    localStorage.removeItem("cart");
                                    localStorage.removeItem("cartTotal");
                                    signOut();
                                  }
                                }}
                                className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                              >
                                <FaUserTimes className="text-lg" />
                                <div>
                                  <p className="font-medium">{t.logout}</p>
                                  <p className="text-xs text-red-400">
                                    {t.signOutOfAccount}
                                  </p>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                  <li className="relative dropdown-container">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "language" ? null : "language"
                        )
                      }
                      className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                        activeDropdown === "language"
                          ? "bg-white/20"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <TfiWorld className="text-lg" />
                      <span className="text-sm font-medium">{t.language}</span>
                      <IoIosArrowDown
                        className={`transition-transform ${
                          activeDropdown === "language" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeDropdown === "language" && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                        <div className="p-3 bg-gray-50 border-b">
                          <p className="text-sm font-medium text-gray-700">
                            {t.selectLanguage}
                          </p>
                        </div>

                        <div className="p-2">
                          <button
                            onClick={languageToArabic}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                          >
                            <Image
                              className="rounded"
                              alt="arabic flag"
                              width={24}
                              height={24}
                              src="/languages/arabicLang.svg"
                            />
                            <div className="text-left">
                              <p className="font-medium">العربية</p>
                              <p className="text-xs text-gray-500">
                                Arabic (Ar)
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={languageToEnglish}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
                          >
                            <Image
                              className="rounded"
                              alt="english flag"
                              width={24}
                              height={24}
                              src="/languages/englishLang.webp"
                            />
                            <div className="text-left">
                              <p className="font-medium">English</p>
                              <p className="text-xs text-gray-500">
                                English (En)
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
          {/* middle space */}
          <div className="w-full h-[72px]"></div>
          {/* bottom nav */}
        </>
      )}
      {/* top nav */}
    </header>
  );
}

export default Header;
