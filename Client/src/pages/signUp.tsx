import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ar, enUS } from "../../translation";
import axios from "axios";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
function SignUp() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const router = useRouter();
  const { status } = useSession();

  const cart = useSelector((state: RootState) => state.basket.items);
  const language = useSelector((state: RootState) => state.language.value);

  const [locations, setLocations] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [t, setT] = useState(language === 0 ? enUS : ar);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status]);

  useEffect(() => {
    if (db_link === "") return;
    const fetchLocations = async () => {
      try {
        setIsFetching(true);
        const res = await axios.get(`${db_link}api/locations`);
        setLocations(res.data);
      } catch {
        console.error("Failed to fetch locations");
      } finally {
        setIsFetching(false);
      }
    };
    fetchLocations();
  }, [db_link]);

  useEffect(() => {
    const lang = localStorage.getItem("nepShopLang");
    setT(lang === "1" ? ar : enUS);
  }, [language]);

  const validatePassword = (password: string) => ({
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    small: /[a-z]/.test(password),
    number: /\d/.test(password),
  });

  const passwordValidation = validatePassword(password);
  const initializeCart = (data: any, password: string) => {
    signIn("credentials", {
      phone: data.phone,
      password: password,
      cart: JSON.stringify(cart),
      db_link,
      redirect: false,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data;
    if (formData.get("hasReferrer") === "on" && formData.get("ref_id") === "") {
      setErrors([t.refIdRequired]);
      setIsLoading(false);
      return;
    } else {
      setErrors([]);
    }
    if (formData.get("hasReferrer") === "on") {
      data = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        location_id: formData.get("location"),
        password: formData.get("password"),
        password_confirmation: formData.get("password"),
        ref_id: formData.get("ref_id"),
        cart_items: cart,
      };
    } else {
      data = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        location_id: formData.get("location"),
        password: formData.get("password"),
        password_confirmation: formData.get("password"),
        cart_items: cart,
      };
    }
    const mapErrors = (errors: any) => {
      const localizedErrors = errors.map((errorArray: any) => {
        const message = errorArray[0]; // Backend error messages are usually arrays
        if (t === enUS) {
          switch (message) {
            case "The phone field format is invalid.":
              return "The Username Is Invalid";
            case "The phone has already been taken.":
              return "The Username Has Already Been Taken";
            default:
              if (message.includes("password")) return t.passwordMessage;
              if (message.includes("location")) return "الرجاء اختيار الموقع";
              return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى";
          }
        }
        // Translate errors to Arabic
        switch (message) {
          case "The name field must be at least 3 characters.":
            return "الأسم يجب ان يكون 3 أحرف على الأقل";
          case "The phone field format is invalid.":
            return "اسم المستخدم غير صحيح";
          case "The phone has already been taken.":
            return "اسم المستخدم موجود مسبقًا";
          case "The name field is required.":
            return "حقل الاسم مطلوب";
          case "The phone field is required.":
            return "حقل رقم الهاتف مطلوب";
          case "The password field is required.":
            return "حقل كلمة المرور مطلوب";
          case "The selected ref id is invalid.":
            return "رقم الإحالة غير صالح";
          default:
            if (message.includes("password")) return t.passwordMessage;
            if (message.includes("location")) return "الرجاء اختيار الموقع";
            return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى";
        }
      });
      return localizedErrors;
    };
    setIsLoading(false);
    axios
      .post(`${db_link}api/register`, data)
      .then((res) => {
        setErrors([]);
        initializeCart(res.data, formData.get("password") as string);
      })
      .catch((err) => {
        const errors = Object.values(err.response?.data?.errors || {});
        setErrors(mapErrors(errors));
        setIsLoading(false);
      });
    // Add a timeout before calling signIn to ensure backend has processed the cart
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-complement-color to-gray-800 py-8 px-4"
      dir={t === enUS ? "ltr" : "rtl"}
    >
      <div className="max-w-md w-full bg-complement-color rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <Image
            src="/account/signUp.webp"
            alt="Sign up illustration"
            width={200}
            height={200}
            className="mx-auto rounded-lg"
          />
          <h1 className="text-2xl font-bold text-gray-200 mt-4">
            {t.createYourAcc}
          </h1>
          <p className="text-gray-300">{t.signup}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200 pb-1"
            >
              {t.name}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder={t.name}
              className="block w-full text-gray-200 bg-gray-700 px-4 py-3 rounded-lg border border-gray-900 shadow-sm focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-200 pb-1"
            >
              {t.userName}
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="block w-full text-gray-200 bg-gray-700 px-4 py-3 rounded-lg border border-gray-900 shadow-sm focus:ring-2 focus:ring-yellow-500"
              placeholder="mr_x"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 pb-1"
            >
              {t.password}
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full text-gray-200 bg-gray-700 px-4 py-3 rounded-lg border border-gray-900 shadow-sm focus:ring-2 focus:ring-yellow-500"
              required
            />
            <div className="mt-4 space-y-2">
              {Object.entries(passwordValidation).map(([key, valid]) => (
                <div key={key} className="flex items-center space-x-2">
                  {valid ? (
                    <span className="text-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="text-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414 1.414L11.414 10l-.293.293a1 1 0 001.414 1.414l2-2a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  <p
                    className={`text-sm ${
                      valid ? "text-green-500" : "text-gray-300"
                    }`}
                  >
                    {key === "length"
                      ? t.passwordLength
                      : key === "capital"
                      ? t.passwordCapital
                      : key === "small"
                      ? t.passwordSmall
                      : key === "number"
                      ? t.passwordNumber
                      : "Error Password"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, idx) => (
                <p key={idx} className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-black font-semibold transition-all ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-main-color hover:bg-secondary-color focus:ring-4 focus:ring-gray-700"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <span>{t.login}</span>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </span>
            ) : (
              t.signup
            )}
          </button>
        </form>
        <p className="text-center text-sm text-gray-200 mt-6">
          {t.alreadyHaveAcc}{" "}
          <button
            onClick={() => signIn()}
            className="text-main-color hover:underline"
          >
            {t.login}
          </button>
        </p>
      </div>
    </section>
  );
}

export default SignUp;
