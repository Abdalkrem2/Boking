import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket } from "../src/slice/basketSlice";
import { RootState } from "../store";
import { ar, enUS } from "../translation";
import axios from "axios";
import { useSession } from "next-auth/react";

function Card({ item }: any) {
  //app link
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session, status } = useSession();
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
  //dispatch data and state roots
  const dispatch = useDispatch();
  //products values
  const [selectedColor, selectedColorHandler] = useState("default");
  const [selectedSize, selectedSizeHandler] = useState("normal");
  //discount percentage function
  function calculateDiscountPercentage(
    originalPrice: number,
    discountedPrice: number
  ): string {
    const discountAmount = originalPrice - discountedPrice;
    const discountPercentage = (discountAmount / originalPrice) * 100;

    return `-${Math.ceil(discountPercentage)}%`;
  }
  //function for getting random integer
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  //the function that add to cart "basket"
  function addtoCartHandler() {
    if (db_link === "") return;
    //generate the form data
    const fData = new FormData();
    fData.append("image", item.image);
    fData.append("user_id", `${session?.user.id}`);
    fData.append("product_id", item.id);
    fData.append("nameAr", item.nameAr);
    fData.append("name", item.name);
    fData.append("description", item.description);
    fData.append("descriptionAr", item.descriptionAr);
    fData.append("price", item.price);
    fData.append("discounted_price", item.discounted_price);
    fData.append("color", selectedColor);
    fData.append("size", selectedSize);
    fData.append("quantity", "1");

    //send the api request (POST)
    axios.post(`${db_link}api/cart/add`, fData, {
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
  }
  const [isAnimating, setIsAnimating] = useState(false);
  //Favorite
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[0]");
    setIsFavorite(favorites.includes(item.id));
  }, [item.id]);
  const handleFavorite = (id: number) => {
    // Prevent Link navigation
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[0]");

    if (isFavorite) {
      // Remove from favorites, but keep 0 as first element
      const newFavorites = favorites.filter((id: number) => id !== item.id);
      if (!newFavorites.includes(0)) {
        newFavorites.unshift(0);
      }
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      localStorage.removeItem("favCache");
    } else {
      // Add to favorites, ensuring 0 remains as first element
      if (!favorites.includes(0)) {
        favorites.unshift(0);
      }
      favorites.push(item.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      localStorage.removeItem("favCache");
    }

    setIsFavorite(!isFavorite);
  };
  return (
    <div
      key={item.id}
      className="group flex flex-col gap-3 bg-white p-5 relative w-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 mb-6 border border-gray-200 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden"
    >
      {/* Discount badge */}
      {item.discounted_price != item.price && (
        <span className="absolute z-10 font-bold top-4 left-4 px-3 py-1 text-sm bg-red-500 text-white rounded-full shadow-md transform -rotate-2">
          {calculateDiscountPercentage(item.price, item.discounted_price)}
        </span>
      )}

      {/* Wishlist button */}
      <button
        onClick={() => handleFavorite(item.id)}
        className="absolute top-4 right-4 p-2 text-lg z-10 bg-white shadow-lg hover:shadow-xl text-red-500 rounded-full transition-all duration-300 transform hover:scale-110"
      >
        {isFavorite ? (
          <AiFillHeart className="text-red-500" />
        ) : (
          <AiOutlineHeart />
        )}
      </button>

      {/* Product image */}
      <Link
        href={`/product/${item.id}`}
        className="h-48 relative w-full bg-gray-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-md"
      >
        <Image
          src={`${db_link}img/products/${item.image}`}
          unoptimized={true}
          alt={`${item.name} image`}
          fill
          loading="lazy"
          style={{ objectFit: "contain" }}
          className="transform transition-transform duration-300 group-hover:scale-110"
        />
      </Link>

      {/* Product details */}
      <div className="space-y-3 flex-1">
        <h4 className="font-bold text-gray-800 text-lg leading-snug">
          {t === enUS
            ? item.name.length > 40
              ? `${item.name.slice(0, 40)}...`
              : item.name
            : item.nameAr.length > 40
            ? `${item.nameAr.slice(0, 40)}...`
            : item.nameAr}
        </h4>

        <p className="text-sm text-gray-600 leading-relaxed">
          {t === enUS
            ? item.description.length > 60
              ? `${item.description.slice(0, 60)}...`
              : item.description
            : item.descriptionAr.length > 60
            ? `${item.descriptionAr.slice(0, 60)}...`
            : item.descriptionAr}
        </p>

        {/* Size selection */}
        {item.sizes != "N/A:" && (
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-gray-700">{t.size}:</p>
            <div className="flex gap-1">
              {`${item.sizes}`
                .replace("N/A:", "")
                .split("+")
                .slice(0, -1)
                .map((size: string) => (
                  <button
                    key={size}
                    id={size}
                    onClick={(e) => {
                      // @ts-ignore
                      selectedSizeHandler(e.target.id);
                    }}
                    className={`px-2 py-1 text-xs rounded-md border cursor-pointer transition-all hover:border-gray-400 ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Colors selection */}
        {item.colors != "N/A:" && (
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-gray-700">{t.color}:</p>
            <div className="flex gap-1">
              {`${item.colors}`
                .replace("N/A:", "")
                .split("+")
                .slice(0, -1)
                .map((color: string) => (
                  <span
                    key={color}
                    id={color}
                    onClick={(e) => {
                      // @ts-ignore
                      selectedColorHandler(e.target.id);
                    }}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    } bg-${color}-500 ${color === "white" && "bg-white"} ${
                      color === "black" && "bg-black"
                    }`}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Price section */}
        <div className="flex items-center gap-2 mt-2">
          {item.discounted_price == item.price ? (
            <span className="text-xl font-bold text-gray-900">
              JD {item.price.toFixed(2)}
            </span>
          ) : (
            <>
              <span className="text-xl font-bold text-main-color">
                JD {item.discounted_price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                JD {item.price.toFixed(2)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <Link
          href={`/product/${item.id}`}
          className="flex-1 text-center py-2 px-4 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {t.buyNow}
        </Link>
        <button
          onClick={() => {
            if (status === "authenticated") {
              addtoCartHandler();
            }
            dispatch(
              addToBasket({
                id: getRandomInt(9999),
                product_id: item.id,
                name: item.name,
                nameAr: item.nameAr,
                price: item.price,
                discounted_price: item.discounted_price,
                description: item.description,
                descriptionAr: item.descriptionAr,
                image: item.image,
                percent: item.percent,
                quantity: 1,
                color: selectedColor,
                size: selectedSize,
              })
            );

            // Trigger animation
            setIsAnimating(true);

            // Reset animation after 600ms
            setTimeout(() => setIsAnimating(false), 600);
          }}
          className={`relative p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-transform duration-300 shadow-md hover:shadow-lg ${
            isAnimating ? "animate-expand" : ""
          }`}
        >
          {/* Ripple effect */}
          <span
            className={`absolute inset-0 rounded-full bg-green-300 opacity-0 ${
              isAnimating ? "animate-ripple" : ""
            }`}
          ></span>

          {/* Icon */}
          <FaCartPlus
            className={`text-lg relative z-10 transition-transform duration-300 ${
              isAnimating ? "scale-125 text-green-500" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default Card;
