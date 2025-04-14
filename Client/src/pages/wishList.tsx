import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ar, enUS } from "../../translation";
import Card from "../../components/Card";
import axios from "axios";
import { HiOutlineEmojiSad } from "react-icons/hi";
import Image from "next/image";
interface Product {
  id: number;
  name: string;
  nameAr: string;
  image: string;
  description: string;
  descriptionAr: string;
  rate: number;
  offer: boolean;
  price: number;
  discounted_price: number;
  percent: number;
  colors: string[];
  sizes: string[];
}
function WishList() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [loading, setLoading] = useState<boolean>(true);
  const [productsData, setProductsData] = useState<Product[]>([]);
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
    if (localStorage.getItem("favCache")) {
      console.log(localStorage.getItem("favCache"));
      let cData: any = localStorage.getItem("favCache");
      const parsedData = JSON.parse(cData);
      // Check if the data property exists in the cached data
      setProductsData(parsedData.data || parsedData);
      setLoading(false);
    } else {
      const fetchFavorites = async () => {
        if (db_link === "") return;
        try {
          console.log("Fetching favorites from API...");
          const favoritesStr = localStorage.getItem("favorites") || "";
          const favoritesArray = favoritesStr
            ? favoritesStr.split(",").filter(Boolean)
            : [];

          const response = await axios.post(`${db_link}api/favorites`, {
            ids: favoritesArray,
          });
          localStorage.setItem(
            "favCache",
            JSON.stringify({ data: response.data })
          );
          console.log("Fetched favorites:", response);
          setProductsData(response.data);
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    }
  }, [db_link]);
  return (
    <>
      <section
        className="sm:px-10 md:px-20 lg:px-32 sm:mt-2 md:mt-5"
        dir={t == enUS ? "ltr" : "rtl"}
      >
        {loading ? (
          <div className="relative h-56 w-full flex flex-col justify-center items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-100 border-t-main-color border-r-main-color rounded-full animate-spin" />
              <div className="w-14 h-14 border-4 border-gray-100 border-t-main-color rounded-full animate-[spin_1.5s_linear_infinite] absolute top-3 left-3" />
              <div className="w-8 h-8 border-3 border-gray-100 border-b-main-color rounded-full animate-[spin_2s_linear_infinite] absolute top-6 left-6" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-600 font-medium text-lg animate-pulse">
                {t.loading}
              </p>
              <span className="animate-[bounce_1s_infinite_0ms]">.</span>
              <span className="animate-[bounce_1s_infinite_200ms]">.</span>
              <span className="animate-[bounce_1s_infinite_400ms]">.</span>
            </div>
          </div>
        ) : (
          <div className={`my-10`}>
            <div className="w-full flex flex-col gap-5">
              <div className="flex justify-between w-full items-center px-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-200">
                  {t.wishList}
                </h2>
              </div>
              <div className={`flex flex-row flex-wrap`}>
                {productsData.length == 0 ? (
                  <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-4 sm:p-8">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 max-w-2xl w-full transform transition-all duration-300 hover:scale-102 border border-gray-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-main-color via-purple-500 to-pink-500"></div>
                      <div className="absolute -right-20 -top-20 w-40 h-40 bg-main-color/10 rounded-full blur-3xl"></div>
                      <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                      <div className="relative z-10">
                        <div className="flex flex-col items-center">
                          <div className="text-complement-color text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 transform transition-all hover:scale-110 hover:rotate-12">
                            <HiOutlineEmojiSad className="animate-float" />
                          </div>
                          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
                            {t.thereIsNothingInWishList}
                          </h1>
                          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center max-w-md">
                            {t.thereIsNothingInWishList2}
                          </p>

                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center">
                            <Link
                              href="/"
                              className="group flex items-center justify-center px-6 py-3 text-sm sm:text-base font-medium text-complement-color bg-main-color rounded-xl hover:bg-main-color/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              {t.nothingInCart2}
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 ml-2 rtl:rotate-180 transform transition-transform group-hover:translate-x-1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                            </Link>
                            <Link
                              href="/"
                              className="flex items-center justify-center px-6 py-3 text-sm sm:text-base font-medium text-complement-color bg-main-color/10 rounded-xl hover:bg-main-color/20 transition-all duration-300 transform hover:scale-105"
                            >
                              {t.backHome}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  productsData.map((item: Product, idx: number) => (
                    <Link
                      href={`/event/${item.id}`}
                      className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 group relative flex flex-col items-center p-4 transition-all duration-300 hover:scale-[1.02] pb-8"
                    >
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
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default WishList;
