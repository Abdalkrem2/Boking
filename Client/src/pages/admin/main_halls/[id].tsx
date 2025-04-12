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
  const productId = router.query.id;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [productData, setProductData] = useState<any>("");
  const [message, setMessage] = useState<any>(false);
  const [number, setNumber] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [types, setTypes] = useState<string>("");
  const [seats, setSeats] = useState<string>("");
  const [hNumber, setHNumber] = useState<any>();

  useEffect(() => {
    if (db_link === "") return;
    if (!session?.user?.token) return;
    axios
      .get(`${db_link}api/mainHalls/${productId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        const data = res.data[0];
        if (data) {
          setProductData(data);
          setName(data.name);
          setDescription(data.description);
          setHNumber(data.number);
          setTypes(data.types);
          setSeats(data.seats);
          setLoading(false);
        }
      })
      .catch(() => {
        router.push("/");
        setLoading(false);
      });
  }, [productId, number, db_link, session?.user?.token]);
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
  const [showForm2, setShowForm2] = useState(false);
  const [backError, setBackError] = useState<any>(false);
  const [backError2, setBackError2] = useState<any>(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestSent2, setRequestSent2] = useState(false);
  const [showAllSeats, setShowAllSeats] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const fData = new FormData();
    fData.append("_method", "PUT");
    fData.append("name", name);
    fData.append("types", types);
    fData.append("seats", seats);
    fData.append("number", hNumber);
    fData.append("description", description);

    //send request
    axios
      .post(`${db_link}api/mainHalls/edit/${productId}`, fData, {
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
          // if (t == enUS) {
          setMessage(t.theDataUpdated);
          // }
          window.scroll(0, 0);
          // e.target.reset();
          setNumber(number + 1);
        }
      });
  };
  const submitHandler2 = (e: any) => {
    e.preventDefault();
    setRequestSent2(true);
    const fData = new FormData();
    fData.append("main_hall_id", `${productId}`);
    fData.append("name", e.target.hallName.value);
    fData.append("nameAr", e.target.nameAr.value);
    fData.append("time", e.target.date.value);
    fData.append("duration", e.target.duration.value);
    fData.append("max_seats", e.target.max_seats.value);
    fData.append("state", e.target.state.value);
    fData.append("product_id", e.target.product_id.value);
    fData.append("description", e.target.description.value);
    //send request
    axios
      .post(`${db_link}api/addSepHall`, fData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setRequestSent2(false);
        if (res.data.errors) {
          setBackError2(res.data.errors);
          setMessage(false);
        } else {
          console.log(res.data);
          router.push(`/admin/halls/${res.data.id}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Head>
        <title>Main Halls {productId}</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section className="py-8 px-4 sm:px-8 md:px-12 lg:px-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          {!loading ? (
            <>
              {/* Notification messages with smooth transitions */}
              {message && (
                <div
                  className={`mb-6 overflow-hidden transition-all duration-500 ease-in-out ${
                    message === t.theDataUpdated ? "max-h-20" : "max-h-20"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-lg shadow-md ${
                      message === t.theDataUpdated
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    } flex items-center`}
                  >
                    {message === t.theDataUpdated ? (
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span>{message}</span>
                  </div>
                </div>
              )}

              {/* Category details with card styling */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <Link
                        href="/admin/main_halls"
                        className="text-main-color hover:text-secondary-color flex items-center transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        {t.hall}
                      </Link>
                      <span className="mx-2 text-gray-400">/</span>
                      <h1 className="text-2xl font-bold text-gray-800 truncate">
                        {productData.name}
                      </h1>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="inline-block w-24 text-gray-600 font-medium">
                          {t.name}:
                        </span>
                        <span className="text-gray-800 flex-1">
                          {productData.name}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="inline-block w-24 text-gray-600 font-medium">
                          {t.number}:
                        </span>
                        <span className="text-gray-800 flex-1">
                          {productData.number}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="inline-block w-24 text-gray-600 font-medium">
                          {t.description}:
                        </span>
                        <span className="text-gray-800 flex-1">
                          {productData.description}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-48 flex-shrink-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-main-color/10 to-secondary-color/10 rounded-lg flex items-center justify-center p-4">
                      <svg
                        className="w-16 h-16 text-main-color"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update form section with smooth expand/collapse */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className={`w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    showForm ? "border-b border-gray-200" : ""
                  }`}
                >
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg
                      className={`w-5 h-5 mr-2 text-main-color transition-transform duration-300 ${
                        showForm ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    {t.edit} {productData.name}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {showForm ? t.hideForm : t.showForm}
                  </span>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showForm ? "h-auto" : "max-h-0"
                  }`}
                >
                  <form onSubmit={submitHandler} className="p-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.hall} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                            placeholder="Grand Ballroom"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Number Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="number"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.number} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            name="number"
                            id="number"
                            value={hNumber}
                            onChange={(e) => setHNumber(e.target.value)}
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                            placeholder="H-101"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Description Field */}
                      <div className="md:col-span-2 space-y-2">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.description} (En){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          name="description"
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                          placeholder="A luxurious hall with modern amenities..."
                        />
                      </div>

                      {/* Types Field */}
                      <div className="md:col-span-2 space-y-2">
                        <label
                          htmlFor="types"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.type} <span className="text-rose-500">*</span>
                          <span className="block text-xs text-gray-500 mt-1">
                            (Format: Name,Price+Name,Price...)
                          </span>
                        </label>
                        <div className="relative">
                          <textarea
                            required
                            name="types"
                            id="types"
                            value={types}
                            onChange={(e) => setTypes(e.target.value)}
                            rows={3}
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                            placeholder="VIP,30+Gold,20+Standard,10"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-start pr-3 pt-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Seats Field */}
                      <div className="md:col-span-2 space-y-2">
                        <label
                          htmlFor="seats"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.seats} <span className="text-rose-500">*</span>
                          <span className="block text-xs text-gray-500 mt-1">
                            (Format: Name,Type+Name,Type...)
                          </span>
                        </label>
                        <div className="relative">
                          <textarea
                            required
                            name="seats"
                            id="seats"
                            value={seats}
                            onChange={(e) => setSeats(e.target.value)}
                            rows={3}
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                            placeholder="A1,VIP+A2,Gold+B1,Standard"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-start pr-3 pt-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form actions */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="submit"
                        disabled={requestSent}
                        className={`px-8 py-2.5 rounded-lg font-medium text-black transition-all duration-200 flex items-center justify-center ${
                          requestSent
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-main-color hover:bg-main-color/90 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {requestSent ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
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
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            {t.update}
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {t.update}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Error messages */}
                    {backError && backError.length > 0 && (
                      <div className="mt-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-rose-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h3 className="text-sm font-medium text-rose-800">
                            {t.errorFound}
                          </h3>
                        </div>
                        <ul className="mt-2 text-sm text-rose-700 space-y-1">
                          {backError.map((error: any, index: number) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </form>
                </div>
              </div>
              {/* add new hall */}
              <div className="my-5 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300">
                <button
                  onClick={() => setShowForm2(!showForm2)}
                  className={`w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    showForm2 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg
                      className={`w-5 h-5 mr-2 text-main-color transition-transform duration-300 ${
                        showForm2 ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    {t.addHalls}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {showForm2 ? t.hideForm : t.showForm}
                  </span>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showForm2 ? "h-auto" : "max-h-0"
                  }`}
                >
                  <div
                    dir={t == enUS ? "ltr" : "rtl"}
                    className="flex flex-col w-full p-2"
                  >
                    <p className="pb-2">
                      <span className="text-gray-600 font-bold">{t.hall}:</span>{" "}
                      <span className="text-gray-800">{productData.name}</span>
                    </p>
                    <p className="pb-2">
                      <span className="text-gray-600 font-bold">
                        {t.number}:
                      </span>{" "}
                      <span className="text-gray-800">
                        {productData.number}
                      </span>
                    </p>
                    <p className="pb-2">
                      <span className="text-gray-600 font-bold">
                        {t.description}:
                      </span>{" "}
                      <span className="text-gray-800">
                        {productData.description}
                      </span>
                    </p>
                    <p className="pb-2">
                      <span className="text-gray-800">
                        <span
                          onClick={() => setShowAllTypes(!showAllTypes)}
                          className="inline-block bg-secondary-color text-black font-bold rounded-full px-3 py-1 text-sm mr-2 mb-2 cursor-pointer hover:bg-secondary-color/90 transition-colors duration-200"
                        >
                          {productData.types.split("+").length} {t.types}
                          <svg
                            className={`w-4 h-4 ml-1 inline-block transition-transform duration-200 ${
                              showAllTypes ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                        {showAllTypes && (
                          <div className="mt-2">
                            {productData.types
                              .split("+")
                              .map((type: any, index: number) => (
                                <span
                                  key={index}
                                  className="inline-block bg-main-color text-black rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                                >
                                  {type.split(",")[0]} ({type.split(",")[1]}{" "}
                                  KWD)
                                </span>
                              ))}
                          </div>
                        )}
                      </span>
                    </p>
                    <p className="pb-2">
                      <span className="text-gray-800">
                        <span
                          onClick={() => setShowAllSeats(!showAllSeats)}
                          className="inline-block bg-secondary-color text-black font-bold rounded-full px-3 py-1 text-sm mr-2 mb-2 cursor-pointer hover:bg-secondary-color/90 transition-colors duration-200"
                        >
                          {productData.seats.split("+").length} {t.seats}
                          <svg
                            className={`w-4 h-4 ml-1 inline-block transition-transform duration-200 ${
                              showAllSeats ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                        {showAllSeats && (
                          <div className="mt-2">
                            {productData.seats
                              .split("+")
                              .map((seat: any, index: number) => (
                                <span
                                  key={index}
                                  className="inline-block bg-main-color text-black rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                                >
                                  {seat.split(",")[0]} ({seat.split(",")[1]})
                                </span>
                              ))}
                          </div>
                        )}
                      </span>
                    </p>
                  </div>

                  <form onSubmit={submitHandler2} className="p-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Fields */}
                      <div className="space-y-2">
                        <label
                          htmlFor="hallName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.sepHallName} (En){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            name="hallName"
                            id="hallName"
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                            placeholder="Grand Ballroom"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="nameAr"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.sepHallName} (Ar){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            name="nameAr"
                            id="nameAr"
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                            placeholder="Grand Ballroom"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Date Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.date} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="date"
                            name="date"
                            id="date"
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Duration Field from to in hours */}
                      <div className="space-y-2">
                        <label
                          htmlFor="duration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.duration} (6:30pm - 8am){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            name="duration"
                            id="duration"
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                            placeholder="3:00 PM - 5:00 PM"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* max seats Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="max_seats"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.maxSeats} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="number"
                            name="max_seats"
                            id="max_seats"
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                            placeholder="100"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* State Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.state} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            required
                            name="state"
                            id="state"
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200 appearance-none"
                          >
                            <option value="0">{t.available}</option>
                            <option value="1">{t.notAvailable}</option>
                            <option value="2">{t.outOfTickets}</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <IoIosArrowDown className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      {/* Event Id */}
                      <div className="space-y-2">
                        <label
                          htmlFor="product_id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.event} (ID){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            name="product_id"
                            id="product_id"
                            className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                            placeholder="Grand Ballroom"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Description Field */}
                      <div className=" space-y-2">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.description}
                          <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          name="description"
                          id="description"
                          rows={3}
                          className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                          placeholder="A luxurious hall with modern amenities..."
                        />
                      </div>
                    </div>

                    {/* Form actions */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setShowForm2(false)}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="submit"
                        disabled={requestSent2}
                        className={`px-8 py-2.5 rounded-lg font-medium text-black transition-all duration-200 flex items-center justify-center ${
                          requestSent2
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-main-color hover:bg-main-color/90 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {requestSent2 ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
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
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            {t.addHalls}
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {t.addHalls}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Error messages */}
                    {backError2 && backError2.length > 0 && (
                      <div className="mt-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-rose-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h3 className="text-sm font-medium text-rose-800">
                            {t.errorFound}
                          </h3>
                        </div>
                        <ul className="mt-2 text-sm text-rose-700 space-y-1">
                          {backError2.map((error: any, index: number) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-32">
              <div className="relative">
                <div className="spinner animate-spin inline-block w-12 h-12 border-4 border-t-main-color border-r-main-color border-b-transparent border-l-transparent rounded-full ease-linear duration-300" />
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Profile;
