import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ar, enUS } from "../../../translation";
import HallSection from "../../../components/HallSection";

function Hall() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const router = useRouter();
  const productId: any = router.query.index;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>();
  const [types, setTypes] = useState<any>([]);
  const [seats, setSeats] = useState<any>([]);
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
      .get(`${db_link}api/normal/hall/${productId}`)
      .then((res) => {
        console.log(res.data.hall.main_hall_number);
        if (res.data.hall.main_hall_number == 1) {
          setProductData(res.data.hall);
          router.push(`/arena/${productId}`);
          return;
        }
        setProductData(res.data.hall);
        let tempTypes: any = [];
        res.data.types.map((type: any, idx: number) => {
          tempTypes.push({
            id: type.id,
            name: type.name,
            price: type.price,
          });
        });
        setTypes(tempTypes);
        setSeats(res.data.seats);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [productId, db_link]);

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
          dir={t == enUS ? "ltr" : "rtl"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-200">
                  {t === enUS ? productData.name : productData.nameAr}
                </h1>
                <p className="text-gray-300 leading-relaxed">
                  {productData.description}
                </p>
                <p className="text-gray-400">
                  {t === enUS ? productData.time : productData.time}
                </p>
                <p className="text-gray-400">
                  {t === enUS ? productData.duration : productData.duration}
                </p>
              </div>
            </div>
          </div>
          <div>
            <HallSection
              number={productData.main_hall_number}
              types={types}
              seats={seats}
            />
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

export default Hall;
