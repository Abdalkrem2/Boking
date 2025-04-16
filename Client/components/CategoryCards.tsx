import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
function CategoryCards({ item, type }: any) {
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
  return (
    <div
      className={`${
        t == enUS ? "font-rorboto" : "font-notoKufi"
      } w-52 h-32 relative rounded-xl overflow-hidden shadow hover:shadow-md transition-all hover:shadow-main-color/50 `}
    >
      <Image
        src={`${
          type == "subCategory"
            ? `${db_link}img/subCategory/${item.image}`
            : `${db_link}img/category/${item.image}`
        }`}
        unoptimized={true}
        alt={item.name}
        fill
        loading="lazy"
        style={{ objectFit: "cover" }}
      />
      <Link
        className="w-2/3 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-main-color/80 hover:bg-main-color transition-all text-white font-bold px-2 py-1 rounded-xl"
        href={
          type == "subCategory"
            ? `/category/sub/${item.name}`
            : `/category/${item.name}`
        }
      >
        {t === enUS ? item.name : item.nameAr}
      </Link>
    </div>
  );
}

export default CategoryCards;
