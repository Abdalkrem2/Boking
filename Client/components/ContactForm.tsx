"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { ar, enUS } from "../translation";
function ContactForm() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language == 0 ? enUS : ar);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") == "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") == "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  const [backError, setBackError] = useState<any>(false);
  const [message, setMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // Add state for form fields
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    contact: "",
    message: "",
  });

  // Add error state
  const [errors, setErrors] = useState({
    contact: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Validate contact info
    if (id === "contact") {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      const phoneRegex =
        /^(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?(\d{3}[-.\s]?)?\d{4}$/;

      setErrors((prev) => ({
        ...prev,
        contactInfo:
          emailRegex.test(value) || phoneRegex.test(value)
            ? ""
            : "Please enter a valid email or U.S. phone number",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (db_link === "") return;
    setBackError(false);
    setMessage(false);
    setIsSubmitting(true);
    axios
      .post(`${db_link}api/client/message`, formData)
      .then((res) => {
        if (res.data === "Your order has been sent successfully") {
          setIsSubmitting(false);
          setFormData({
            f_name: "",
            l_name: "",
            contact: "",
            message: "",
          });
          setDisabled(true);
          setMessage(true);
        } else {
          if (res.data.errors) {
            setIsSubmitting(false);
            setMessage(false);
            setBackError(res.data.errors);
          }
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        setMessage(false);
      });
  };

  return (
    <section
      dir={`${t == enUS ? "ltr" : "rtl"}`}
      id="contact-form"
      className="w-full px-4 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-20 bg-gradient-to-br from-slate-50 to-slate-100"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-10 border border-slate-100">
        <h2 className="text-4xl font-bold text-text-col mb-8 text-center">
          {t.getInTouch}
          <div className="h-1 w-20 bg-main-color mx-auto mt-2 rounded-full"></div>
        </h2>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label
                htmlFor="f_name"
                className="block text-sm font-semibold text-text-col mb-2"
              >
                {t.fName}
              </label>
              <input
                type="text"
                id="f_name"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-main-color focus:ring-1 focus:ring-main-color transition-all duration-200"
                required
                value={formData.f_name}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="l_name"
                className="block text-sm font-semibold text-text-col mb-2"
              >
                {t.lName}
              </label>
              <input
                type="text"
                id="l_name"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-main-color focus:ring-1 focus:ring-main-color transition-all duration-200"
                required
                value={formData.l_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-semibold text-text-col mb-2"
            >
              {t.contactInfo}
            </label>
            <input
              type="text"
              id="contact"
              pattern="^(\+?1?\d{10}|\+?1?\d{3}[-.]?\d{3}[-.]?\d{4}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$"
              title="Please enter a valid email address or phone number"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-main-color focus:ring-1 focus:ring-main-color transition-all duration-200"
              placeholder="email@example.com or 1234567890"
              required
              value={formData.contact}
              onChange={handleChange}
            />
            {errors.contact && (
              <span className="text-red-500 text-sm mt-1">
                {errors.contact}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-text-col mb-2"
            >
              {t.message}
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-main-color focus:ring-1 focus:ring-main-color transition-all duration-200 resize-none"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          {backError && backError.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <ul className="space-y-2">
                {backError.map((error: any, index: number) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-red-600"
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {message && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <p className="text-sm text-green-600">{t.messageSent}</p>
            </div>
          )}
          {!disabled && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-main-color text-white px-8 py-4 rounded-lg font-bold hover:bg-secondary-color transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto sm:self-center"
            >
              {t.send}
            </button>
          )}
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
