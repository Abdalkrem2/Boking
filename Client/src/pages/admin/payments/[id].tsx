"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ar, enUS } from "../../../../translation";

function Payment() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  //Top Level Variables
  const { data: session, status } = useSession();
  const token = session?.user.token;
  const router = useRouter();
  const pageId = router.query.id;

  //state variables
  const [loading, setLoading] = useState(true);
  const [number, setNumber] = useState(1);
  const [message, setMessage] = useState<any>([0, "", 0]);
  const [requestSent, setRequestSent] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [backError, setBackError] = useState<any>(false);

  //Page data
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [payment_details, setPaymentDetails] = useState("");
  const [pageData, setPageData] = useState<any>({});

  //loading
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  //fetch Data
  useEffect(() => {
    //Auth Check
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/");
      }
      return;
    }
    setLoading(true);
    //fetching data
    axios
      .get(`${db_link}api/payments/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      //Success
      .then((res) => {
        if (res.data) {
          if (res.data == "you are not allowed here") {
            router.push("/");
          }
          setPageData(res.data);
          setAmount(res.data.amount);
          setType(res.data.type);
          setPaymentDetails(res.data.payment_details);
        }
        setLoading(false);
      })
      //Error
      .catch(() => {
        setMessage([1, "Something went wrong", 0]);
      });
  }, [pageId, number, status, db_link]);

  //delete handler
  const areYouSureHandler = () => {
    if (
      confirm(
        "Are you sure you want to delete this Invoice? this action can't be undone"
      )
    ) {
      axios
        .delete(`${db_link}api/payments/${pageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          router.push("/admin/payments");
        })
        .catch(() => {
          setMessage([1, "Something went wrong", 0]);
        });
    }
  };

  //update handlers
  const updateHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    //FormData
    const fData = new FormData();
    fData.append("_method", "PUT");
    fData.append("amount", e.target[0].value);
    fData.append("type", e.target[1].value);
    fData.append("payment_details", e.target[2].value);
    axios
      .post(`${db_link}api/payments/${pageId}`, fData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      //Success
      .then((res) => {
        setRequestSent(false);
        if (res.data.errors) {
          setBackError(res.data.errors);
          setMessage([1, "Please fill the form carefully", 0]);
        } else {
          setBackError(false);
          setMessage([1, "The data updated", 1]);
          window.scroll(0, 0);
          e.target.reset();
          setNumber(number + 1);
        }
      })
      //Error
      .catch(() => {
        setRequestSent(false);
        setMessage([1, "Something went wrong, please try again", 0]);
      });
  };

  //data handlers
  const changeAmountHandler = (e: any) => {
    setAmount(e.target.value);
  };
  const changeTypeHandler = (e: any) => {
    setType(e.target.value);
  };
  const changePaymentDetailsHandler = (e: any) => {
    setPaymentDetails(e.target.value);
  };

  // Date Handler
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //Return Function
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Alert Message */}
      {message[0] == 1 && (
        <div
          className={`rounded-lg shadow-sm p-4 mb-6 ${
            message[2] == 0
              ? "bg-red-50 border border-red-100 text-red-700"
              : "bg-green-50 border border-green-100 text-green-700"
          }`}
        >
          <p className="text-center font-medium">{message[1]}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="min-h-[400px] flex flex-col gap-3 justify-center items-center">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute w-full h-full border-4 border-main-color rounded-full animate-[spin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite] border-t-transparent"></div>
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
        </div>
      ) : (
        <>
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center space-x-2 text-sm md:text-base">
            <Link
              className="flex items-center text-gray-600 hover:text-main-color transition-colors duration-200"
              href="/admin/payments"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Payments
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">
              Payment #{pageData.id}
            </span>
          </nav>

          {/* Payment Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-main-color to-secondary-color rounded-xl p-6 mb-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl font-bold mb-2">Payment Details</h1>
                  <span className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    ID: #{pageData.id}
                  </span>
                </div>
                <p className="text-white/80">
                  Created: {formatDate(pageData.created_at)}
                </p>
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 rounded-full bg-white/10" />
            </div>

            {/* Payment Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Amount and Type */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-main-color"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {t.paymentInformation}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">{t.total}</p>
                      <p className="text-3xl font-bold text-main-color">
                        ${Number(pageData.amount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{t.type}</p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeStyles(
                          pageData.type
                        )}`}
                      >
                        {getTypeLabel(pageData.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-main-color"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {t.additional}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">
                        {t.paymentDetails}
                      </p>
                      <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200">
                        {pageData.payment_details}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 hover:shadow-xl transition-all duration-300">
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 bg-blue-50 text-main-color rounded-lg group-hover:bg-main-color group-hover:text-white transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </span>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t.edit}
                </h2>
              </div>
              <IoIosArrowDown
                className={`text-xl text-gray-400 transition-transform duration-300 ${
                  showForm ? "rotate-180" : ""
                }`}
              />
            </button>

            {showForm && (
              <form
                onSubmit={updateHandler}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Amount Field */}
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="amount"
                    className="text-base font-semibold text-gray-700"
                  >
                    {t.total}
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                      JD
                    </span>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      value={amount}
                      onChange={changeAmountHandler}
                      required
                      placeholder="0.00"
                      className="pl-10 px-5 h-14 text-lg block w-full rounded-xl border border-gray-300 bg-white shadow-sm 
                      focus:border-main-color focus:ring-1 focus:ring-main-color focus:outline-none
                      hover:border-gray-400 transition-all duration-200
                      placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Type Field */}
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="type"
                    className="text-base font-semibold text-gray-700"
                  >
                    {t.type}
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={type}
                    onChange={changeTypeHandler}
                    required
                    className="px-5 h-14 text-lg block w-full rounded-xl border border-gray-300 bg-white shadow-sm 
                    focus:border-main-color focus:ring-1 focus:ring-main-color focus:outline-none
                    hover:border-gray-400 transition-all duration-200"
                  >
                    <option value="0">{t.buyProducts}</option>
                    <option value="1">{t.services}</option>
                    <option value="2">{t.equipments}</option>
                    <option value="3">{t.maintenance}</option>
                    <option value="4">{t.salary}</option>
                    <option value="5">{t.other}</option>
                  </select>
                </div>

                {/* Payment Details Field */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="payment_details"
                    className="text-base font-semibold text-gray-700"
                  >
                    {t.paymentInformation}
                  </label>
                  <textarea
                    name="payment_details"
                    id="payment_details"
                    value={payment_details}
                    onChange={changePaymentDetailsHandler}
                    required
                    placeholder="Enter payment details..."
                    rows={4}
                    className="mt-3 px-5 py-4 block w-full rounded-xl border border-gray-300 bg-white shadow-sm 
                    focus:border-main-color focus:ring-1 focus:ring-main-color focus:outline-none
                    hover:border-gray-400 transition-all duration-200
                    placeholder:text-gray-400 resize-none"
                  />
                </div>

                {/* Error Messages */}
                {backError && backError.length > 0 && (
                  <div className="md:col-span-2 p-4 bg-red-50 rounded-xl border border-red-200">
                    <ul className="space-y-2">
                      {backError.map((error: any, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium">{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end gap-4 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={requestSent}
                    className="px-6 py-2.5 bg-main-color text-white rounded-xl hover:bg-secondary-color transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-main-color/25 hover:shadow-secondary-color/25"
                  >
                    {requestSent ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {t.loading}
                      </span>
                    ) : (
                      "Update Payment"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Delete Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <button
              onClick={() => setShowDelete(!showDelete)}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </span>
                <h2 className="text-xl font-semibold text-red-600">
                  {t.delete}
                </h2>
              </div>
              <IoIosArrowDown
                className={`text-xl text-red-600 transition-transform duration-300 ${
                  showDelete ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDelete && (
              <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-full">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-700">
                      {t.delete}
                    </h3>
                    <p className="text-red-600 mt-1">
                      Are you sure you want to delete this payment? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setShowDelete(false)}
                    className="px-6 py-2.5 border border-red-200 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={areYouSureHandler}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-600/25 hover:shadow-red-700/25"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

// Helper function to get type label
function getTypeLabel(type: number) {
  switch (type) {
    case 0:
      return "Buy Products";
    case 1:
      return "Services";
    case 2:
      return "Equipments";
    case 3:
      return "Maintenance";
    case 4:
      return "salary";
    case 5:
      return "others";
    default:
      return "Unknown";
  }
}

// Helper function to get type styles
function getTypeStyles(type: number) {
  switch (type) {
    case 0:
      return "bg-blue-100 text-blue-800";
    case 1:
      return "bg-green-100 text-green-800";
    case 2:
      return "bg-purple-100 text-purple-800";
    case 3:
      return "bg-orange-100 text-orange-800";
    case 4:
      return "bg-yellow-100 text-yellow-800";
    case 5:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default Payment;
