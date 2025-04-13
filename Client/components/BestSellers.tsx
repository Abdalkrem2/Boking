import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
import Card from "./Card";
import axios from "axios";
//product interface
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

function BestSellers() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  //language
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
  //loading vars
  const [loading, setLoading] = useState<boolean>(false);
  //products vars
  const [productsData, setProductsData] = useState<Product[]>([]);
  //cache data for 1 hour
  const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hour in milliseconds
  useEffect(() => {
    if (db_link === "") return;
    const cachedData = localStorage.getItem("offersData");
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        // data is still valid
        setProductsData(data);
      } else {
        setLoading(true);
        axios
          .get(`${db_link}api/category/products/2`)
          .then((res) => {
            if (res.data) {
              setProductsData(res.data);
              localStorage.setItem(
                "offersData",
                JSON.stringify({ data: res.data, timestamp: Date.now() })
              );
            }
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    } else {
      setLoading(true);
      axios
        .get(`${db_link}api/category/products/2`)
        .then((res) => {
          if (res.data) {
            setProductsData(res.data);
            localStorage.setItem(
              "offersData",
              JSON.stringify({ data: res.data, timestamp: Date.now() })
            );
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
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
              {/* heading */}
              <div className="flex justify-center w-full items-center px-2 mb-8">
                <div className="relative group cursor-pointer select-none p-2">
                  {/* Subtle background glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/30 to-indigo-500/30 rounded-lg blur opacity-15 group-hover:opacity-30 transition duration-500"></div>

                  {/* Main heading */}
                  <div className="relative flex items-center gap-3">
                    <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 transform group-hover:scale-102 transition-all duration-300 ease-out">
                      {t.bestSellers}
                    </h2>
                  </div>

                  {/* Animated underline */}
                  <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500/30 to-indigo-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>

                  {/* Subtle decorative elements */}
                  <div className="absolute -top-3 -right-3 w-4 h-4 bg-gradient-to-br from-teal-400/30 to-indigo-500/30 rounded-full blur-sm animate-pulse opacity-40"></div>
                  <div className="absolute -bottom-2 -left-3 w-3 h-3 bg-gradient-to-br from-indigo-400/30 to-teal-500/30 rounded-full blur-sm animate-ping opacity-30"></div>
                </div>

                {/* View All button */}
                {/* <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">
                  View All
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button> */}
              </div>
              {/* products View */}
              <div className={`flex flex-row flex-wrap `}>
                {productsData &&
                  productsData.map((item: Product, idx: number) => {
                    return <Card key={idx} item={item} />;
                  })}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default BestSellers;
