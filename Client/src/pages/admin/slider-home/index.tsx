import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { ar, enUS } from "../../../../translation";
import Head from "next/head";
import { useSession } from "next-auth/react";
function SliderHome() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [number, setNumber] = useState<number>(1);
  const [sliders, setSliders] = useState([]);
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
    if (session?.user.token) {
      setIsLoading(true);
      const url = `${db_link}api/sliderHome`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        })
        .then((res) => {
          setSliders(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          router.push("/");
        });
    }
  }, [session?.user.token, number, db_link]);
  const [showForm, setShowForm] = useState(false);
  const [imageData, setImageData] = useState("");
  const [backError, setBackError] = useState<any>(false);
  const [message, setMessage] = useState<any>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleChangeImage = (file: any) => {
    setImageData(file.target.files[0]);

    //----------------------------- img preview handling
    const selectedFile = file.target.files && file.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const submitHandler = (e: any) => {
    e.preventDefault();
    setRequestSent(true);
    const fData = new FormData();
    fData.append("image", imageData);
    fData.append("heading", e.target[0].value);
    fData.append("headingAr", e.target[1].value);
    fData.append("description", e.target[2].value);
    fData.append("descriptionAr", e.target[3].value);
    fData.append("link", e.target[4].value);
    axios
      .post(`${db_link}api/sliderHome`, fData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setRequestSent(false);
        if (res.data.errors) {
          setBackError(res.data.errors);
          setMessage(false);
          window.scroll(4000, 4000);
        } else {
          setBackError(false);
          if (t == enUS) {
            setMessage("added successfully");
            setPreviewUrl("");
          } else {
            setMessage("تم الإضافة بنجاح");
            setPreviewUrl("");
          }
          window.scroll(0, 0);
          e.target.reset();
          setNumber(number + 1);
        }
      })
      .catch(() => {
        setRequestSent(false);
        if (t == enUS) {
          setBackError(["the product dose not found"]);
        } else {
          setBackError(["المنتج غير موجود"]);
        }
      });
  };
  return (
    <>
      <Head>
        <title>Slider Home</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section
        className="sm:px-10 sm:mt-2 md:mt-5"
        dir={t == enUS ? "ltr" : "rtl"}
      >
        <div>
          {/* heading section */}
          <div className="flex sm:justify-between sm:flex-row gap-5 my-4 mx-2 flex-col justify-center items-center">
            <div>
              <h1 className="text-xl font-bold text-main-color">
                {t.categoryTable}
              </h1>
              <p className="text-secondary-text">{t.thisIsAllCategories}</p>
            </div>
          </div>
          {/* add category successfully */}
          {message && (
            <p className=" w-full bg-green-100 text-center p-2 my-5 rounded">
              {message}
            </p>
          )}
          {/* table section */}
          <div className="overflow-x-scroll overflow-y-hidden w-full">
            <table
              className={`${
                t == enUS ? "font-rorboto" : "font-notokufi"
              } w-full`}
            >
              <thead className="border-b-2 w-full">
                <tr>
                  <th>{t.image}</th>
                  <th>Id</th>
                  <th>
                    {t.product} <span>Id</span>
                  </th>
                  <th>
                    {t.heading}(<span>En</span>)
                  </th>
                  <th>
                    {t.heading}(<span>Ar</span>)
                  </th>
                  <th>
                    {t.description}(<span>En</span>)
                  </th>
                  <th>
                    {t.description}(<span>Ar</span>)
                  </th>
                  <th>{t.edit}</th>
                </tr>
              </thead>
              {!isLoading ? (
                <tbody className="w-full">
                  {sliders.map((slider: any, i: number) => {
                    return (
                      <tr
                        key={slider.id}
                        className={`hover:bg-gray-200 transition-all mb-2 ${
                          i % 2 == 0 && "bg-gray-100"
                        }`}
                      >
                        <td className="relative  text-center">
                          <Image
                            src={`${db_link}img/homeSlider/${slider.image}`}
                            alt="user image"
                            unoptimized={true}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </td>
                        <td className="px-2  text-center p-3">{slider.id}</td>
                        <td className="px-2  text-center p-3">
                          {slider.link ? (
                            <Link
                              href={`/${slider.link}`}
                              className="text-main-color hover:text-secondary-color"
                            >
                              {slider.link}
                            </Link>
                          ) : (
                            "N/A"
                          )}
                        </td>

                        <td className="px-2 whitespace-nowrap text-center font-rorboto">
                          {slider.heading.length >= 25
                            ? `${slider.heading.slice(0, 25)}...`
                            : slider.heading}
                        </td>
                        <td className="px-2 whitespace-nowrap text-center font-notoKufi">
                          {slider.headingAr.length >= 25
                            ? `${slider.headingAr.slice(0, 25)}...`
                            : slider.headingAr}
                        </td>
                        <td className="px-2 whitespace-nowrap text-center font-rorboto">
                          {slider.description.length >= 30
                            ? `${slider.description.slice(0, 30)}...`
                            : slider.description}
                        </td>
                        <td className="px-2 whitespace-nowrap text-center font-notoKufi">
                          {slider.descriptionAr.length >= 30
                            ? `${slider.descriptionAr.slice(0, 30)}...`
                            : slider.descriptionAr}
                        </td>
                        <td className="px-2 py-3 flex justify-center">
                          <Link
                            href={`/admin/slider-home/${slider.id}`}
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
                <div className="relative h-80 w-screen ">
                  <div
                    className="absolute left-1/2 top-1/2 spinner animate-spin inline-block w-10 h-10 border-t-4  border-main-color rounded-full"
                    role="status"
                  >
                    <span className="visually-hidden"></span>
                  </div>
                </div>
              )}
            </table>
          </div>
          {/* add category form section */}
          <div className="border-t mt-4 pt-3">
            <h2 className="w-full flex justify-start gap-2 items-center text-lg font-bold mb-2">
              {t.addCategory}{" "}
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
                  <label htmlFor="heading" className="text-xl w-fit">
                    {t.heading}{" "}
                    <span className="text-sm font-rorboto">(En)</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="heading"
                    id="heading"
                    placeholder="The new Nike shoes"
                    className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="heading" className="text-xl w-fit">
                    {t.heading}{" "}
                    <span className="text-sm font-rorboto">(Ar)</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="heading"
                    id="heading"
                    placeholder="الحذاء الجديد من نايك"
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
                    placeholder="Be happy with our  clothing collections"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="descriptionAr" className="text-xl w-fit">
                    {t.description}{" "}
                    <span className="text-sm font-rorboto">(Ar)</span>
                  </label>
                  <textarea
                    required
                    className="h-20 px-3 py-2 bg-gray-200 dark:bg-gray-400/25  outline-none focus:drop-shadow rounded w-full font-notoKufi"
                    name="descriptionAr"
                    id="descriptionAr"
                    placeholder="تمتع بأحدث العروض على الملابس التي نقدمها لك"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full">
                  <label htmlFor="link" className="text-xl w-fit">
                    {t.link}
                  </label>
                  <input
                    required
                    type="text"
                    name="link"
                    id="link"
                    placeholder="link"
                    className="h-10 px-3 outline-none font-rorboto focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                  />
                </div>
                <div className="flex flex-col gap-2 px-2 w-full rounded">
                  <div>
                    <img src={imageData} alt="" />
                  </div>
                  <label htmlFor="image" className="text-xl w-fit">
                    {t.image}
                  </label>
                  <input
                    required
                    type="file"
                    onChange={handleChangeImage}
                    accept="image/*"
                    className="block w-full text-sm text-slate-500 font-rorboto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-main-color/10 file:text-main-color hover:file:bg-main-color/20"
                  />
                  {previewUrl && (
                    <img className="h-32 w-32" src={previewUrl} alt="Preview" />
                  )}
                </div>
                <div className="flex justify-center sm:justify-start gap-8 px-2 pb-4 w-full">
                  <button
                    type="submit"
                    disabled={requestSent ? true : false}
                    className={`transition-all text-gray-200 rounded px-10 py-2 font-bold bg-main-color`}
                  >
                    {t.addCategory}
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
        </div>
      </section>
    </>
  );
}

export default SliderHome;
