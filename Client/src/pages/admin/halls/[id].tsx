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
  const [seats, setSeats] = useState<any>([]);
  const [types, setTypes] = useState<any>([]);
  const [productData, setProductData] = useState<any>("");
  const [message, setMessage] = useState<any>(false);
  const [number, setNumber] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [nameAr, setNameAr] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [maxSeats, setMaxSeats] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [product_id, setProduct_id] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (db_link === "") return;
    if (!session?.user?.token) return;
    axios
      .get(`${db_link}api/halls/${productId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data) {
          setSeats(data.seats);
          setTypes(data.types);
          setProductData(data.productData);
          setName(data.productData.name);
          setNameAr(data.productData.nameAr);
          setDate(data.productData.time);
          setDuration(data.productData.duration);
          setMaxSeats(data.productData.max_seats);
          setState(data.productData.state);
          setProduct_id(data.productData.product_id);
          setDescription(data.productData.description);
          setLoading(false);
        }
      })
      .catch(() => {
        // router.push("/");
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
  const [requestSent, setRequestSent] = useState(false);
  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const fData = new FormData();
    fData.append("_method", "PUT");
    fData.append("name", name);
    fData.append("nameAr", nameAr);
    fData.append("time", date);
    fData.append("duration", duration);
    fData.append("max_seats", maxSeats);
    fData.append("state", state);
    fData.append("product_id", product_id);
    fData.append("description", description);
    //send request
    axios
      .post(`${db_link}api/halls/edit/${productId}`, fData, {
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
                        href="/admin/halls"
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
                        {t == enUS ? productData.name : productData.nameAr}
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
                          {t.name}:
                        </span>
                        <span className="text-gray-800 flex-1">
                          {productData.nameAr}
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
                      <div className="flex items-start">
                        <span className="inline-block w-24 text-gray-600 font-medium">
                          {t.date}:
                        </span>
                        <span className="text-gray-800 flex-1">
                          {productData.time}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="inline-block w-24 text-gray-600 font-medium">
                          {t.duration}:
                        </span>
                        <span className="text-gray-800 flex-1">
                          {productData.duration}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="inline-block w-24 text-gray-600 font-medium">
                          {t.maxSeats}:
                        </span>
                        <span className="text-gray-800 flex-1">
                          {productData.max_seats}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="inline-block w-24 text-gray-600 font-medium">
                          {t.state}:
                        </span>
                        <span className="text-gray-800 flex-1">
                          {productData.state == 0
                            ? t.available
                            : productData.state == 1
                            ? t.outOfTickets
                            : t.notActive}
                        </span>
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
                    {t.edit} {t == enUS ? productData.name : productData.nameAr}
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
                          {t.name} (En) <span className="text-rose-500">*</span>
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
                      <div className="space-y-2">
                        <label
                          htmlFor="nameAr"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.name} (Ar) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            name="nameAr"
                            id="nameAr"
                            value={nameAr}
                            onChange={(e) => setNameAr(e.target.value)}
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
                      {/* date section */}
                      <div className="space-y-2">
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.date} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required
                          type="date"
                          name="date"
                          id="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                        />
                      </div>
                      {/* Duration Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="duration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.duration} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="duration"
                          id="duration"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                          placeholder="2 hours"
                        />
                      </div>
                      {/* Max Seats Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="max_seats"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.maxSeats} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required
                          type="number"
                          name="max_seats"
                          id="max_seats"
                          value={maxSeats}
                          onChange={(e) => setMaxSeats(e.target.value)}
                          className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                        />
                      </div>
                      {/* State Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.state} <span className="text-rose-500">*</span>
                        </label>
                        <select
                          required
                          name="state"
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                        >
                          <option value="0">{t.available}</option>
                          <option value="1">{t.outOfTickets}</option>
                          <option value="2">{t.notActive}</option>
                        </select>
                      </div>
                      {/* Product ID Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="product_id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t.event} (ID){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="product_id"
                          id="product_id"
                          value={product_id}
                          onChange={(e) => setProduct_id(e.target.value)}
                          className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-main-color/50 focus:border-main-color outline-none transition-all duration-200"
                        />
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
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
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

              {/* Edit seats and types section */}
              <div className="my-5 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300">
                <button
                  onClick={() => setShowForm2(!showForm2)}
                  className={`w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors duration-200 ${
                    showForm2 ? "border-b border-gray-200 bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        showForm2 ? "bg-main-color/10" : "bg-gray-100"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          showForm2
                            ? "rotate-180 text-main-color"
                            : "text-gray-500"
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
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {t.editSeatConfiguration}
                    </h2>
                  </div>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    {showForm2 ? t.hideForm : t.showForm}
                  </span>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    showForm2 ? "h-auto" : "max-h-0"
                  }`}
                >
                  {/* Types section */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {t.seatTypes}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {t.manageSeatCategories}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newType = {
                            id: Date.now(),
                            name: "NEW TYPE",
                            price: 0,
                          };
                          setTypes([...types, newType]);
                        }}
                        className="px-4 py-2 bg-complement-color text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center"
                      >
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        {t.addType}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {types.map((type: any, index: number) => (
                        <div
                          key={type.id}
                          className="bg-white rounded-lg p-5 border border-gray-200 hover:border-main-color transition-colors shadow-sm relative group"
                        >
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                if (types.length > 1) {
                                  const seatsUsingType = seats.some(
                                    (seat: any) => seat.type_id === type.id
                                  );
                                  if (seatsUsingType) {
                                    alert(t.cantDeleteType);
                                    return;
                                  }
                                  setTypes(
                                    types.filter((t: any) => t.id !== type.id)
                                  );
                                } else {
                                  alert(t.minOneTypeRequired);
                                }
                              }}
                              className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                              title={t.delete}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.typeName}
                              </label>
                              <input
                                type="text"
                                value={type.name}
                                onChange={(e) => {
                                  const updatedTypes = [...types];
                                  updatedTypes[index].name = e.target.value;
                                  setTypes(updatedTypes);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color/50 focus:border-main-color transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.price}
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  $
                                </span>
                                <input
                                  type="number"
                                  value={type.price}
                                  onChange={(e) => {
                                    const updatedTypes = [...types];
                                    updatedTypes[index].price =
                                      parseFloat(e.target.value) || 0;
                                    setTypes(updatedTypes);
                                  }}
                                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color/50 focus:border-main-color transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seats section */}
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {t.seats}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {t.manageIndividualSeats}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            const defaultTypeId =
                              types.length > 0 ? types[0].id : null;
                            if (!defaultTypeId) {
                              alert(t.addTypeFirst);
                              return;
                            }
                            const newSeat = {
                              id: Date.now(),
                              name: `NEW-${seats.length + 1}`,
                              type_id: defaultTypeId,
                              state: 0,
                            };
                            setSeats([...seats, newSeat]);
                          }}
                          className="px-4 py-2 bg-complement-color text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center"
                        >
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          {t.addSeat}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {seats.map((seat: any, index: number) => (
                        <div
                          key={seat.id}
                          className={`bg-white rounded-lg p-4 border transition-all ${
                            seat.user_id
                              ? "border-green-100 bg-green-50"
                              : seat.state === 1
                              ? "border-red-100 bg-red-50"
                              : "border-gray-200 hover:border-main-color"
                          } shadow-sm relative group`}
                        >
                          {seat.user_id && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                              {t.booked}
                            </div>
                          )}

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                {t.seatName}
                              </label>
                              <input
                                type="text"
                                value={seat.name}
                                onChange={(e) => {
                                  const updatedSeats = [...seats];
                                  updatedSeats[index].name = e.target.value;
                                  setSeats(updatedSeats);
                                }}
                                disabled={seat.user_id}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                  seat.user_id
                                    ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                    : "border-gray-300 focus:ring-main-color/50 focus:border-main-color"
                                }`}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                {t.type}
                              </label>
                              <select
                                value={seat.type_id}
                                onChange={(e) => {
                                  const updatedSeats = [...seats];
                                  updatedSeats[index].type_id = parseInt(
                                    e.target.value
                                  );
                                  setSeats(updatedSeats);
                                }}
                                disabled={seat.user_id}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                  seat.user_id
                                    ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                    : "border-gray-300 focus:ring-main-color/50 focus:border-main-color"
                                }`}
                              >
                                {types.map((type: any) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name} (${type.price})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {seat.user_id && (
                              <div className="pt-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  {t.bookedBy}
                                </label>
                                <Link
                                  href={`/admin/users/${seat.user_id}`}
                                  className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline flex items-center"
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                  {seat.user_name}
                                </Link>
                              </div>
                            )}

                            <div className="flex justify-between items-center pt-1">
                              {!seat.user_id && (
                                <button
                                  onClick={() => {
                                    const updatedSeats = [...seats];
                                    updatedSeats[index].state =
                                      updatedSeats[index].state === 0 ? 1 : 0;
                                    setSeats(updatedSeats);
                                  }}
                                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                                    seat.state === 0
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : "bg-red-100 text-red-800 hover:bg-red-200"
                                  } transition-colors`}
                                >
                                  {seat.state === 0 ? (
                                    <>
                                      <svg
                                        className="w-3 h-3 mr-1"
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
                                      {t.available}
                                    </>
                                  ) : (
                                    <>
                                      <svg
                                        className="w-3 h-3 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      {t.notAvailable}
                                    </>
                                  )}
                                </button>
                              )}

                              {!seat.user_id && (
                                <button
                                  onClick={() => {
                                    setSeats(
                                      seats.filter((s: any) => s.id !== seat.id)
                                    );
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                  title={t.delete}
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Update button section */}
                  <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        {t.seats}:{" "}
                        <span className="font-bold">{seats.length}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {t.types}:{" "}
                        <span className="font-bold">{types.length}</span>
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const response = await axios.put(
                            `${db_link}api/hallsSeats/${productId}`,
                            {
                              seats,
                              types,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${session?.user.token}`,
                              },
                            }
                          );

                          if (response.data.success) {
                            alert(t.theDataUpdated);
                            console.log(response.data);
                          } else {
                            console.log(response);
                            alert(t.errorFound);
                          }
                        } catch (error) {
                          console.error("Update error:", error);
                          alert(t.errorFound);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className={`px-6 py-3 rounded-lg font-medium shadow-md transition-all ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-complement-color text-white hover:shadow-lg hover:opacity-90"
                      } flex items-center`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                          {t.loading}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
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
