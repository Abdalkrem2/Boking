"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import styles from "./SwiperSlider.module.css";

interface SliderItem {
  id: number;
  heading: string;
  headingAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  link?: string;
}

function SwiperSlider() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const fetchSliderData = useCallback(async () => {
    if (db_link === "") return;
    const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const cachedData = localStorage.getItem("sliderData");

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setSliders(data);
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${db_link}/api/sliderHome`);
      if (!response.ok) {
        throw new Error("Failed to fetch slider data");
      }
      const data: SliderItem[] = await response.json();
      setSliders(data);
      localStorage.setItem(
        "sliderData",
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [db_link]);

  useEffect(() => {
    fetchSliderData();
  }, [fetchSliderData]);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-main-color/10 sm:rounded-xl">
        <div className="relative">
          <div className="absolute animate-spin rounded-full h-16 w-16 border-4 border-main-color/30"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-main-color border-l-main-color"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-main-color/10 sm:rounded-xl">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="sm:px-10 md:px-20 lg:px-32 sm:mt-2 md:mt-5"
      dir={t == ar ? "rtl" : "ltr"}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className={`${styles.swiper} bg-main-color/10 sm:rounded-xl pb-16`}
      >
        {sliders.map((slider) => (
          <SwiperSlide key={slider.id} className={styles["swiper-slide"]}>
            <div className="flex flex-col-reverse sm:flex-row items-center justify-center w-full">
              <div className="text-center sm:text-start px-4">
                <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl">
                  {t == ar ? slider.headingAr : slider.heading}
                </h2>
                <p className="text-secondary-text text-sm lg:text-md mt-2">
                  {t == ar ? slider.descriptionAr : slider.description}
                </p>
                {slider.link && (
                  <Link
                    href={`/${slider.link}`}
                    className="mt-4 inline-block rounded text-main-color hover:text-white hover:bg-main-color transition-all border-2 border-main-color px-4 py-2 font-bold"
                  >
                    {t == ar ? "تسوق الآن" : "Shop Now"}
                  </Link>
                )}
              </div>
              <div className="w-full h-52 relative mt-4">
                <Image
                  src={`${db_link}/img/homeSlider/${slider.image}`}
                  alt={`Product ${slider.id} image`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SwiperSlider;
