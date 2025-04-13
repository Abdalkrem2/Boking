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
  const sliderId = router.query.id;
  const language = useSelector((state: RootState) => state.language.value);
  const [loading, setLoading] = useState(true);
  const [t, tHandler] = useState(language === 0 ? enUS : ar);
  const [sliderData, setSliderData] = useState<any>("");
  const [message, setMessage] = useState<any>(false);
  const [heading, setHeading] = useState<string>("");
  const [headingAr, setHeadingAr] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionAr, setDescriptionAr] = useState<string>("");
  const [link, setLink] = useState<any>("");
  useEffect(() => {
    if (db_link === "") return;
    axios
      .get(`${db_link}api/sliderHome/${sliderId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        if (res.data[0]) {
          const data = res.data[0];
          setSliderData(data);
          setHeading(data.heading);
          setHeadingAr(data.headingAr);
          setDescription(data.description);
          setDescriptionAr(data.descriptionAr);
          setLink(data.link);

          setLoading(false);
        }
      })
      .catch(() => {
        router.push("/");
      });
  }, [sliderId, db_link]);
  useEffect(() => {
    if (localStorage.getItem("nepShopLang") === "0") {
      tHandler(enUS);
    } else if (localStorage.getItem("nepShopLang") === "1") {
      tHandler(ar);
    } else {
      tHandler(language === 0 ? enUS : ar);
    }
  }, [language]);
  const [showForm, setShowForm] = useState(false);
  const [imageData, setImageData] = useState("");
  const [backError, setBackError] = useState<any>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);

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
    fData.append("_method", "PUT");
    if (imageData) {
      fData.append("image", imageData);
    }
    fData.append("heading", e.target[0].value);
    fData.append("headingAr", e.target[1].value);
    fData.append("description", e.target[2].value);
    fData.append("descriptionAr", e.target[3].value);
    fData.append("link", e.target[4].value);

    axios
      .post(`${db_link}api/sliderHome/${sliderId}`, fData, {
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
          setMessage(t.theDataUpdated);
          setPreviewUrl("");

          window.scroll(0, 0);
          e.target.reset();
        }
      })
      .catch(() => {
        setRequestSent(false);
        if (t == enUS) {
          setBackError(["the product dose not exist"]);
        } else {
          setBackError(["المنتج غير موجود"]);
        }
      });
  };
  const changeHeadingHandler = (e: any) => {
    setHeading(e.target.value);
  };
  const changeHeadingArHandler = (e: any) => {
    setHeadingAr(e.target.value);
  };
  const changeDescriptionHandler = (e: any) => {
    setDescription(e.target.value);
  };
  const changeDescriptionArHandler = (e: any) => {
    setDescriptionAr(e.target.value);
  };
  const changeLinkHandler = (e: any) => {
    setLink(e.target.value);
  };
  const [showDelete, setShowDelete] = useState(false);
  const areYouSureHandler = () => {
    if (confirm(t.areYouSureToDeleteSlider)) {
      axios
        .delete(`${db_link}api/sliderHome/${sliderId}`, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        })
        .then(() => {
          router.push("/admin/slider-home");
        })
        .catch(() => {
          setMessage(t.somethingWentWrong);
        });
    }
  };
  return (
    <>
      <Head>
        <title>slider-{sliderId}</title>
        <link rel="icon" href="/NEPCart.ico" />
      </Head>
      <section className="sm:px-10 md:px-20 lg:px-32 sm:mt-2 md:mt-5">
        <div>
          {loading ? (
            "loading"
          ) : (
            <>
              {/* message */}
              {message == t.theDataUpdated && (
                <p
                  className={`w-full bg-green-400/40 rounded text-center py-2 my-2 ${
                    t == enUS ? "font-rorboto" : "font-notoKufi"
                  }`}
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
                      href={"/admin/category"}
                      className="text-main-color hover:text-secondary-color"
                    >
                      {t.sliderView}
                    </Link>
                    : {sliderData.heading}
                  </h1>
                  <p className="text-secondary-text mb-2 font-rorboto">
                    heading: {sliderData.heading}
                  </p>
                  <p className="text-secondary-text mb-2 font-notoKufi ">
                    <span className=" font-rorboto">headingAr</span>:{" "}
                    {sliderData.headingAr}
                  </p>
                  <p className="text-secondary-text mb-2 font-rorboto ">
                    Description:{" "}
                    {sliderData.description.length >= 30
                      ? `${sliderData.description.slice(0, 30)}...`
                      : sliderData.description}
                  </p>
                  <p className="text-secondary-text mb-2 font-notoKufi ">
                    <span className=" font-rorboto">DescriptionAr</span>:{" "}
                    {sliderData.descriptionAr.length >= 30
                      ? `...${sliderData.descriptionAr.slice(0, 30)}`
                      : sliderData.descriptionAr}
                  </p>
                </div>
                <div className="basis-1/2 flex justify-end">
                  <div className="w-52 h-52 rounded-xl shadow relative overflow-hidden">
                    <Image
                      src={`${db_link}img/homeSlider/${sliderData.image}`}
                      alt={"category image"}
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
                <h2 className="w-full flex justify-start gap-2 items-center text-lg font-bold mb-2 ltr:font-rorboto rtl:font-notoKufi">
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
                    className={`rtl:font-notoKufi ltr:font-rorboto flex flex-col gap-4 w-full md:w-1/2 items-center sm:items-start sm:rtl:items-end mb-2`}
                  >
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="heading" className="text-xl w-fit">
                        {t.categoryForm}{" "}
                        <span className="text-sm font-rorboto">(En)</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="heading"
                        id="heading"
                        value={heading}
                        onChange={changeHeadingHandler}
                        placeholder="Electronics"
                        className="font-rorboto h-10 px-3 outline-none  focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full">
                      <label htmlFor="headingAr" className="text-xl w-fit">
                        {t.categoryForm}{" "}
                        <span className="text-sm font-rorboto">(Ar)</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="headingAr"
                        id="headingAr"
                        value={headingAr}
                        onChange={changeHeadingArHandler}
                        placeholder="الإلكترونيات"
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
                        onChange={changeDescriptionHandler}
                        placeholder="Be happy with our collection in Electronics"
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
                        value={descriptionAr}
                        onChange={changeDescriptionArHandler}
                        placeholder="تمتع بأحدث العروض على الأجهزة الإلكترونية التي نقدمها لك"
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
                        value={link}
                        onChange={changeLinkHandler}
                        placeholder="link"
                        className="h-10 px-3 outline-none focus:drop-shadow rounded border-2 border-main-color/30 bg-transparent focus:border-main-color/60 border-solid"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-2 w-full rounded">
                      <div>
                        <img src={imageData} alt="" />
                      </div>
                      <label htmlFor="image" className="text-xl w-fit">
                        {t.image}
                        <br />
                        <span className="text-secondary-text text-sm">
                          {t.imageUpdateNote}
                        </span>
                      </label>
                      <input
                        type="file"
                        onChange={handleChangeImage}
                        accept="image/*"
                        className="block w-full text-sm text-slate-500 font-rorboto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-main-color/10 file:text-main-color hover:file:bg-main-color/20"
                      />
                      {previewUrl && (
                        <img
                          className="h-32 w-32"
                          src={previewUrl}
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

              {/* --delete category section-- */}
              <div
                className="border-t mt-4 pt-3"
                dir={t == enUS ? "ltr" : "rtl"}
              >
                <h2 className="w-full flex justify-start gap-2 items-center text-lg font-bold mb-2 ltr:font-rorboto rtl:font-notoKufi">
                  {t.delete}{" "}
                  <button
                    onClick={() => {
                      if (showDelete) {
                        setShowDelete(false);
                      } else {
                        setShowDelete(true);
                      }
                    }}
                    className={`bg-red-500 p-1 rounded-full text-white ${
                      showDelete ? "rotate-180" : "rotate-0"
                    } transition-all hover:bg-red-400`}
                  >
                    <IoIosArrowDown />
                  </button>
                </h2>
                {showDelete && (
                  <p>
                    <button
                      onClick={areYouSureHandler}
                      className="bg-red-500 text-white p-2 rounded ltr:font-rorboto rtl:font-notoKufi"
                    >
                      {t.deleteSlider}
                    </button>
                  </p>
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
