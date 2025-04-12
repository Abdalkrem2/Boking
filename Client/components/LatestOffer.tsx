import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
import Card from "./Card";
import axios from "axios";

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
function SpecialPrice() {
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
    axios.get(`${db_link}/api/category/products/3`).then((res) => {
      if (res.data) {
        setProductsData(res.data);
      }
      setLoading(false);
    });
  }, [db_link]);
  return (
    <>
      <section
        className="sm:px-10 md:px-20 lg:px-32 sm:mt-2 md:mt-5"
        dir={t == enUS ? "ltr" : "rtl"}
      >
        {loading ? (
          <div className="relative h-screen w-screen">
            <div
              className="absolute left-1/2 top-1/2 spinner animate-spin inline-block w-16 h-16 border-t-4  border-main-color rounded-full"
              role="status"
            >
              <span className="visually-hidden"></span>
            </div>
          </div>
        ) : (
          <div
            className={`my-10 ${t == enUS ? "font-rorboto" : "font-notoKufi"}`}
          >
            <div className="w-full flex flex-col gap-5">
              <div className="flex justify-between w-full items-center px-2">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {t.specialDeals}
                </h2>
                <Link
                  href={"/category/popular"}
                  className="text-main-color font-bold hover:text-secondary-color transition-all"
                >
                  {t.viewAll}
                </Link>
              </div>
              <div className={`flex flex-row flex-wrap`}>
                {productsData.map((item: Product, idx: number) => {
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

export default SpecialPrice;
