import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { ar, enUS } from "../../../translation";
import ArenaSection from "../../../components/ArenaSection";
import { IoIosShare } from "react-icons/io";
import { FaArrowLeft, FaCalendar } from "react-icons/fa";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { changeToArabic, changeToEnglish } from "../../slice/langSlice";
import { CalendarRangeIcon } from "lucide-react";
import Link from "next/link";

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
  const dispatch = useDispatch();
  const toggleLang = () => {
    if (t === enUS) {
      dispatch(changeToArabic());
    } else {
      dispatch(changeToEnglish());
    }
    tHandler(t === enUS ? ar : enUS);
  };
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
        console.log(res.data);
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
        <section className="bg-white min-h-screen" dir={t == enUS ? "ltr" : "rtl"}>
          <div className="bg-blue-800 flex w-full">
            <div className="w-full flex justify-between items-center px-4 sm:px-10 py-2">
              <div className="flex gap-5 items-center justify-center">
                <button 
                  onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                    title: productData.name,
                    url: window.location.href,
                    })
                    .catch((err) => console.log('Error sharing:', err));
                  }
                  }}
                  className="text-white text-3xl"
                >
                  <IoIosShare />{" "}
                </button>
                <button
                  onClick={() => toggleLang()}
                  className="text-white text-lg sm:text-xl "
                >
                  {t == ar ? "ع" : "En"}
                </button>
              </div>
              <h1 className="text-xl text-gray-200">
                {t === enUS ? productData.name : productData.nameAr}
              </h1>
              <Link href="/" className="text-white text-2xl">
                {t == enUS ? <IoArrowForwardOutline /> : <IoArrowBackOutline />}
              </Link>
            </div>
          </div>
          <div className="bg-gray-100 flex justify-center items-center w-full gap-y-8 px-10 sm:px-20 lg:px-32">
            <div className="bg-white border-gray-100 border-2 w-full py-1 rounded-full text-sm flex justify-center items-center gap-2">
              <FaCalendar className="inline text-sm" />{" "}
              {productData.time.slice(5, 10)} / {productData.duration}
            </div>
          </div>
          <div>
            <ArenaSection
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
