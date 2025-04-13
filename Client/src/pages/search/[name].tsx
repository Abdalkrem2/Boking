import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { enUS, ar } from "../../../translation";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import Card from "../../../components/Card";
import { Product } from "../../slice/basketSlice";
import ReactPaginate from "react-paginate";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
function Search() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const router = useRouter();
  const productName = router.query.name;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
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
  const [productsData, setProductsData] = useState<any>("");
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (db_link === "") return;
    if (page && productName) {
      setLoading(true);
      const url = `${db_link}api/products/search/${productName}?page=${page}`;
      axios
        .get(url)
        .then((res) => {
          setProductsData(res.data);
          setLoading(false);
          setPage(res.data.current_page);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [page, productName, db_link]);
  const handlePageChange = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected + 1);
    window.scroll(0, 0);
  };
  return (
    <>
      <Head>
        <title>Search</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section className="sm:px-10 md:px-20 lg:px-32 sm:mt-2 md:mt-5">
        <div className={"font-rorboto"}>
          {loading ? (
            <div className="relative h-56 w-full flex flex-col justify-center items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-gray-100 border-t-main-color border-r-main-color rounded-full animate-spin" />
                <div className="w-14 h-14 border-4 border-gray-100 border-t-main-color rounded-full animate-[spin_1.5s_linear_infinite] absolute top-3 left-3" />
                <div className="w-8 h-8 border-3 border-gray-100 border-b-main-color rounded-full animate-[spin_2s_linear_infinite] absolute top-6 left-6" />
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
            <div className={`my-10`}>
              <div className="w-full flex flex-col gap-5">
                <h2
                  className={`text-3xl sm:text-4xl font-bold text-gray-200`}
                  dir={t == enUS ? "ltr" : "rtl"}
                >
                  {t.searchDataFrom}{" "}
                  <span className="text-main-color">{productName}</span>
                </h2>

                <div className={`flex flex-row flex-wrap`}>
                  {productsData.data.length > 0 ? (
                    productsData.data.map((item: Product) => {
                      return (
                        <Link
                          href={`/event/${item.id}`}
                          className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 group relative flex flex-col items-center p-4 transition-all duration-300 hover:scale-[1.02] pb-8"
                        >
                          {/* Image Container with Hover Effect */}
                          <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-xl mb-2">
                            <Image
                              fill
                              src={`${db_link}img/products/${item.image}`}
                              alt={item.name}
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            />
                            {/* Overlay Effect */}
                            <div className="absolute inset-0 bg-black/10 transition-all duration-300 group-hover:bg-black/20" />
                          </div>

                          {/* Content */}
                          <div className="w-full text-center">
                            <h3 className="text-lg font-semibold text-gray-200 line-clamp-1 mb-1">
                              {t == enUS ? item.name : item.nameAr}
                            </h3>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full bg-main-color/10 py-5 px-2 rounded">
                      <h1 className="text-center text-2xl mb-1">
                        {t.thereIsNoProductsSearch}
                      </h1>
                      <p className="text-main-color text-4xl">
                        <HiOutlineEmojiSad />
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* pagination section */}
              {productsData.data.length > 0 && (
                <div className="flex justify-center mt-8 px-4">
                  <ReactPaginate
                    pageCount={Math.ceil(productsData.total / 12)}
                    previousLabel={
                      <span aria-hidden="true">
                        <BsArrowLeftSquareFill className="text-main-color text-2xl" />
                      </span>
                    }
                    nextLabel={
                      <span aria-hidden="true">
                        <BsArrowRightSquareFill className="text-main-color text-2xl" />
                      </span>
                    }
                    pageRangeDisplayed={window.innerWidth < 640 ? 1 : 3}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageChange}
                    containerClassName="flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
                    pageClassName="pagination-item"
                    previousClassName="pagination-nav"
                    nextClassName="pagination-nav"
                    activeClassName="pagination-active"
                    disabledClassName="pagination-disabled"
                    breakLabel="..."
                    breakClassName="pagination-item-break"
                    forcePage={page - 1}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Search;
