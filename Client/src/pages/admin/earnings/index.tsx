import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";

import { useSession } from "next-auth/react";
import { FaHistory } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

function EarningPage() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const router = useRouter();
  const [data, setData] = useState<any>("");

  const { data: session, status } = useSession();
  useEffect(() => {
    if (db_link === "") return;
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/mustLogin");
      }
      return;
    }
    if (session.user.role == 0) {
      setIsLoadingStatus(true);
      const url = `${db_link}api/earnings`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        })
        .then((res) => {
          if (res.data == "you are not allowed here") {
            router.push("/");
          }

          setData(res.data);
          setIsLoadingStatus(false);
        })
        .catch(() => {
          router.push("/");
        });
    }
  }, [status, db_link]);

  //by Year data
  const [isLoadingByYear, setIsLoadingByYear] = useState(false);
  const [byYearData, setByYearData] = useState<any>();
  //select year
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState();
  const generateYears = (endYear: any, range: any) => {
    const years = [];
    for (let i = endYear; i >= endYear - range; i--) {
      years.push(i);
    }
    return years;
  };
  const years = generateYears(currentYear, 10); // Generates a list of years from the current year to 10 years in the past
  const yearDataHandler = (e: any) => {
    const year = e;
    if (e == null || e == "year") {
      return;
    }
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/mustLogin");
      }
      return;
    }
    if (session.user.role == 0) {
      setIsLoadingByYear(true);
      const url = `${db_link}api/yearEearnings`;

      axios
        .post(
          url,
          { year },
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        )
        .then((res) => {
          if (res.data == "you are not allowed here") {
            router.push("/");
          }

          setByYearData(res.data);
          setIsLoadingByYear(false);
        })
        .catch(() => {
          router.push("/");
        });
    }
  };
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  //by periode data
  const [isLoadingPeriode, setIsLoadingPeriode] = useState(false);
  const [byPeriodeData, setByPeriodeData] = useState<any>();
  const [backError, setBackError] = useState<any>(false);
  const periodeDataHandler = (e: any) => {
    e.preventDefault();
    setIsLoadingPeriode(true);
    const fData = new FormData();
    fData.append("from", e.target[0].value);
    fData.append("to", e.target[1].value);
    const token = session?.user.token;
    axios
      .post(`${db_link}api/periodEearnings`, fData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsLoadingPeriode(false);
        if (res.data == "you are not allowed here") {
          setBackError(["Not Allowed To Do this"]);
          return;
        }
        if (res.data.errors) {
          if (
            res.data.errors ==
            "The from date must be earlier than or equal to the to date."
          ) {
            setBackError([
              "The from date must be earlier than or equal to the to date.",
            ]);
          } else {
            setBackError([
              "Please Select make the start date earlier than end date",
            ]);
          }
        } else {
          setByPeriodeData(res.data);
          setBackError(false);
        }
      });
  };
  if (session == null) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-b-indigo-400 animate-pulse"></div>
        </div>
        <span className="text-sm text-indigo-600 animate-pulse">
          Loading...
        </span>
      </div>
    );
  } else {
    return (
      <>
        <Head>
          <title>Earnings</title>
          <link rel="icon" href="/logo.ico" />
        </Head>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Overall Earnings Card */}
            <div className="mb-8">
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-6">
                <FaHistory className="text-indigo-600 text-3xl mx-2" /> Overall
                Earnings
              </h2>

              {!isLoadingStatus ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Daily Card */}
                  <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100">
                    <h3 className="text-gray-600 font-medium mb-2">
                      Today's Earnings
                    </h3>
                    <span className="text-3xl font-bold text-indigo-600">
                      {data.dailyMoney} JD
                    </span>
                  </div>

                  {/* Monthly Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl shadow-sm border border-emerald-100">
                    <h3 className="text-gray-600 font-medium mb-2">
                      Monthly Earnings
                    </h3>
                    <span className="text-3xl font-bold text-emerald-600">
                      {data.monthlyMoney} JD
                    </span>
                  </div>

                  {/* Yearly Card */}
                  <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl shadow-sm border border-violet-100">
                    <h3 className="text-gray-600 font-medium mb-2">
                      Yearly Earnings
                    </h3>
                    <span className="text-3xl font-bold text-violet-600">
                      {data.yearlyMoney} JD
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-b-indigo-400 animate-pulse"></div>
                  </div>
                  <span className="text-sm text-indigo-600 animate-pulse">
                    Loading...
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />

            {/* By Year Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="flex items-center text-2xl font-bold text-gray-800">
                  <FaHistory className="text-indigo-600 text-3xl mx-2" /> By
                  Year
                </h2>
                <select
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={selectedYear}
                  onChange={(e: any) => {
                    setSelectedYear(e.target.value);
                    yearDataHandler(e.target.value);
                  }}
                >
                  <option value="year">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {isLoadingByYear ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                    <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-b-indigo-400 animate-pulse"></div>
                  </div>
                  <span className="text-sm text-indigo-600 animate-pulse">
                    Loading...
                  </span>
                </div>
              ) : byYearData ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-medium mb-2">
                      Total Year Income
                    </h3>
                    <span className="text-4xl font-bold">
                      {byYearData.totalYearIncome} JD
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {months.map((month, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                      >
                        <h3 className="text-gray-600 font-medium mb-2">
                          {month.toUpperCase()}
                        </h3>
                        <span className="text-xl font-bold text-indigo-600">
                          {byYearData.monthlyProfits[index + 1]} JD
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Please select a year to view earnings
                </p>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />

            {/* By Period Section */}
            <div>
              <h2 className="flex items-center text-2xl font-bold text-gray-800 mb-6">
                <FaHistory className="text-indigo-600 text-3xl mx-2" /> By
                Period
              </h2>

              <form onSubmit={periodeDataHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="from" className="text-gray-700 font-medium">
                      From
                    </label>
                    <input
                      required
                      name="from"
                      id="from"
                      type="date"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="to" className="text-gray-700 font-medium">
                      To
                    </label>
                    <input
                      required
                      name="to"
                      id="to"
                      type="date"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoadingPeriode}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                  >
                    Calculate
                  </button>
                </div>

                {backError && (
                  <ul className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {backError.map((error: any, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <span>•</span> {error}
                      </li>
                    ))}
                  </ul>
                )}
              </form>

              <div className="mt-6">
                {isLoadingPeriode ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-b-indigo-400 animate-pulse"></div>
                    </div>
                    <span className="text-sm text-indigo-600 animate-pulse">
                      Loading...
                    </span>
                  </div>
                ) : byPeriodeData ? (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-medium mb-2">Period Total</h3>
                    <span className="text-4xl font-bold">
                      {byPeriodeData.earningsMoney} JD
                    </span>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Select a date range to view earnings
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default EarningPage;
