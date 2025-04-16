import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ar, enUS } from "../../../translation";
import Link from "next/link";
import { BsArrowUp } from "react-icons/bs";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Kanban } from "lucide-react";
function Checkout() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const kuwaitPhoneRegex = /^(?:\+965|00965)?[569]\d{7}$/;
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const language = useSelector((state: RootState) => state.language.value);
  const router = useRouter();
  const [backError, setBackError] = useState<any>([]);
  const [requestSent, setRequestSent] = useState(false);
  const [method, setMethod] = useState<number>(0);
  const [seats, setSeats] = useState<any>([]);
  const [total, setTotal] = useState<any>(0);
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [errorAuth, setErrorAuth] = useState("");
  const [showModal, setShowModal] = useState(true); // show the modal initially
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isCardValid, setIsCardValid] = useState(false); // Add state to track card validity

  useEffect(() => {
    // Validate card information
    const isCardNumberValid = cardNumber.replace(/\s/g, "").length === 16;
    const isNameOnCardValid = nameOnCard.length >= 3;
    const isExpiryValid = expiry.replace(/\s/g, "").length === 5;
    const isCvvValid = cvv.length === 3;

    setIsCardValid(
      isCardNumberValid && isNameOnCardValid && isExpiryValid && isCvvValid
    );
  }, [cardNumber, nameOnCard, expiry, cvv]);

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (!isAuth) {
      return;
    }
    // setRequestSent(true);
    setBackError([]);
    if (name.length < 3) {
      setBackError([
        t == enUS ? "Please enter a valid name" : "يرجى إدخال اسم صالح",
      ]);
      return;
    }
    if (phone.length > 0 && phone.length < 6) {
      setBackError([
        t == enUS ? "Please enter a valid Phone" : "يرجى إدخال رقم هاتف صالح",
      ]);
      return;
    }
    if (email.length > 0 && !emailRegex.test(email)) {
      setBackError([
        t == enUS
          ? "Please enter a valid email address (e.g., user@example.com)"
          : "يرجى إدخال بريد إلكتروني صحيح (مثال: user@example.com)",
      ]);
      return;
    }
    if (method === 0) {
      router.push("/checkout/knet");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length != 16) {
      setBackError([
        t == enUS
          ? "Please enter a valid card number"
          : "يرجى إدخال رقم بطاقة صالح",
      ]);
      return;
    }
    if (nameOnCard.length < 3) {
      setBackError([
        t == enUS
          ? "Please enter a valid name on card"
          : "يرجى إدخال اسم صالح على البطاقة",
      ]);
      return;
    }
    if (expiry.replace(/\s/g, "").length != 5) {
      setBackError([
        t == enUS
          ? "Please enter a valid expiry date"
          : "يرجى إدخال تاريخ انتهاء صالح",
      ]);
      return;
    }
    if (cvv.length != 3) {
      setBackError([
        t == enUS ? "Please enter a valid CVV" : "يرجى إدخال CVV صالح",
      ]);
      return;
    }
    if (seats.length === 0) {
      setBackError([
        t == enUS
          ? "Please select at least one seat"
          : "يرجى اختيار مقعد واحد على الأقل",
      ]);
      return;
    }
    console.log(seats.map((seat: any) => seat.id).join(","));
    setRequestSent(true);
    const oData = new FormData();
    oData.append("method", `${method}`);
    oData.append("name", name);
    if (email.length > 0) {
      oData.append("email", email);
    }
    oData.append("phone", phone);
    oData.append("nameCard", nameOnCard);
    oData.append("cardNumber", cardNumber.replace(/\s/g, ""));
    oData.append("cardDate", expiry.replace(/\s/g, ""));
    oData.append("cardCCV", cvv);
    oData.append("seats", seats.map((seat: any) => seat.id).join(","));
    oData.append("total", `${couponSuccess ? total * 0.8 : total}`);
    axios
      .post(`${db_link}api/orders`, oData, {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })
      .then((r) => {
        console.log(r);
        // localStorage.removeItem("selectedSeats");
        localStorage.setItem("orderCardData", JSON.stringify(r.data));
        setTimeout(() => {
          router.push("/checkout/card-code");
        }, 3500);
      })
      .catch((r) => {
        console.log(r);
        let er = [];
        if (r.response.data.errors) {
          const errorData = r.response.data.errors;
          er = Object.keys(errorData).map((key) => {
            return errorData[key][0];
          });
        }
        setBackError(er);
        setRequestSent(false);
      });
  };
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);
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
    const userData = localStorage.getItem("userData");
    if (userData) {
      const { name, phone, email } = JSON.parse(userData);
      if (name.length > 3 && phone.length > 5) {
        setName(name);
        setPhone(phone);
        setEmail(email);
        setIsAuth(true);
      }
    }

    if (localStorage.getItem("selectedSeats") !== null) {
      let seats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
      let total = 0;
      seats.map((item: any) => {
        total += item.price;
      });

      setTotal(total);
      setSeats(seats);
    } else {
      router.push("/");
    }
  }, []);
  // Detect card type from number (returns 'visa', 'mastercard', etc.)
  const [cardBrand, setCardBrand] = useState("");
  const detectCardType = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = cardNumber.substring(0, 2);
    const firstFourDigits = cardNumber.substring(0, 4);

    // Visa
    if (firstDigit === "4") return "visa";
    // Mastercard
    if (/^5[1-5]/.test(cardNumber) || /^2[2-7]/.test(cardNumber))
      return "mastercard";
    // Amex
    if (/^3[47]/.test(cardNumber)) return "amex";
    // Discover
    if (/^6011|^64[4-9]|^65/.test(cardNumber) || /^622[1-9]/.test(cardNumber))
      return "discover";
    // Diners Club
    if (/^3[0-5]|^36|^38|^39/.test(cardNumber)) return "diners";
    // JCB
    if (/^35/.test(cardNumber)) return "jcb";
    // UnionPay
    if (/^62/.test(cardNumber)) return "unionpay";
    // Default
    return "";
  };
  //
  const couponHandler = (e: any) => {
    e.preventDefault();
    if (e.target.coupon.value == "eventat_kw") {
      setCouponMessage("");
      setCouponSuccess(true);
    } else {
      setCouponMessage(
        t == enUS ? "Invalid coupon code" : "رمز القسيمة غير صالح"
      );
      setCouponSuccess(false);
    }
  };
  // Return card brand logo (replace with your actual image paths)
  const getCardBrandImage = (brand: string) => {
    const logos: Record<string, string> = {
      visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
      mastercard:
        "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      amex: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
      discover:
        "https://upload.wikimedia.org/wikipedia/commons/5/56/Discover_Card_logo.svg",
      diners: "https://cdn-icons-png.flaticon.com/512/5968/5968288.png",
      jcb: "https://upload.wikimedia.org/wikipedia/commons/1/1b/JCB_logo.svg",
      unionpay:
        "https://upload.wikimedia.org/wikipedia/commons/0/04/UnionPay_logo.svg",
    };
    return logos[brand] || "";
  };
  return (
    <section
      className=" bg-complement-color sm:px-10 md:px-20 lg:px-32 sm:pt-2 md:pt-5"
      dir={t == enUS ? "ltr" : "rtl"}
    >
      {/* Model for name and phone and email */}
      {!isAuth && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-complement-color p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-center text-white tracking-wide">
              {t.enterYourInfo}
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block font-medium text-gray-200 mb-2">
                  {t.name} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-main-color"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-200 mb-2">
                  {t.phone} <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-main-color"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-200 mb-2">
                  {t.email}{" "}
                  <span className="text-sm text-gray-400">({t.optional})</span>
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-main-color"
                />
              </div>
              {errorAuth !== "" && (
                <div className="text-red-400 text-sm mt-2 text-center">
                  {errorAuth}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  if (name.length > 3 && phone.length > 5) {
                    if (email.length > 0 && !emailRegex.test(email)) {
                      setErrorAuth(
                        t == enUS
                          ? "Please enter a valid email address"
                          : "يرجى إدخال بريد إلكتروني صالح"
                      );
                      return;
                    }
                    localStorage.setItem(
                      "userData",
                      JSON.stringify({ name, phone, email })
                    );
                    setIsAuth(true);
                    setShowModal(false);
                    setErrorAuth("");
                  } else {
                    setErrorAuth(
                      t == enUS
                        ? "Please enter a valid name and phone number"
                        : "يرجى إدخال اسم ورقم هاتف صالحين"
                    );
                  }
                }}
                className="w-full bg-main-color text-complement-color font-bold py-3 rounded-xl hover:bg-secondary-color transition duration-300 shadow-md"
              >
                {t.continue}
              </button>
            </form>
          </div>
        </div>
      )}

      <h1 className={`font-bold text-3xl mb-8 text-gray-200`}>{t.checkout}</h1>
      {/* payment method and final price */}

      {seats.length > 0 && (
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-2xl p-8 mb-6 border border-slate-600">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            {/* Left side - Payment & Form */}
            <div className="w-full lg:w-8/12">
              {/* Payment Method Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-5 text-white">
                  {t.paymentMethod}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setMethod(0)}
                    className={`
                   flex items-center gap-3 px-5 py-4 rounded-lg cursor-pointer
                   transition-all duration-300 border-2 
                   ${
                     method == 0
                       ? "border-main-color bg-main-color bg-opacity-20 text-white"
                       : "border-gray-600 text-gray-300 hover:border-main-color hover:bg-slate-700"
                   }
                 `}
                  >
                    <Kanban className="text-2xl" />
                    <span className="font-medium">K-NET</span>
                  </div>

                  <div
                    onClick={() => setMethod(1)}
                    className={`
                   flex items-center gap-3 px-5 py-4 rounded-lg cursor-pointer
                   transition-all duration-300 border-2 
                   ${
                     method == 1
                       ? "border-main-color bg-main-color bg-opacity-20 text-white"
                       : "border-gray-600 text-gray-300 hover:border-main-color hover:bg-slate-700"
                   }
                 `}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span className="font-medium">Debit Card</span>
                  </div>
                </div>
              </div>

              {/* K-Net */}
              <div
                className={`${
                  method == 0 ? "block" : "hidden"
                } transition-all duration-300`}
              >
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-2">
                  <h3 className="text-lg font-medium text-white mb-3">
                    {t.customerDetails}
                  </h3>
                  <p className="text-gray-300">
                    <span className="font-medium">{t.name}:</span> {name}
                  </p>
                  {email.length > 0 && (
                    <p className="text-gray-300">
                      <span className="font-medium">{t.email}:</span> {email}
                    </p>
                  )}
                  <p className="text-gray-300">
                    <span className="font-medium">{t.phone}:</span> {phone}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuth(false);
                      setErrorAuth("");
                      setName("");
                      setEmail("");
                      setPhone("");
                    }}
                    className="mt-2 px-3 py-1 text-sm bg-main-color/20 text-main-color 
                        hover:bg-main-color/30 rounded-md transition-all duration-200 
                        border border-main-color/30 hover:border-main-color/50
                        flex items-center gap-2"
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    {t.update}
                  </button>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "total",
                      JSON.stringify(couponSuccess ? total * 0.8 : total)
                    );
                    router.push("/checkout/knet");
                  }}
                  className="mt-5 inline-flex items-center justify-center w-full px-6 py-4 text-lg  text-black font-bold 
                  bg-gradient-to-r from-main-color to-main-color/80 rounded-lg shadow-lg
                  hover:from-main-color/90 hover:to-main-color/70
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-main-color focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 14V6C19 4.89543 18.1046 4 17 4H7C5.89543 4 5 4.89543 5 6V14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 15H21V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V15Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 8H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 11H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {t.payWithKnet}
                </button>
              </div>
              {/* Debit Card Form */}
              <div
                className={`${
                  method == 1 ? "block" : "hidden"
                } transition-all duration-300`}
              >
                <form onSubmit={submitHandler} className="space-y-6">
                  <div className="flex flex-col gap-6">
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 space-y-2">
                      <h3 className="text-lg font-medium text-white mb-3">
                        {t.customerDetails}
                      </h3>
                      <p className="text-gray-300">
                        <span className="font-medium">{t.name}:</span> {name}
                      </p>
                      {email.length > 0 && (
                        <p className="text-gray-300">
                          <span className="font-medium">{t.email}:</span>{" "}
                          {email}
                        </p>
                      )}
                      <p className="text-gray-300">
                        <span className="font-medium">{t.phone}:</span> {phone}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAuth(false);
                          setErrorAuth("");
                          setName("");
                          setEmail("");
                          setPhone("");
                        }}
                        className="mt-2 px-3 py-1 text-sm bg-main-color/20 text-main-color 
                        hover:bg-main-color/30 rounded-md transition-all duration-200 
                        border border-main-color/30 hover:border-main-color/50
                        flex items-center gap-2"
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        {t.update}
                      </button>
                    </div>
                    {/* Card Number */}
                    <div className="form-group">
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        {t.cardNumber}*
                      </label>
                      <div className="relative">
                        <input
                          required
                          type="text"
                          name="cardNumber"
                          id="cardNumber"
                          placeholder=""
                          maxLength={19}
                          onChange={(e) => {
                            let value = e.target.value;
                            // Remove all non-digits
                            value = value.replace(/\D/g, "");
                            // Add space after every 4 digits
                            value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                            e.target.value = value;
                            setCardNumber(value);

                            // Detect card type and update state
                            const cardType = detectCardType(
                              value.replace(/\s/g, "")
                            );
                            setCardBrand(cardType); // Assume you have a state: const [cardBrand, setCardBrand] = useState("");
                          }}
                          onBlur={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            if (digits.length < 13 || digits.length > 19) {
                              e.target.setCustomValidity(
                                "Card number must be 13-19 digits"
                              );
                            } else {
                              e.target.setCustomValidity("");
                            }
                          }}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-main-color focus:ring-2 focus:ring-main-color focus:ring-opacity-50 transition-all duration-200" // Added `pl-12` for icon space
                        />
                        {/* Card brand icon (dynamic) */}
                        {cardBrand && (
                          <div
                            className={`absolute ${
                              t == enUS ? "right-3" : "left-3"
                            } top-1/2 -translate-y-1/2`}
                          >
                            <img
                              src={getCardBrandImage(cardBrand)} // Helper function to return image path
                              alt={cardBrand}
                              className="h-6 w-auto"
                            />
                          </div>
                        )}
                      </div>
                      {/* Card brand name (optional) */}
                      {cardBrand && (
                        <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                          <span>Card type:</span>
                          <span className="font-medium text-gray-300 capitalize">
                            {cardBrand}
                          </span>
                        </p>
                      )}
                    </div>
                    {/* Name on Card */}
                    <div className="form-group">
                      <label
                        htmlFor="nameOnCard"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        {t.nameOnCard}*
                      </label>
                      <input
                        required
                        type="text"
                        name="nameOnCard"
                        id="nameOnCard"
                        placeholder=""
                        onChange={(e) => {
                          // Allow only letters, spaces, hyphens and apostrophes
                          let value = e.target.value;
                          value = value.replace(/[^a-zA-Z\s\-']/g, "");
                          e.target.value = value;
                          setNameOnCard(value);
                        }}
                        onBlur={(e) => {
                          // Validate minimum length
                          if (e.target.value.trim().length < 2) {
                            e.target.setCustomValidity(
                              "Please enter a valid name"
                            );
                          } else {
                            e.target.setCustomValidity("");
                          }
                        }}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-main-color focus:ring-2 focus:ring-main-color focus:ring-opacity-50 transition-all duration-200"
                      />
                    </div>
                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label
                          htmlFor="expiry"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          {t.expiredDate}*
                        </label>
                        <input
                          required
                          type="text"
                          name="expiry"
                          id="expiry"
                          placeholder="MM / YY"
                          maxLength={7}
                          onChange={(e) => {
                            let value = e.target.value;
                            // Remove all non-digits
                            value = value.replace(/\D/g, "");

                            // Format with slash after first 2 digits
                            if (value.length > 2) {
                              value =
                                value.substring(0, 2) +
                                " / " +
                                value.substring(2, 4);
                            }

                            // Auto-format month part
                            if (value.length > 0 && value.length <= 2) {
                              // If first digit > 1, prepend 0 (for values starting with 2-9)
                              if (value.length === 1 && parseInt(value) > 1) {
                                value = "0" + value;
                              }

                              // Ensure month is valid (01-12)
                              const monthVal = parseInt(value);
                              if (monthVal > 12) {
                                value = "12";
                              } else if (monthVal === 0) {
                                value = "01";
                              }
                            }

                            e.target.value = value;
                            setExpiry(value);
                          }}
                          onKeyDown={(e: any) => {
                            // Handle backspace to properly remove the slash
                            if (
                              e.key === "Backspace" &&
                              e.target.value === "__ / "
                            ) {
                              e.preventDefault();
                              e.target.value = "";
                            }
                          }}
                          onBlur={(e) => {
                            // Get current date for comparison
                            const now = new Date();
                            const currentYear = now.getFullYear() % 100; // Get last 2 digits
                            const currentMonth = now.getMonth() + 1; // Jan is 0

                            // Extract month and year from input
                            const value = e.target.value;
                            const parts = value.split(" / ");

                            if (parts.length !== 2 || parts[1].length !== 2) {
                              e.target.setCustomValidity(
                                "Please enter a valid expiry date (MM / YY)"
                              );
                              return;
                            }

                            const month = parseInt(parts[0]);
                            const year = parseInt(parts[1]);

                            // Validate future date
                            if (
                              year < currentYear ||
                              (year === currentYear && month < currentMonth)
                            ) {
                              e.target.setCustomValidity("Card has expired");
                            } else {
                              e.target.setCustomValidity("");
                            }
                          }}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-main-color focus:ring-2 focus:ring-main-color focus:ring-opacity-50 transition-all duration-200"
                        />
                      </div>
                      <div className="form-group">
                        <label
                          htmlFor="cvv"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          CVV*
                        </label>
                        <input
                          required
                          type="text"
                          name="cvv"
                          id="cvv"
                          placeholder=""
                          maxLength={3}
                          onChange={(e) => {
                            // Only allow digits
                            let value = e.target.value;
                            value = value.replace(/\D/g, "");
                            e.target.value = value;
                            setCvv(value);
                          }}
                          onBlur={(e) => {
                            // Validate CVV length (3-4 digits)
                            const value = e.target.value;
                            if (value.length < 3 || value.length > 4) {
                              e.target.setCustomValidity(
                                "CVV must be 3-4 digits"
                              );
                            } else {
                              e.target.setCustomValidity("");
                            }
                          }}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-main-color focus:ring-2 focus:ring-main-color focus:ring-opacity-50 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Right side - Order Summary */}
            <div className="lg:w-4/12">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 shadow-xl">
                <h3 className="text-xl text-white font-bold mb-4">
                  {t.orderSummary}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t.subtotal}</span>
                    <span className="font-medium text-main-color whitespace-nowrap">
                      KD {couponSuccess ? total * 0.8 : total.toFixed(2)}
                    </span>
                  </div>

                  {/* Add a divider with styling */}
                  <div className="border-t border-gray-600 my-4"></div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-white">
                        {t.total}
                      </span>
                      <span className="text-lg text-main-color font-bold">
                        KD {couponSuccess ? total * 0.8 : total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Coupon input */}
                  <div className="flex items-center justify-between mt-4">
                    {couponMessage.length > 0 && (
                      <span className="text-sm text-red-400">
                        {couponMessage}
                      </span>
                    )}
                    {couponSuccess && (
                      <span className="text-sm text-green-400">
                        Added 20% OFF 🔥
                      </span>
                    )}
                  </div>
                  <div className="pt-4">
                    <form
                      onSubmit={couponHandler}
                      className="flex flex-wrap gap-2"
                    >
                      <input
                        type="text"
                        name="coupon"
                        required
                        placeholder="Coupon code"
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-main-color focus:ring-2 focus:ring-main-color focus:ring-opacity-50 transition-all duration-200"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all duration-200"
                      >
                        Apply
                      </button>
                    </form>
                  </div>

                  {backError.length > 0 && (
                    <div className="mt-4 bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4">
                      <ul className="space-y-2">
                        {backError.map((error: any, index: number) => (
                          <li
                            key={index}
                            className="text-red-400 flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              />
                            </svg>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Secure payment notice */}
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-4">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>{t.securePayment}</span>
                  </div>

                  {/* Submit Button */}
                  {method == 1 && (
                    <button
                      onClick={submitHandler}
                      disabled={requestSent || !isCardValid} // Disable button if card is invalid
                      className="w-full mt-4 bg-main-color text-black font-bold py-4 rounded-lg
                   hover:bg-main-color/90 transition-all duration-300 disabled:opacity-50
                   disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      {requestSent ? t.loading : t.buyNow}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Cart Details Section */}
      <div className=" rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-200">{t.cartItems}</h2>

        <div className="space-y-4">
          {seats.length === 0 ? (
            <div className="text-center py-8">
              <h1 className="text-2xl font-medium text-gray-200 mb-4">
                {t.nothingInCart1}
              </h1>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-main-color text-complement-color rounded-lg hover:bg-main-color/90 transition-colors"
              >
                {t.nothingInCart2}
              </Link>
            </div>
          ) : (
            seats.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-gray-800 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors"
              >
                <div className="flex-grow">
                  <h3 className="font-bold text-lg mb-1 text-gray-200">
                    {item.name}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t.typeName}:</span>
                      <span
                        style={{ backgroundColor: item.color }}
                        className={`px-2 py-1 rounded text-white font-medium`}
                      >
                        {item.type_name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <span className="text-lg font-bold text-main-color whitespace-nowrap">
                    kD {item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
          <p className="flex justify-center items-center w-full">
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="flex justify-center items-center bg-main-color hover:bg-secondary-color text-complement-color font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-110"
            >
              {t.backToTop} <BsArrowUp />
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
