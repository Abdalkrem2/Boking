import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import Slider from "../../components/Slider";
import { ar, enUS } from "../../translation";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import CardsSection from "../../components/CardsSection";

const Home = () => {
  const language = useSelector((state: RootState) => state.language.value);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);

  useEffect(() => {
    // Language preference handling
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  return (
    <>
      <Head>
        <title>{t === enUS ? "Eventat" : "ايفينتات"}</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <div className="mx-4 sm:mx-10 md:mx-20 lg:mx-32 rounded-xl overflow-hidden my-5">
        <Slider />
      </div>
      <CardsSection />
    </>
  );
};

export default Home;
