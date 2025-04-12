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
  FaClock,
  FaLocationArrow,
  FaTicketAlt,
} from "react-icons/fa";
import Link from "next/link";
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
        console.log(res.data.halls);
        setProductData(res.data.product[0]);
        setHalls(res.data.halls);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [productId, db_link]);
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[0]");
    setIsFavorite(favorites.includes(Number(productId)));
  }, [productId]);
  const handleFavorite = (id: number) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[0]");

    if (isFavorite) {
      // Remove from favorites, but keep 0 as first element
      const newFavorites = favorites.filter((favId: number) => favId !== id);
      if (!newFavorites.includes(0)) {
        newFavorites.unshift(0);
      }
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      localStorage.removeItem("favCache");
    } else {
      // Add to favorites, ensuring 0 remains as first element
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
    // Remove # if present
    hex = hex.replace("#", "");

    // Parse r, g, b values
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
          {/* Status Message */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Image Gallery Section */}
            <div className="space-y-2 w-full ">
              {/* Main Image */}
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

            {/* Product Details Section */}
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
              {/* Action Buttons */}
              {productData.state == 0 ? (
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={() => {
                      document.getElementById("booking")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                      setTimeout(() => window.scrollBy(0, -85), 500);
                    }}
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
              ) : (
                <p className="text-center text-red-500 border border-red-500 rounded-lg p-2 w-fit mx-auto">
                  {t.notAvailable}
                </p>
              )}
            </div>
          </div>
          {/* Halls Section */}
          <div className="mt-10">
            <h2 id="booking" className="text-2xl font-bold text-gray-200 mb-4">
              {t.availableHalls}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {halls.length > 0 ? (
                halls.map((hall: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-gray-200">
                      {t == enUS ? hall.name : hall.nameAr}
                    </h3>
                    <p className="text-gray-300">{hall.description}</p>
                    <p className="text-gray-300">
                      <FaCalendarAlt className="inline" /> {hall.time}
                    </p>
                    <p className="text-gray-300">
                      <FaClock className="inline" /> {hall.duration}
                    </p>
                    {/* available? */}
                    <p className="text-gray-300">
                      {hall.state == 0 ? (
                        <span className="text-green-500">{t.available}</span>
                      ) : hall.state == 1 ? (
                        <span className="text-red-500">{t.outOfTickets}</span>
                      ) : (
                        <span className="text-red-500">{t.notAvailable}</span>
                      )}
                    </p>
                    {/* Book Now Button */}
                    {hall.state == 0 && (
                      <Link
                        href={`/halls/${hall.id}`}
                        className="mt-2 px-4 py-2 bg-main-color text-complement-color rounded-lg hover:bg-secondary-color block w-fit"
                      >
                        {t.bookNow}
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-gray-800/50 p-8 rounded-lg text-center w-full">
                  <p className="text-xl md:text-2xl font-semibold text-gray-300">
                    {t.notAvailable}
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
