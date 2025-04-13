import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ar, enUS } from "../../../../translation";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { useSession } from "next-auth/react";
function Profile() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const productId = router.query.id;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [productData, setProductData] = useState<any>("");
  const [message, setMessage] = useState<any>(false);
  const [number, setNumber] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [nameAr, setNameAr] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [locationDesc, setLocationDesc] = useState<string>("");
  const [dateDesc, setDateDesc] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [terms, setTerms] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [state, setTheState] = useState<string>("");
  const [mainCategory, setMainCategory] = useState<string>("");

  useEffect(() => {
    if (db_link === "") return;
    axios
      .get(`${db_link}api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        const data = res.data[0];

        if (data) {
          setProductData(data);
          setName(data.name);
          setNameAr(data.nameAr);
          setDescription(data.description);
          setLocationDesc(data.location_desc);
          setDateDesc(data.date_desc);
          setTags(data.tags);
          setTerms(data.terms);
          setTheState(data.state);
          setColor(data.color);
          setMainCategory(data.category_id);
          setLoading(false);
        }
      })
      .catch(() => {
        router.push("/");

        setLoading(false);
      });
  }, [productId, number, db_link]);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  //categories set form
  const [mainCategories, setMainCategories] = useState<any>([
    { name: "nothing", nameAr: "لا شيء", id: 10000 },
  ]);
  useEffect(() => {
    if (db_link === "") return;
    const url = `${db_link}api/mainCategories`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setMainCategories(res.data);
      })
      .catch((error) => {});
  }, [session?.user.role, db_link]);
  const [showForm, setShowForm] = useState(false);
  const [backError, setBackError] = useState<any>(false);
  const [requestSent, setRequestSent] = useState(false);
  const [imageData1, setImageData1] = useState("");
  const [previewUrl1, setPreviewUrl1] = useState<string | null>(null);

  // img preview functions start-----------
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
  // -------------img preview functions end

  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const fData = new FormData();
    fData.append("_method", "PUT");
    if (imageData1) {
      fData.append("image", imageData1);
    }
    fData.append("name", name);
    fData.append("nameAr", nameAr);
    fData.append("description", description);
    fData.append("location_desc", locationDesc);
    fData.append("date_desc", dateDesc);
    fData.append("category_id", mainCategory);
    fData.append("tags", tags);
    fData.append("terms", terms);
    fData.append("color", color);
    fData.append("state", state);

    //send request
    axios
      .post(`${db_link}api/products/edit/${productId}`, fData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setRequestSent(false);
        if (res.data.errors) {
          setBackError(res.data.errors);
          setMessage(false);
        } else {
          setBackError(false);
          // if (t == enUS) {
          setMessage(t.theDataUpdated);
          setPreviewUrl1("");
          // }
          window.scroll(0, 0);
          // e.target.reset();
          setNumber(number + 1);
        }
      });
  };
  return (
    <>
      <Head>
        <title>Event {productId}</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section className="sm:px-10 md:px-20 lg:px-32 sm:pt-2 md:pt-5 bg-white">
        <div>
          {loading ? (
            <div className="relative w-full h-16">
              <div
                className="absolute left-1/2 top-1/2 spinner animate-spin inline-block w-10 h-10 border-t-4  border-main-color rounded-full"
                role="status"
              >
                <span className="visually-hidden"></span>
              </div>
            </div>
          ) : (
            <>
              {/* message */}
              {message == t.theDataUpdated && (
                <p
                  className={`${
                    t == enUS ? "font-rorboto" : "font-notoKufi"
                  } w-full bg-green-400/40 rounded text-center py-2 my-2`}
                >
                  {message}
                </p>
              )}
              {message == t.somethingWentWrong && (
                <p className="w-full bg-red-400/40 rounded text-center py-2 my-2">
                  {message}
                </p>
              )}
              {/* category details */}
              <div className="flex flex-col-reverse items-center text-center sm:text-start sm:flex-row sm:justify-between gap-5">
                <div className="basis-1/2">
                  <h1 className="text-3xl mb-3">
                    <Link
                      href={"/admin/products"}
                      className="text-main-color hover:text-secondary-color"
                    >
                      Event
                    </Link>
                    : {productData.name}
                  </h1>
                  <p className="text-secondary-text mb-2 font-rorboto">
                    Name: {productData.name}
                  </p>
                  <p className="text-secondary-text mb-2 font-notoKufi ">
                    <span className=" font-rorboto">NameAr</span>:{" "}
                    {productData.nameAr}
                  </p>
                  <p className="text-secondary-text mb-2 font-rorboto ">
                    Description: {productData.description}
                  </p>
                  <p className="text-secondary-text mb-2 font-rorboto ">
                    location Description: {productData.location_desc}
                  </p>
                  <p className="text-secondary-text mb-2 font-rorboto ">
                    Date Description: {productData.date_desc}
                  </p>
                </div>
                <div className="basis-1/2 flex justify-end">
                  <div className="w-52 h-52 rounded-xl shadow relative overflow-hidden">
                    <Image
                      src={`${db_link}img/products/${productData.image}`}
                      alt={"product image"}
                      fill
                      unoptimized={true}
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>

              {/* --update category form section-- */}
              <div
                className="border-t mt-4 pt-3"
                dir={t == enUS ? "ltr" : "rtl"}
              >
                <h2 className="ltr:font-rorboto rtl:font-notoKufi w-full flex justify-start gap-2 items-center text-lg font-bold mb-2">
                  {t.edit}{" "}
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
                    className="ltr:font-rorboto rtl:font-notoKufi flex flex-col gap-4 w-full md:w-1/2 items-center sm:items-start sm:rtl:items-end mb-2"
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
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
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
                        value={nameAr}
                        onChange={(e) => {
                          setNameAr(e.target.value);
                        }}
                        placeholder="ماوس"
                        className="h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid font-notoKufi"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="color" className="text-xl w-fit">
                        {t.color}
                      </label>
                      <input
                        required
                        type="text"
                        name="color"
                        id="color"
                        value={color}
                        onChange={(e) => {
                          setColor(e.target.value);
                        }}
                        placeholder="ماوس"
                        className="h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid font-notoKufi"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="description" className="text-xl w-fit">
                        {t.description}{" "}
                        <span className="text-sm font-rorboto">(En)</span>
                      </label>
                      <textarea
                        required
                        className="h-20 px-3 py-2 bg-gray-200 dark:bg-gray-400/25  outline-none focus:drop-shadow rounded w-full font-rorboto"
                        name="description"
                        id="description"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                        placeholder="Be happy with our collection in Electronics"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="date_desc" className="text-xl w-fit">
                        {t.date_desc}{" "}
                        <span className="text-sm font-rorboto">(En)</span>
                      </label>
                      <textarea
                        required
                        className="h-20 px-3 py-2 bg-gray-200 dark:bg-gray-400/25  outline-none focus:drop-shadow rounded w-full font-rorboto"
                        name="date_desc"
                        id="date_desc"
                        value={dateDesc}
                        onChange={(e) => {
                          setDateDesc(e.target.value);
                        }}
                        placeholder="Be happy with our collection in Electronics"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="location_desc" className="text-xl w-fit">
                        {t.location_desc}{" "}
                        <span className="text-sm font-rorboto">(En)</span>
                      </label>
                      <textarea
                        required
                        className="h-20 px-3 py-2 bg-gray-200 dark:bg-gray-400/25  outline-none focus:drop-shadow rounded w-full font-rorboto"
                        name="location_desc"
                        id="location_desc"
                        value={locationDesc}
                        onChange={(e) => {
                          setLocationDesc(e.target.value);
                        }}
                        placeholder="Be happy with our collection in Electronics"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="tags" className="text-xl w-fit">
                        {t.tags}{" "}
                        <span className="text-sm">{t.plusSeparated}</span>
                      </label>
                      <textarea
                        required
                        className="h-20 px-3 py-2 bg-gray-200 dark:bg-gray-400/25  outline-none focus:drop-shadow rounded w-full ltr:font-rorboto rtl:font-notoKufi"
                        name="tags"
                        id="tags"
                        value={tags}
                        onChange={(e) => {
                          setTags(e.target.value);
                        }}
                        placeholder={`${
                          t == enUS
                            ? "Mouse+computer+personal computer+electronics+dell+apple"
                            : "فأرة+حاسوب+جهاز شخصي+إليكترونيات+ديلل+ابل"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="terms" className="text-xl w-fit">
                        {t.terms}{" "}
                        <span className="text-sm">{t.plusSeparated}</span>
                      </label>
                      <textarea
                        required
                        className="h-20 px-3 py-2 bg-gray-200 dark:bg-gray-400/25  outline-none focus:drop-shadow rounded w-full ltr:font-rorboto rtl:font-notoKufi"
                        name="terms"
                        id="terms"
                        value={terms}
                        onChange={(e) => {
                          setTerms(e.target.value);
                        }}
                        placeholder={`${
                          t == enUS
                            ? "Mouse+computer+personal computer+electronics+dell+apple"
                            : "فأرة+حاسوب+جهاز شخصي+إليكترونيات+ديلل+ابل"
                        }`}
                      />
                    </div>
                    <div className="flex flex-row gap-2 w-full">
                      <div className="flex flex-col gap-2 px-2 w-1/2">
                        <label htmlFor="state" className="text-xl">
                          {t.state}
                        </label>
                        <select
                          id="state"
                          defaultValue={Number(state)}
                          name="state"
                          required
                          onChange={(e) => {
                            setTheState(e.target.value);
                          }}
                          className="h-10 px-3 outline-none bg-gray-200 dark:bg-gray-400/25 dark:text-gray-400  focus:drop-shadow rounded "
                        >
                          <option className="text-black" value={0}>
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
                          defaultValue={Number(mainCategory)}
                          onChange={(e: any) => {
                            setMainCategory(e.target.value);
                          }}
                          className="h-10 px-3 outline-none bg-gray-200 dark:bg-gray-400/25 dark:text-gray-400  focus:drop-shadow rounded "
                        >
                          {mainCategories.map((categoryMain: any) => {
                            return (
                              <option
                                className="text-black"
                                key={categoryMain.id}
                                value={categoryMain.id}
                              >
                                {t == enUS
                                  ? categoryMain.name
                                  : categoryMain.nameAr}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full rounded">
                      <label htmlFor="image" className="text-xl w-fit">
                        {t.image} 1
                      </label>
                      <p className="text-secondary-text">
                        {t.youCanKeepTheImageEmpty}
                      </p>
                      <input
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
                    <div className="flex justify-center sm:justify-start gap-8 px-2 pb-4 w-full">
                      <button
                        type="submit"
                        disabled={requestSent ? true : false}
                        className={`transition-all text-gray-200 rounded px-10 py-2 font-bold bg-main-color`}
                      >
                        {t.update}
                      </button>
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
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Profile;
