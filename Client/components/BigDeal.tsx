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
function BigDeal() {
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
  // Fetch products
  const { db_link } = useSelector((state: RootState) => state.apiData);
  useEffect(() => {
    if (db_link === "") return;
    const cachedData = localStorage.getItem("bigDealData");
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        // data is still valid
        setProductsData(data);
      } else {
        setLoading(true);
        axios
          .get(`${db_link}api/category/products/1`)
          .then((res) => {
            if (res.data) {
              setProductsData(res.data);
              localStorage.setItem(
                "bigDealData",
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
        .get(`${db_link}api/category/products/1`)
        .then((res) => {
          if (res.data) {
            setProductsData(res.data);
            localStorage.setItem(
              "bigDealData",
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
    <section
      className="px-4 sm:px-10 md:px-20 lg:px-32 sm:mt-2 md:mt-5 py-4 bg-gray-100"
      dir={t == enUS ? "ltr" : "rtl"}
    >
      {loading ? (
        <div className="relative h-56 w-full flex flex-col justify-center items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white border-t-main-color border-r-main-color rounded-full animate-spin" />
            <div className="w-14 h-14 border-4 border-white border-t-main-color rounded-full animate-[spin_1.5s_linear_infinite] absolute top-3 left-3" />
            <div className="w-8 h-8 border-3 border-white border-b-main-color rounded-full animate-[spin_2s_linear_infinite] absolute top-6 left-6" />
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
        <div
          className={`flex flex-row flex-wrap ${
            t == enUS ? "font-rorboto" : "font-notoKufi"
          }`}
        >
          {/* heading */}
          <div className="flex flex-col gap-4 justify-center p-6 bg-gradient-to-br from-main-color to-main-color/80 w-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 border-2 border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white text-center drop-shadow-md animate-pulse">
              {t.hotDeal1}
            </h2>
            <p className="text-white/90 text-center text-lg">{t.hotDeal2}</p>
            <p className="text-3xl sm:text-4xl font-bold text-white text-center my-2 drop-shadow-md transform hover:scale-105 transition-transform">
              {t.hotDeal3}
            </p>
            <p className="text-white/90 text-center text-lg">{t.hotDeal4}</p>
            <div className="relative">
              <p className="text-2xl sm:text-3xl font-bold text-white text-center bg-white/10 py-2 px-4 rounded-lg backdrop-blur-sm">
                23/04/27
              </p>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            </div>
          </div>
          {/* products View */}
          {productsData &&
            productsData.map((item: Product, idx: number) => {
              return <Card key={idx} item={item} />;
            })}
        </div>
      )}
    </section>
  );
}

export default BigDeal;
