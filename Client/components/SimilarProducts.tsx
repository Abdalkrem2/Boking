import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
import Card from "./Card";
import axios from "axios";
import { useRouter } from "next/router";

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
function SimilarProducts(category_id: any) {
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
    setLoading(true);
    axios
      .get(
        `${db_link}api/products/similar/${category_id > 3 ? category_id : 4}`
      )
      .then((res) => {
        if (res.data) {
          setProductsData(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [db_link]);

  return loading ? (
    <div className="relative h-screen w-screen">
      <div
        className="absolute left-1/2 top-1/2 spinner animate-spin inline-block w-16 h-16 border-t-4  border-main-color rounded-full"
        role="status"
      >
        <span className="visually-hidden"></span>
      </div>
    </div>
  ) : (
    <div className={`my-10`}>
      <div className="w-full flex flex-col gap-5">
        <div className="flex justify-between w-full items-center px-2">
          <div className="relative group cursor-pointer select-none p-2">
            {/* Subtle background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/30 to-indigo-500/30 rounded-lg blur opacity-15 group-hover:opacity-30 transition duration-500"></div>

            {/* Main heading */}
            <div className="relative flex items-center gap-3">
              <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 transform group-hover:scale-102 transition-all duration-300 ease-out">
                {t.similarProducts}
              </h2>
            </div>

            {/* Animated underline */}
            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500/30 to-indigo-500/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>

            {/* Subtle decorative elements */}
            <div className="absolute -top-3 -right-3 w-4 h-4 bg-gradient-to-br from-teal-400/30 to-indigo-500/30 rounded-full blur-sm animate-pulse opacity-40"></div>
            <div className="absolute -bottom-2 -left-3 w-3 h-3 bg-gradient-to-br from-indigo-400/30 to-teal-500/30 rounded-full blur-sm animate-ping opacity-30"></div>
          </div>
        </div>
        <div className={`flex flex-row flex-wrap`}>
          {productsData.map((item: Product, idx: number) => {
            return <Card key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default SimilarProducts;
