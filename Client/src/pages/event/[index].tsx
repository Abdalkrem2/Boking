import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ar, enUS } from "../../../translation";
import { useSession } from "next-auth/react";
import {
  FaCalendarAlt,
  FaLocationArrow,
  FaTicketAlt,
  FaTimes,
} from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function getLocale(t: any) {
  return t === enUS ? "en-US" : "ar-EG";
}

function getDayName(dateString: string, t: any) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(getLocale(t), { weekday: "long" }).format(
    date
  );
}

function getDayNumber(dateString: string) {
  const date = new Date(dateString);
  return date.getDate();
}

function getMonthName(dateString: string, t: any) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(getLocale(t), { month: "long" }).format(date);
}

function Product() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const productId: any = router.query.index;
  const language = useSelector((state: RootState) => state.language.value);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [productData, setProductData] = useState<any>({
    colors: "N/A:red+sky+green+yellow+black+white+",
    description:
      "you can't find this product in any place and we have the cheapest costs",
    descriptionAr:
      "المنتج الافضل الذي لن تجده في اي مكان اخر ومقابل اسعار منافسة جدا",
    discounted_price: "200",
    image: "watch.png",
    name: "Please Wait",
    color: "#000000",
    terms: "الرجاء الانتظار+الرجاء الانتظار",
    nameAr: "الرجاء الانتظار",
  });
  const [halls, setHalls] = useState<any>([]);
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
    if (db_link === "") return;
    setLoading(true);
    axios
      .get(`${db_link}api/normal/products/${productId}`)
      .then((res) => {
        setProductData(res.data.product[0]);
        setHalls(res.data.halls);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [productId, db_link]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[0]");
    setIsFavorite(favorites.includes(Number(productId)));
  }, [productId]);

  const handleFavorite = (id: number) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[0]");

    if (isFavorite) {
      const newFavorites = favorites.filter((favId: number) => favId !== id);
      if (!newFavorites.includes(0)) {
        newFavorites.unshift(0);
      }
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      localStorage.removeItem("favCache");
    } else {
      if (!favorites.includes(0)) {
        favorites.unshift(0);
      }
      favorites.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      localStorage.removeItem("favCache");
    }

    setIsFavorite(!isFavorite);
  };

  function hexToRgba(hex: string, opacity: number) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return (
    <>
      <Head>
        <title>
          {productData && productData.name
            ? productData.name
            : `Event ${productId}`}
        </title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <AiOutlineLoading3Quarters className="w-12 h-12 animate-spin text-main-color" />
        </div>
      ) : productData ? (
        <section
          className="max-w-7xl mx-auto px-4 py-8 rounded-3xl mt-2 sm:px-6 lg:px-8"
          style={{
            background: `linear-gradient(to bottom left, ${hexToRgba(
              productData.color,
              0.25
            )}, #1f2227)`,
          }}
          dir={t == enUS ? "ltr" : "rtl"}
        >
          {message && (
            <div
              className={`mb-6 transition-all duration-300 ${
                message.includes("wrong")
                  ? "bg-red-100 border-red-500"
                  : "bg-green-100 border-main-color"
              } border-l-4 p-4 rounded-r`}
            >
              <p className="text-sm">{message}</p>
            </div>
          )}

          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden"
              style={{ overflow: "hidden" }}
            >
              <div
                className="bg-gray-900 rounded-lg p-6 w-full mx-4 transform transition-all duration-300 ease-out max-w-sm"
                style={{
                  animation: "modalSlideIn 0.3s ease-out forwards",
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-200">
                    {t.availableHalls}
                  </h2>
                  <button
                    onClick={handleModalClose}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto scrollbar-hidden">
                  {halls.length > 0 ? (
                    halls.map((hall: any, index: number) => (
                      <div
                        onClick={() => {
                          if (hall.state == 0) {
                            router.push(`/halls/${hall.id}`);
                          } else {
                            setMessage(t.notAvailable);
                          }
                        }}
                        key={index}
                        className={` bg-gray-800 hover:bg-gray-700 transition-all shadow-md flex flex-row ${
                          hall.state == 0
                            ? "cursor-pointer"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-start text-complement-color bg-main-color p-2 min-w-[90px] rounded-lg">
                          <p className="text-sm text-center">
                            {getDayName(hall.time, t)}
                          </p>
                          <p className="text-4xl text-center font-extrabold">
                            {getDayNumber(hall.time)}
                          </p>
                          <p className="text-sm text-center">
                            {getMonthName(hall.time, t)}
                          </p>
                        </div>
                        <div className="flex flex-col px-2 py-4 w-full">
                          <h4
                            className="text-gray-200 font-bold text-lg ltr:text-start mb-2 rtl:text-end"
                            dir="ltr"
                          >
                            {hall.duration}
                          </h4>
                          {hall.state == 0 ? (
                            hall.description && (
                              <p className="text-gray-300 text-sm">
                                {hall.description.length > 15
                                  ? hall.description.slice(0, 15) + "..."
                                  : hall.description}
                              </p>
                            )
                          ) : hall.state == 1 ? (
                            <p className="w-full bg-gray-900 px-1 rounded-lg text-gray-200 text-center font-bold">
                              {t.outOfTickets}
                            </p>
                          ) : (
                            hall.state == 2 && (
                              <p className="w-full bg-gray-900 px-1 rounded-lg text-gray-200 text-center font-bold">
                                {t.canceled}
                              </p>
                            )
                          )}
                        </div>
                        <div className="flex items-center justify-end px-2">
                          {t === ar ? (
                            <IoIosArrowBack className="text-gray-400 w-6 h-6" />
                          ) : (
                            <IoIosArrowForward className="text-gray-400 w-6 h-6" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-800/50 p-8 rounded-lg text-center w-full col-span-2">
                      <p className="text-xl md:text-2xl font-semibold text-gray-300">
                        {t.notAvailable}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2 w-full ">
              <div className="aspect-square relative rounded-xl overflow-hidden sm:max-w-sm w-full">
                <Image
                  src={`${db_link}img/products/${productData.image}`}
                  unoptimized={true}
                  alt={`event image`}
                  fill
                  className="bg-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-200">
                  {t === enUS ? productData.name : productData.nameAr}
                </h1>
                <p className="text-gray-300 leading-relaxed">
                  {productData.description}
                </p>
                <p className="text-gray-300 leading-relaxed border-t-2 border-main-color/60 pt-2 mt-2">
                  <FaCalendarAlt className="inline" /> {productData.date_desc}
                </p>
                <p className="text-gray-300 leading-relaxed mt-2">
                  <FaLocationArrow className="inline" />{" "}
                  {productData.location_desc}
                </p>
                <ul className="pt-5 flex flex-col gap-1">
                  <li className="font-bold text-gray-300">معلومات مهمة:</li>
                  {productData.terms.split("+").map((item: any) => (
                    <li className="text-gray-300">- {item}</li>
                  ))}
                </ul>
              </div>

              {productData.state == 0 ? (
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={handleModalOpen}
                    className="flex-1 px-6 py-3 rounded-lg bg-main-color text-complement-color font-bold 
              hover:bg-secondary-color transition-colors duration-200 items-center flex gap-2 justify-center"
                  >
                    <FaTicketAlt className="inline text-xl" /> {t.bookNow}
                  </button>

                  <button
                    onClick={() => handleFavorite(Number(productId))}
                    className="w-full sm:w-auto px-6 sm:px-3 py-3 rounded-lg bg-gray-700 hover:bg-gray-500 
              transition-colors duration-200 flex items-center justify-center"
                  >
                    {isFavorite ? (
                      <AiFillHeart className="w-6 h-6 text-red-500" />
                    ) : (
                      <AiOutlineHeart className="w-6 h-6 text-gray-100" />
                    )}
                  </button>
                </div>
              ) : productData.state == 1 ? (
                <div className="flex items-center justify-center">
                  <p className="text-center text-red-500 bg-red-500/10 border-2 border-red-500/50 rounded-lg px-6 py-3 font-semibold">
                    {t.outOfTickets}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-center text-red-500 bg-red-500/10 border-2 border-red-500/50 rounded-lg px-6 py-3 font-semibold">
                    {t.notActive}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-200 text-center mt-10">
            {t.eventNotFound}
          </h1>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-3 rounded-lg bg-main-color text-complement-color font-bold 
            hover:bg-secondary-color transition-colors duration-200 items-center flex gap-2 justify-center"
          >
            {t.backHome}
          </button>
        </div>
      )}
    </>
  );
}

export default Product;
