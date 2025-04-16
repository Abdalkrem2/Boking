import Link from "next/link";
import { useEffect, useState } from "react";
import { BiEnvelopeOpen, BiPaperPlane } from "react-icons/bi";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
import { useRouter } from "next/router";

function Footer() {
  const router = useRouter();
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
  if (
    router.pathname == "/checkout/knet" ||
    router.pathname == "/checkout/card-code" ||
    router.pathname == "/arena/[index]"
  )
    return <span></span>;
  return (
    <footer
      className="bg-gradient-to-b from-white to-gray-50 sm:mt-2 md:mt-5 mb-16 sm:mb-0"
      dir={t == enUS ? "ltr" : "rtl"}
    >
      {/* Links Section */}
      <div
        className={`py-12 px-4 sm:px-10 md:px-20 lg:px-32 bg-gradient-to-b from-complement-color to-gray-800`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Important Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-200">
              {t.importantLinks}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.whoWeAre}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.contactUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.NEPTeam}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.termsOfUse}
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-200">{t.getInTouch}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.contactUs}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.becomePartner}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.whoWeAre}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.location}
                </Link>
              </li>
            </ul>
          </div>

          {/* NEP Payment */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-200">{t.NEPPayment}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.cart}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.products}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.paymentAgreement}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.specialDeals}
                </Link>
              </li>
            </ul>
          </div>

          {/* Let Us Help */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-200">{t.letUsHelp}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.contactSupport}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.termsOfUse}
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-gray-300 hover:text-main-color transition-all"
                >
                  {t.yourAccount}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="bg-complement-color border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-10 md:px-20 lg:px-32 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-200">
                &copy; {new Date().getFullYear()}{" "}
                <Link
                  href="/"
                  className="text-main-color hover:text-secondary-color font-medium"
                >
                  Eventat
                </Link>
                . All rights reserved.
              </p>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/eventat/"
                target="_blank"
                className="text-gray-200 hover:text-main-color transition-all hover:scale-110"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="https://www.facebook.com/eventat"
                target="_blank"
                className="text-gray-200 hover:text-main-color transition-all hover:scale-110"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="mailto:eventat@gmail.com"
                className="text-gray-200 hover:text-main-color transition-all hover:scale-110"
              >
                <BiEnvelopeOpen className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
