import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ar, enUS } from "../../../translation";
import { BsBag, BsPencilSquare } from "react-icons/bs";
import Head from "next/head";
import { FaBlind, FaBoxes } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { BiListOl, BiListUl } from "react-icons/bi";
function Profile() {
  const { data: session, status } = useSession();
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
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section
        className="min-h-[calc(100vh-4rem)] sm:px-10 md:px-20 lg:px-32 sm:mt-2 md:mt-5"
        dir={t == enUS ? "ltr" : "rtl"}
      >
        <div className="flex md:flex-row flex-col-reverse md:justify-between justify-center items-center gap-8 p-6">
          <div className="basis-1/2 flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <div className="space-y-4 w-full">
              <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
                {session?.user.name}
              </h1>
              <div className="space-y-3">
                <p className="text-lg text-gray-700 flex items-center gap-2">
                  <span className="font-semibold">{t.userName}:</span>
                  <span>{session?.user.phone}</span>
                </p>
                {session?.user.email && (
                  <p className="text-lg text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">{t.email}:</span>
                    <span>{session?.user.email}</span>
                  </p>
                )}

                <p className="text-lg text-gray-700 flex items-center gap-2">
                  <span className="font-semibold">{t.location}:</span>
                  <span>Kuwait</span>
                </p>

                {session?.user.address1 && (
                  <p className="text-lg text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">{t.address1}:</span>
                    <span>{session?.user.address1}</span>
                  </p>
                )}
                {session?.user.address2 && (
                  <p className="text-lg text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">{t.address2}:</span>
                    <span>{session?.user.address2}</span>
                  </p>
                )}
                {session?.user.location_link && (
                  <p className="text-lg text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">{t.locationLink}:</span>
                    <button
                      onClick={() =>
                        window.open(session?.user.location_link, "_blank")
                      }
                      className="ml-2 px-2 py-1 text-sm bg-main-color text-white rounded hover:bg-secondary-color transition-colors"
                    >
                      {t.location}
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
