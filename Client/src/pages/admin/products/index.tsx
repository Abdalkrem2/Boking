import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ar, enUS } from "../../../../translation";
import Head from "next/head";
import { useSession } from "next-auth/react";
function ProductsControl() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [page, setPage] = useState(1);
  const [number, setNumber] = useState<number>(1);
  const [pageSearch, setPageSearch] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [products, setProducts] = useState({
    data: ["Array", " Array"],
    current_page: 0,
    per_page: 0,
    total: 0,
  });
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
  useEffect(() => {
    if (db_link === "") return;
    if (!searching) {
      setIsLoading(true);
      const url = `${db_link}api/products?page=${page}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        .then((res) => {
          setProducts(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          router.push("/");
        });
    }
  }, [page, number, db_link]);
  useEffect(() => {
    if (db_link === "") return;
    if (searching) {
      const value = searchInput;
      setIsLoading(true);
      const url = `${db_link}api/admin/search/products?page=${pageSearch}`;
      axios
        .post(
          url,
          { value },
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        )
        .then((res) => {
          setProducts(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, [pageSearch]);
  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearching(true);
    const value = e.target[0].value;
    setSearchInput(e.target[0].value);
    setIsLoading(true);
    const url = `${db_link}api/admin/search/products?page=${page}`;
    axios
      .post(
        url,
        { value },
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      )
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const handlePageChange = (selectedItem: { selected: number }) => {
    if (searching) {
      setPageSearch(selectedItem.selected + 1);
    } else {
      setPage(selectedItem.selected + 1);
    }
  };
  const [showForm, setShowForm] = useState(false);

  const [backError, setBackError] = useState<any>(false);
  const [message, setMessage] = useState<any>(false);
  const [imageData1, setImageData1] = useState("");
  const [previewUrl1, setPreviewUrl1] = useState<string | null>(null);
  const [imageData2, setImageData2] = useState("");
  const [previewUrl2, setPreviewUrl2] = useState<string | null>(null);
  const [imageData3, setImageData3] = useState("");
  const [previewUrl3, setPreviewUrl3] = useState<string | null>(null);
  const handleChangeImage1 = (file: any) => {
    setImageData1(file.target.files[0]);

    //----------------------------- img preview handling
    const selectedFile1 = file.target.files && file.target.files[0];
    if (selectedFile1) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl1(reader.result as string);
      };
      reader.readAsDataURL(selectedFile1);
    }
  };
  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const fData = new FormData();
    fData.append("image", imageData1);
    fData.append("name", e.target[0].value);
    fData.append("nameAr", e.target[1].value);
    fData.append("location_desc", e.target[2].value);
    fData.append("date_desc", e.target[3].value);
    fData.append("color", e.target[4].value);
    fData.append("description", e.target[5].value);
    fData.append("tags", e.target[6].value);
    fData.append("terms", e.target[7].value);
    fData.append("state", e.target[8].value);
    fData.append("category_id", e.target[9].value);

    axios
      .post(`${db_link}api/products/add`, fData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setRequestSent(false);
        if (res.data.errors) {
          for (let i = 0; i < res.data.errors.length; i++) {
            const element: string = res.data.errors[i];
            if (element == "The sub category id must be an integer.") {
              res.data.errors[i] = "The Sub Category Field Is required";
            }
            if (element == "The category id must be an integer.") {
              res.data.errors[i] = "The Category Field Is required";
            }
          }
          setBackError(res.data.errors);
          setMessage(false);
          window.scroll(5000, 5000);
        } else {
          setBackError(false);
          if (t == enUS) {
            setMessage("added successfully");
            setPreviewUrl1("");
            setPreviewUrl2("");
            setPreviewUrl3("");
          } else {
            setMessage("تم الإضافة بنجاح");
            setPreviewUrl1("");
            setPreviewUrl2("");
            setPreviewUrl3("");
          }
          window.scroll(0, 0);
          e.target.reset();
          setNumber(number + 1);
        }
      });
  };
  const [mainCategories, setMainCategories] = useState<any>([
    { name: "nothing", nameAr: "لا شيء", id: 10000 },
  ]);
  const [subCategorySet, setSubCategorySet] = useState(false);
  const [subCategories, setSubCategories] = useState<any>([
    { name: "nothing", nameAr: "لا شيء", id: 10000 },
  ]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const categoryChangeHandler = (e: any) => {
    const category = e.target.value;

    setSubCategorySet(true);
    setLoadingSubCategories(true);
    axios
      .post(
        `${db_link}api/SelectSubCategories`,
        { category },
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      )
      .then((res) => {
        setSubCategories(res.data);
        setLoadingSubCategories(false);
      });
  };
  useEffect(() => {
    if (db_link === "") return;
    setIsLoading(true);
    const url = `${db_link}api/mainCategories`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setMainCategories(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [session?.user.role, db_link]);
  return (
    <>
      <Head>
        <title>products</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section
        className="sm:px-10 sm:pt-2 md:pt-5 bg-white"
        dir={t == enUS ? "ltr" : "rtl"}
      >
        <div className={`${t == enUS ? "font-rorboto" : "font-notoKufi"}`}>
          {/* heading section */}
          <div className="flex sm:justify-between sm:flex-row gap-5 my-4 mx-2 flex-col justify-center items-center">
            <div>
              <h1 className="text-xl font-bold text-main-color">
                {t.productsTable}
              </h1>
              <p className="text-secondary-text">{t.thisIsAllCategories}</p>
            </div>
            <form
              onSubmit={handleSearch}
              className="border flex h-fit w-fit rounded overflow-hidden"
            >
              <input
                type="text"
                name="search"
                placeholder={t == enUS ? "Product" : "المنتج"}
                className="h-8 p-2 w-40 bg-gray-100 outline-none focus:bg-gray-200 transition-all"
              />
              <button
                type="submit"
                className="h-8 w-10 text-gray-500 hover:text-gray-600 hover:bg-gray-300 transition-all bg-gray-200 flex justify-center items-center"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          {/* add category successfully */}
          {message && (
            <p className={` w-full bg-green-100 text-center p-2 my-5 rounded`}>
              {message}
            </p>
          )}
          {/* table section */}
          <div className="overflow-x-scroll overflow-y-hidden w-full">
            <table className="w-full">
              <thead className="border-b-2 w-full">
                <tr>
                  <th>Id</th>
                  <th>{t.nameEn}</th>
                  <th>{t.nameAr}</th>
                  <th>{t.state}</th>
                  <th>{t.edit}</th>
                </tr>
              </thead>
              {!isLoading ? (
                <tbody className="w-full">
                  {products.data.map((product: any, i: number) => {
                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-200 transition-all mb-2 ${
                          i % 2 == 0 && "bg-gray-100"
                        }`}
                      >
                        <td className="px-2  text-center p-3">{product.id}</td>

                        <td className="px-2 whitespace-nowrap text-center font-rorboto">
                          {product.name}
                        </td>
                        <td className="px-2 whitespace-nowrap text-center font-notoKufi">
                          {product.nameAr}
                        </td>

                        <td className="px-2 whitespace-nowrap text-center ">
                          {product.state == 0 ? (
                            <span className="bg-green-100 p-1 rounded">
                              {" "}
                              {t.available}
                            </span>
                          ) : (
                            <span className="bg-red-100 p-1 rounded">
                              {" "}
                              {t.notAvailable}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-3 flex justify-center">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="w-20 bg-sky-500 hover:bg-sky-400 text-white px-2 py-1 rounded transition-all text-sm block text-center"
                          >
                            <FaPencilAlt className="inline" /> {t.edit}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <td className="relative h-44" colSpan={10}>
                  <div
                    className="absolute left-1/2 top-1/2 spinner animate-spin inline-block w-10 h-10 border-t-4  border-main-color rounded-full"
                    role="status"
                  >
                    <span className="visually-hidden"></span>
                  </div>
                </td>
              )}
            </table>
          </div>
          {/* pagination section */}
          <div>
            <ReactPaginate
              pageCount={Math.ceil(products.total / 25)}
              previousLabel="<"
              nextLabel=">"
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              activeClassName="active"
            />
          </div>

          {/* add product form section */}
          <div className="border-t mt-4 pt-3">
            <h2 className="w-full flex justify-start gap-2 items-center text-lg font-bold mb-2">
              {t.addProduct}{" "}
              <button
                onClick={() => {
                  if (showForm) {
                    setShowForm(false);
                  } else {
                    setShowForm(true);
                  }
                }}
                className={`bg-main-color p-1 rounded-full text-white ${
                  showForm ? "rotate-180" : "rotate-0"
                } transition-all hover:bg-secondary-color`}
              >
                <IoIosArrowDown />
              </button>
            </h2>
            {showForm && (
              <form
                onSubmit={submitHandler}
                className="flex flex-col gap-4 w-full md:w-1/2 items-center sm:items-start sm:rtl:items-end mb-2"
              >
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="name" className="text-xl w-fit">
                    {t.productForm}{" "}
                    <span className="text-sm font-rorboto">(En)</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Mouse"
                    className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="nameAr" className="text-xl w-fit">
                    {t.productForm}{" "}
                    <span className="text-sm font-rorboto">(Ar)</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="nameAr"
                    id="nameAr"
                    placeholder="ماوس"
                    className="h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid font-notoKufi"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="location_desc" className="text-xl w-fit">
                    {t.location_desc}{" "}
                  </label>
                  <input
                    required
                    type="text"
                    name="location_desc"
                    id="location_desc"
                    placeholder="في مجمع الميلاد"
                    className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="date_desc" className="text-xl w-fit">
                    {t.date_desc}{" "}
                  </label>
                  <input
                    required
                    type="text"
                    name="date_desc"
                    id="date_desc"
                    placeholder="في مجمع الميلاد"
                    className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="date_desc" className="text-xl w-fit">
                    {t.color} <span className="text-sm">#XXXXXX</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="date_desc"
                    id="date_desc"
                    placeholder="#000000"
                    className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="description" className="text-xl w-fit">
                    {t.description}{" "}
                  </label>
                  <textarea
                    required
                    className="h-20 px-3 py-2 bg-gray-200 dark:bg-gray-400/25  outline-none focus:drop-shadow rounded w-full font-rorboto"
                    name="description"
                    id="description"
                    placeholder="Be happy with our collection in Electronics"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="tags" className="text-xl w-fit">
                    {t.tags} <span className="text-sm">{t.plusSeparated}</span>
                  </label>
                  <textarea
                    required
                    className="h-20 px-3 py-2 bg-gray-200 dark:bg-gray-400/25  outline-none focus:drop-shadow rounded w-full"
                    name="tags"
                    id="tags"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="terms" className="text-xl w-fit">
                    {t.terms} <span className="text-sm">{t.plusSeparated}</span>
                  </label>
                  <textarea
                    required
                    className="h-20 px-3 py-2 bg-gray-200 dark:bg-gray-400/25  outline-none focus:drop-shadow rounded w-full"
                    name="terms"
                    id="terms"
                  />
                </div>
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex flex-col gap-2 px-2 w-1/2">
                    <label htmlFor="category_id" className="text-xl">
                      {t.state}
                    </label>
                    <select
                      id="category_id"
                      name="category_id"
                      required
                      className="h-10 px-3 outline-none bg-gray-200 dark:bg-gray-400/25 dark:text-gray-400  focus:drop-shadow rounded "
                    >
                      <option className="text-black" value={0} selected>
                        {t.available}
                      </option>
                      <option className="text-black" value={1}>
                        {t.notAvailable}
                      </option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 px-2 w-1/2">
                    <label htmlFor="category_id" className="text-xl">
                      {t.mainCategory}
                    </label>
                    <select
                      id="category_id"
                      name="category_id"
                      required
                      onChange={categoryChangeHandler}
                      className="h-10 px-3 outline-none bg-gray-200 dark:bg-gray-400/25 dark:text-gray-400  focus:drop-shadow rounded "
                    >
                      <option className="hidden">{t.chooseCategory}</option>
                      {mainCategories.map((mainCategory: any) => {
                        return (
                          <option
                            className="text-black"
                            key={mainCategory.id}
                            value={mainCategory.id}
                          >
                            {t == enUS
                              ? mainCategory.name
                              : mainCategory.nameAr}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2 px-2 w-full rounded">
                  <label htmlFor="image" className="text-xl w-fit">
                    {t.image}
                  </label>
                  <input
                    required
                    type="file"
                    onChange={handleChangeImage1}
                    accept="image/*"
                    className="block w-full text-sm text-slate-500 font-rorboto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-main-color/10 file:text-main-color hover:file:bg-main-color/20"
                  />
                  {previewUrl1 && (
                    <img
                      className="h-32 w-32"
                      src={previewUrl1}
                      alt="Preview"
                    />
                  )}
                </div>
                <ul className="w-full">
                  {backError &&
                    backError.map((error: any, index: number) => {
                      return (
                        <li className="text-red-500" key={index}>
                          - {error}
                        </li>
                      );
                    })}
                </ul>
                <div className="flex justify-center sm:justify-start gap-8 px-2 pb-4 w-full">
                  <button
                    type="submit"
                    disabled={requestSent ? true : false}
                    className={`transition-all text-gray-200 rounded px-10 py-2 font-bold bg-main-color`}
                  >
                    {t.addCategory}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductsControl;
