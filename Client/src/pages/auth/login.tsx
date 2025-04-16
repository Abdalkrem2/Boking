import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ar, enUS } from "../../../translation";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

function Login() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  const language = useSelector((state: RootState) => state.language.value);
  const [t, setT] = useState(language === 0 ? enUS : ar);

  useEffect(() => {
    const lang = localStorage.getItem("nepShopLang");
    setT(lang === "1" ? ar : enUS);
  }, [language]);

  const [message, setMessage] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const cart = useSelector((state: RootState) => state.basket.items);
  const validatePhone = (value: string) => {
    const isValid = value.length > 3;
    setPhoneValid(isValid);
    return isValid;
  };

  const validatePassword = (value: string) => {
    const isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);
    setPasswordValid(isValid);
    return isValid;
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const phone = e.target[0].value;
    const password = e.target[1].value;

    if (validatePhone(phone) && validatePassword(password)) {
      const result = await signIn("credentials", {
        phone,
        password,
        cart: JSON.stringify(cart),
        db_link,
        redirect: false,
      });

      if (result?.ok) {
        setRequestSent(false);
        setMessage("");
      } else {
        setRequestSent(false);
        setMessage(t.invalidCredential);
      }
    } else {
      setRequestSent(false);
      setMessage(t.invalidCredential);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-complement-color to-gray-800 py-8 px-4"
      dir={t === enUS ? "ltr" : "rtl"}
    >
      <div className="max-w-md w-full bg-complement-color rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <Image
            src="/account/login.webp"
            alt="Login illustration"
            width={200}
            height={200}
            className="mx-auto rounded-lg"
          />
          <h1 className="text-2xl font-bold text-gray-200 mt-4">
            {t.loginToYourAcc}
          </h1>
          <p className="text-gray-300">{t.welcomBack}</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-200 pb-1"
            >
              {t.userName}
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                id="phone"
                name="phone"
                className={`block w-full text-gray-200 bg-gray-700 px-4 py-3 rounded-lg border shadow-sm focus:ring-2 ${
                  phoneValid ? "border-green-500" : "border-gray-800"
                }`}
                placeholder="50123456 or +96550123456"
                onChange={(e) => validatePhone(e.target.value)}
              />
              <div className="absolute top-3 rtl:left-3 ltr:right-3 text-lg">
                {phoneValid ? (
                  <AiOutlineCheck className="text-green-500" />
                ) : (
                  <AiOutlineClose className="text-gray-300" />
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 pb-1"
            >
              {t.password}
            </label>
            <div className="mt-1 relative">
              <input
                type="password"
                id="password"
                name="password"
                className={`block w-full text-gray-200 bg-gray-700 px-4 py-3 rounded-lg border shadow-sm focus:ring-2 ${
                  passwordValid ? "border-green-500" : "border-gray-800"
                }`}
                placeholder="••••••••"
                onChange={(e) => validatePassword(e.target.value)}
              />
              <div className="absolute top-3 rtl:left-3 ltr:right-3 text-lg">
                {passwordValid ? (
                  <AiOutlineCheck className="text-green-500" />
                ) : (
                  <AiOutlineClose className="text-gray-300" />
                )}
              </div>
            </div>
          </div>

          {message && (
            <p className="text-sm text-red-600 text-center">{message}</p>
          )}

          <button
            type="submit"
            className={`w-full py-3 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg text-complement-color font-semibold transition-all ${
              phoneValid && passwordValid
                ? "bg-main-color hover:bg-secondary-color focus:ring-4 focus:ring-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!(phoneValid && passwordValid) || requestSent}
          >
            {t.login}
          </button>
        </form>

        <p className="text-center text-sm text-gray-200 mt-6">
          {t.dontHaveAcc}{" "}
          <Link href="/signUp" className="text-main-color hover:underline">
            {t.signup}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
