"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface SliderItem {
  id: number;
  heading: string;
  headingAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  link?: string;
}

function Slider() {
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
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
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
      const response = await fetch(`${db_link}api/sliderHome`);
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
    <section className="relative h-[400px] md:h-[500px] w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full"
      >
        {sliders.map((slider) => (
          <SwiperSlide key={slider.id}>
            <Link
              href={`/${slider.link}`}
              className="h-full w-full bg-cover bg-center flex items-center"
              style={{
                backgroundImage: `url(${db_link}img/homeSlider/${slider.image})`,
              }}
            ></Link>
          </SwiperSlide>
        ))}

        {/* Navigation arrows */}
        <div className="swiper-button-prev !text-white after:!text-xl"></div>
        <div className="swiper-button-next !text-white after:!text-xl"></div>

        {/* Pagination bullets */}
        <div className="swiper-pagination !bottom-4"></div>
      </Swiper>
    </section>
  );
}

export default Slider;
