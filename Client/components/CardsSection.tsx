import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
import axios from "axios";
import { Navigation, Lazy, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/lazy";
import "swiper/css/pagination";
import { HiOutlineEmojiSad } from "react-icons/hi";
import Image from "next/image";
interface Product {
  categoriesNames: any;
  products1: [{ id: number; name: string; nameAr: string; image: string }];
  products2: [{ id: number; name: string; nameAr: string; image: string }];
  products3: [{ id: number; name: string; nameAr: string; image: string }];
}
function CardsSection() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [loading, setLoading] = useState<boolean>(true);
  const [productsData, setProductsData] = useState<Product | null>(null);

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

    // Check if cached data exists and is less than 5 hours old
    const cachedData = localStorage.getItem("cachedProducts");
    const cacheTime = localStorage.getItem("cachedProductsTime");

    if (cachedData && cacheTime) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - parseInt(cacheTime);
      const fiveHoursInMs = 5 * 60 * 1000;

      if (timeDiff < fiveHoursInMs) {
        // Use cached data if it's fresh enough
        setProductsData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }
    }

    // If no valid cache exists, fetch fresh data
    setLoading(true);
    axios
      .get(`${db_link}api/productsCategory`)
      .then((res) => {
        if (res.data) {
          setProductsData(res.data);
          // Cache the new data with current timestamp
          localStorage.setItem("cachedProducts", JSON.stringify(res.data));
          localStorage.setItem(
            "cachedProductsTime",
            new Date().getTime().toString()
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [db_link]);
  return loading ? (
    <div className="flex items-center justify-center min-h-[60vh] animate-pulse">
      <div className="relative">
        <div
          className="w-20 h-20 border-4 border-main-color rounded-full animate-spin"
          style={{ borderTopColor: "var(--main-color)" }}
        ></div>
      </div>
    </div>
  ) : (
    <>
      <div className={`my-10 px-4 sm:px-10 md:px-20 lg:px-32`}>
        <h2 className="text-2xl text-gray-500 font-bold">
          {productsData?.categoriesNames[0].name}
        </h2>
        <Swiper
          dir="ltr"
          className=""
          modules={[Navigation, Lazy, Pagination]}
          navigation={false}
          pagination={{ clickable: true }}
          lazy={true}
          breakpoints={{
            900: {
              slidesPerView: 4,
            },
            500: {
              slidesPerView: 3,
            },
            100: {
              slidesPerView: 2,
            },
          }}
        >
          {/* first Products */}
          {productsData && productsData.products1.length > 0 ? (
            productsData.products1.map((item: any, i: number) => (
              <SwiperSlide key={i}>
                <Link
                  href={`/event/${item.id}`}
                  className="group relative flex flex-col items-center p-4 transition-all duration-300 hover:scale-[1.02] pb-8"
                >
                  {item.state == 1 && (
                    <span
                      className="absolute top-2 right-2 z-20 bg-gradient-to-r from-red-600 to-red-500 
                    px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg 
                    transform -rotate-2 hover:rotate-0 transition-transform duration-300
                    border-2 border-red-400/20 backdrop-blur-sm"
                    >
                      {t.outOfTickets}
                    </span>
                  )}

                  {/* Image Container with Hover Effect */}
                  <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-xl mb-2">
                    <Image
                      fill
                      src={`${db_link}img/products/${item.image}`}
                      alt={item.name}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                    {/* Overlay Effect */}
                    <div className="absolute inset-0 bg-black/10 transition-all duration-300 group-hover:bg-black/20" />
                  </div>

                  {/* Content */}
                  <div className="w-full text-center">
                    <h3 className="text-lg font-semibold text-gray-200 line-clamp-1 mb-1">
                      {t == enUS ? item.name : item.nameAr}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full bg-main-color/10 py-5 px-2 rounded">
              <h1 className="text-gray-200 text-center text-2xl mb-1">
                {t.thereIsNoSubCategories}
              </h1>
              <p className="text-main-color text-4xl">
                <HiOutlineEmojiSad />
              </p>
            </div>
          )}
        </Swiper>
      </div>
      <div className={`my-10 px-4 sm:px-10 md:px-20 lg:px-32`}>
        <h2 className="text-2xl text-gray-500 font-bold">
          {productsData?.categoriesNames[1].name}
        </h2>
        <Swiper
          dir="ltr"
          className=""
          modules={[Navigation, Lazy, Pagination]}
          navigation={false}
          pagination={{ clickable: true }}
          lazy={true}
          breakpoints={{
            900: {
              slidesPerView: 4,
            },
            500: {
              slidesPerView: 3,
            },
            100: {
              slidesPerView: 2,
            },
          }}
        >
          {/* first Products */}
          {productsData && productsData.products2.length > 0 ? (
            productsData.products2.map((item: any, i: number) => (
              <SwiperSlide key={i}>
                <Link
                  href={`/event/${item.id}`}
                  className="group relative flex flex-col items-center p-4 transition-all duration-300 hover:scale-[1.02] pb-8"
                >
                  {item.state == 1 && (
                    <span
                      className="absolute top-2 right-2 z-20 bg-gradient-to-r from-red-600 to-red-500 
                    px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg 
                    transform -rotate-2 hover:rotate-0 transition-transform duration-300
                    border-2 border-red-400/20 backdrop-blur-sm"
                    >
                      {t.outOfTickets}
                    </span>
                  )}
                  {/* Image Container with Hover Effect */}
                  <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-xl mb-2">
                    <Image
                      fill
                      src={`${db_link}img/products/${item.image}`}
                      alt={item.name}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                    {/* Overlay Effect */}
                    <div className="absolute inset-0 bg-black/10 transition-all duration-300 group-hover:bg-black/20" />
                  </div>

                  {/* Content */}
                  <div className="w-full text-center">
                    <h3 className="text-lg font-semibold text-gray-200 line-clamp-1 mb-1">
                      {t == enUS ? item.name : item.nameAr}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full bg-main-color/10 py-5 px-2 rounded">
              <h1 className="text-gray-200 text-center text-2xl mb-1">
                {t.thereIsNoSubCategories}
              </h1>
              <p className="text-main-color text-4xl">
                <HiOutlineEmojiSad />
              </p>
            </div>
          )}
        </Swiper>
      </div>
      <div className={`my-10 px-4 sm:px-10 md:px-20 lg:px-32`}>
        <h2 className="text-2xl text-gray-500 font-bold">
          {productsData?.categoriesNames[2].name}
        </h2>
        <Swiper
          dir="ltr"
          className=""
          modules={[Navigation, Lazy, Pagination]}
          navigation={false}
          pagination={{ clickable: true }}
          lazy={true}
          breakpoints={{
            900: {
              slidesPerView: 4,
            },
            500: {
              slidesPerView: 3,
            },
            100: {
              slidesPerView: 2,
            },
          }}
        >
          {/* first Products */}
          {productsData && productsData.products3.length > 0 ? (
            productsData.products3.map((item: any, i: number) => (
              <SwiperSlide key={i}>
                <Link
                  href={`/event/${item.id}`}
                  className="group relative flex flex-col items-center p-4 transition-all duration-300 hover:scale-[1.02] pb-8"
                >
                  {item.state == 1 && (
                    <span
                      className="absolute top-2 right-2 z-20 bg-gradient-to-r from-red-600 to-red-500 
                    px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg 
                    transform -rotate-2 hover:rotate-0 transition-transform duration-300
                    border-2 border-red-400/20 backdrop-blur-sm"
                    >
                      {t.outOfTickets}
                    </span>
                  )}
                  {/* Image Container with Hover Effect */}
                  <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-xl mb-2">
                    <Image
                      fill
                      src={`${db_link}img/products/${item.image}`}
                      alt={item.name}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />
                    {/* Overlay Effect */}
                    <div className="absolute inset-0 bg-black/10 transition-all duration-300 group-hover:bg-black/20" />
                  </div>

                  {/* Content */}
                  <div className="w-full text-center">
                    <h3 className="text-lg font-semibold text-gray-200 line-clamp-1 mb-1">
                      {t == enUS ? item.name : item.nameAr}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full bg-main-color/10 py-5 px-2 rounded">
              <h1 className="text-gray-200 text-center text-2xl mb-1">
                {t.thereIsNoSubCategories}
              </h1>
              <p className="text-main-color text-4xl">
                <HiOutlineEmojiSad />
              </p>
            </div>
          )}
        </Swiper>
      </div>
    </>
  );
}

export default CardsSection;
