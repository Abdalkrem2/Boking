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
import { FaInfo, FaInfoCircle } from "react-icons/fa";

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
  const [pageData, setPageData] = useState<any>({});
  const [referral, setReferral] = useState();
  const [beneficiary, setBeneficiary] = useState();
  const [refStatus, setRefStatus] = useState();
  const [r_status, setR_status] = useState();
  const [b_status, setB_status] = useState();
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [beneficiaryData, setBeneficiaryData] = useState<any>();
  const [referralData, setReferralData] = useState<any>();
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
    if (db_link === "") return;
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
      .get(`${db_link}api/referrals/${pageId}`, {
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

          setPageData(res.data.item);
          setReferral(res.data.item.referrer);
          setBeneficiary(res.data.item.beneficiary);
          setRefStatus(res.data.item.status);
          setR_status(res.data.item.r_status);
          setB_status(res.data.item.b_status);
          setDescription(res.data.item.description);
          setDescriptionAr(res.data.item.descriptionAr);
          setReferralData(res.data.referrer);
          setBeneficiaryData(res.data.beneficiary);
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
        .delete(`${db_link}api/referrals/${pageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          router.push("/admin/referrals");
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
    fData.append("description", e.target[0].value);
    fData.append("descriptionAr", e.target[1].value);
    fData.append("referrer", e.target[2].value);
    fData.append("beneficiary", e.target[3].value);
    fData.append("status", e.target[4].value);
    fData.append("r_status", e.target[5].value);
    fData.append("b_status", e.target[6].value);
    axios
      .post(`${db_link}api/referrals/${pageId}`, fData, {
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
  const changeDescriptionHandler = (e: any) => {
    setDescription(e.target.value);
  };
  const changeDescriptionArHandler = (e: any) => {
    setDescriptionAr(e.target.value);
  };
  const changeReferralHandler = (e: any) => {
    setReferral(e.target.value);
  };
  const changeBeneficiaryHandler = (e: any) => {
    setBeneficiary(e.target.value);
  };
  const changeRefStatusHandler = (e: any) => {
    setRefStatus(e.target.value);
  };
  const changeR_statusHandler = (e: any) => {
    setR_status(e.target.value);
  };
  const changeB_statusHandler = (e: any) => {
    setB_status(e.target.value);
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
    <section
      dir={t == enUS ? "ltr" : "rtl"}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
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
              href="/admin/referrals"
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
              {t.referrals}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">
              {t.referral} #{pageData.id}
            </span>
          </nav>

          {/* Payment Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-main-color to-secondary-color rounded-xl p-6 mb-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl font-bold mb-2">Referral Details</h1>
                  <span className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    ID: #{pageData.id}
                  </span>
                </div>
                <p className="text-white/80">
                  {t.date}: {formatDate(pageData.created_at)}
                </p>
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 rounded-full bg-white/10" />
            </div>

            {/* Payment Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-main-color" />
                    {t.referralInformation}
                  </h3>
                  <div className="space-y-6">
                    {/* Referrer Card */}
                    <div className="bg-white p-6 rounded-xl border-2 border-main-color/20 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary-color/10 rounded-lg">
                            <svg
                              className="w-6 h-6 text-secondary-color"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-700 font-medium">
                            {t.referral}
                          </p>
                        </div>

                        <Link
                          className="hover:text-main-color px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600"
                          href={`/admin/users/${referralData.id}`}
                        >
                          ID #{referralData.id}
                        </Link>
                      </div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-secondary-color to-main-color bg-clip-text text-transparent mb-4">
                        {referralData.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            r_status == 0
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : r_status == 1
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {r_status == 0
                            ? t.notUsed
                            : r_status == 1
                            ? t.used
                            : t.rejected}
                        </span>
                      </div>
                    </div>

                    {/* Beneficiary Card */}
                    <div className="bg-white p-6 rounded-xl border-2 border-main-color/20 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary-color/10 rounded-lg">
                            <svg
                              className="w-6 h-6 text-secondary-color"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-700 font-medium">
                            {t.beneficiary}
                          </p>
                        </div>
                        <Link
                          className="hover:text-main-color px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600"
                          href={`/admin/users/${beneficiaryData.id}`}
                        >
                          ID #{beneficiaryData.id}
                        </Link>
                      </div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-secondary-color to-main-color bg-clip-text text-transparent mb-4">
                        {beneficiaryData.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            b_status == 0
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : b_status == 1
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {b_status == 0
                            ? t.notUsed
                            : b_status == 1
                            ? t.used
                            : t.rejected}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-main-color/10 rounded-lg">
                      <svg
                        className="w-6 h-6 text-main-color"
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
                    </div>
                    {t.additional}
                  </h3>
                  <div className="space-y-6">
                    <div className="group">
                      <p className="text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-main-color rounded-full"></span>
                        {t.description} (En)
                      </p>
                      <div className="mt-2 p-5 bg-white rounded-xl border-2 border-gray-100 group-hover:border-main-color/20 transition-all duration-300">
                        <p className="text-gray-700">
                          {pageData.description || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="group">
                      <p className="text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-main-color rounded-full"></span>
                        {t.description} (Ar)
                      </p>
                      <div className="mt-2 p-5 bg-white rounded-xl border-2 border-gray-100 group-hover:border-main-color/20 transition-all duration-300">
                        <p className="text-gray-700">
                          {pageData.descriptionAr || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <span className="text-gray-700 font-medium">
                        {t.state}:
                      </span>
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          refStatus == 0
                            ? "bg-yellow-50 text-yellow-700 border-2 border-yellow-200 shadow-sm shadow-yellow-100"
                            : refStatus == 1
                            ? "bg-green-50 text-green-700 border-2 border-green-200 shadow-sm shadow-green-100"
                            : "bg-red-50 text-red-700 border-2 border-red-200 shadow-sm shadow-red-100"
                        }`}
                      >
                        {refStatus == 0
                          ? t.pending
                          : refStatus == 1
                          ? t.accepted
                          : t.rejected}
                      </span>
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
              <div className="border-t">
                <div className="p-6">
                  {showForm && (
                    <form
                      onSubmit={updateHandler}
                      className="mt-6 space-y-6 max-w-2xl bg-white p-8 rounded-lg shadow-md"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            description
                          </label>
                          <input
                            required
                            type="text"
                            name="description"
                            value={description}
                            onChange={changeDescriptionHandler}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                            placeholder="Enter description"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            description Ar
                          </label>
                          <input
                            required
                            type="text"
                            name="descriptionAr"
                            value={descriptionAr}
                            onChange={changeDescriptionArHandler}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                            placeholder="Enter descriptionAr"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Referral ID
                          </label>
                          <input
                            required
                            type="number"
                            name="referral"
                            value={referral}
                            onChange={changeReferralHandler}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                            placeholder="Enter referral"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            beneficiary ID
                          </label>
                          <input
                            required
                            type="number"
                            name="beneficiary"
                            value={beneficiary}
                            onChange={changeBeneficiaryHandler}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                            placeholder="Enter beneficiary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            required
                            name="status"
                            value={refStatus}
                            onChange={changeRefStatusHandler}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                          >
                            <option value={0}>Pending</option>
                            <option value={1}>Accepted</option>
                            <option value={2}>Rejected</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Referral Status
                          </label>
                          <select
                            required
                            name="r_status"
                            value={r_status}
                            onChange={changeR_statusHandler}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                          >
                            <option value={0}>not Used</option>
                            <option value={1}>Used</option>
                            <option value={2}>Rejected</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Beneficiary Status
                          </label>
                          <select
                            required
                            name="b_status"
                            value={b_status}
                            onChange={changeB_statusHandler}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-300"
                          >
                            <option value={0}>not Used</option>
                            <option value={1}>Used</option>
                            <option value={2}>Rejected</option>
                          </select>
                        </div>
                      </div>
                      {backError && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                          <ul className="list-disc pl-5 space-y-1">
                            {backError.map((error: string, index: number) => (
                              <li key={index} className="text-sm text-red-700">
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <button
                          type="submit"
                          disabled={requestSent}
                          className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          {requestSent ? "Processing..." : "Add Referral"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
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

export default Payment;
