import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import { FaBan, FaInfoCircle, FaShieldAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
function Profile() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  //Top Level Variables
  const router = useRouter();

  const userId = router.query.id;
  const { data: session, status } = useSession();

  //Response Data
  const [userData, setUserData] = useState<{
    created_at: string;
    id: number;
    gender: number;
    name: string;
    address1: string;
    address2: string;
    phone: string;
    remember_token: null;
    role: number;
    email: string;
    updated_at: string;
    location_link: string;
  }>({
    created_at: "loading",
    id: 1111,
    gender: 0,
    name: "loading",
    address1: "loading",
    address2: "loading",
    phone: "loading",
    remember_token: null,
    email: "loading",
    role: 2,
    updated_at: "loading",
    location_link: "loading",
  });

  //State Variables
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<any>([0, "", 0]);
  const [locating, setLocating] = useState(false);
  //Fetch Data
  useEffect(() => {
    if (db_link === "") return;
    if (session == null) {
      if (status == "unauthenticated") {
        router.push("/");
      }
      return;
    }
    if (session.user.role != 0) {
      router.push("/");
    }
    setLoading(true);
    axios
      .get(`${db_link}api/user/admin/${userId}`, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      })
      .then((res) => {
        if (res.data) {
          if (res.data == "you are not allowed here") {
            router.push("/");
          }
          setUserData(res.data[0]);
          setLoading(false);
        }
      })
      .catch(() => {
        // router.push("/");
      });
  }, [userId, status, db_link]);

  // Toggles Functions
  const makeSuperAdmin = () => {
    axios
      .get(`${db_link}api/user/makeSuper/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        window.scroll(0, 0);
        setMessage([1, "Updated to Super Admin Successfully", 1]);
        setUserData(res.data);
      })
      .catch(() => {
        window.scroll(0, 0);
        setMessage([1, "Something Went Wrong, Please try again", 0]);
      });
  };
  const makeNormalAdmin = () => {
    axios
      .get(`${db_link}api/user/makeNormalAdmin/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        window.scroll(0, 0);
        setMessage([1, "Updated to Normal Admin Successfully", 1]);
        setUserData(res.data);
      })
      .catch(() => {
        window.scroll(0, 0);
        setMessage([1, "Something Went Wrong, Please try again", 0]);
      });
  };
  const banUser = () => {
    axios
      .get(`${db_link}api/user/banUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        window.scroll(0, 0);
        setMessage([1, "User Banned Successfully", 1]);
        setUserData(res.data);
      })
      .catch(() => {
        window.scroll(0, 0);
        setMessage([1, "Something Went Wrong, Please try again", 0]);
      });
  };
  const banAdmin = () => {
    axios
      .get(`${db_link}api/user/banAdmin/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        window.scroll(0, 0);
        setMessage([1, "Admin Banned Successfully", 1]);
        setUserData(res.data);
      })
      .catch(() => {
        window.scroll(0, 0);
        setMessage([1, "Something Went Wrong, Please try again", 0]);
      });
  };
  const makeNormalUser = () => {
    axios
      .get(`${db_link}api/user/makeNormalUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        window.scroll(0, 0);
        setMessage([1, "Updated to Normal User Successfully", 1]);
        setUserData(res.data);
      })
      .catch(() => {
        window.scroll(0, 0);
        setMessage([1, "Something Went Wrong, Please try again", 0]);
      });
  };

  // Delete Account
  const areYouSureHandler = () => {
    if (confirm("Are You Sure To Delete Account, You Cant Undo This Action")) {
      axios
        .delete(`${db_link}api/user/delete/${userId}`, {
          headers: { Authorization: `Bearer ${session?.user.token}` },
        })
        .then(() => {
          router.push("/admin/stuff");
        })
        .catch(() => {
          setMessage([1, "Something Went Wrong, Please try again", 0]);
        });
    }
  };
  function getCurrentLocation() {
    setLocating(true);
    const locationField: any = document.getElementById("location_link");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          locationField.value = googleMapsLink;
          setLocating(false);
        },
        () => {
          setLocating(false);
          alert(
            "Unable to retrieve location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      setLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  }
  // Date Handler
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const addLocation = (e: any) => {
    e.preventDefault();
    const fData = new FormData();
    fData.append("_method", "PUT");
    fData.append("location_link", e.target[0].value);
    axios
      .post(`${db_link}api/user/location/${userId}`, fData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        window.scroll(0, 0);
        setMessage([1, "Location Added Successfully", 1]);
        setUserData(res.data);
      })
      .catch(() => {
        window.scroll(0, 0);
        setMessage([1, "Something Went Wrong, Please try again", 0]);
      });
  };

  // Return Function
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Alert Message */}
      {message[0] == 1 && (
        <div
          className={`rounded-lg shadow-sm p-4 mb-6 ${
            message[2] == 0
              ? "bg-red-50 border border-red-100 text-red-700"
              : "bg-green-50 border border-green-100 text-green-700"
          }`}
        >
          <p className="text-center font-medium">{message[1]}</p>
        </div>
      )}

      {loading ? (
        <div className="min-h-[400px] flex flex-col gap-3 justify-center items-center">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute w-full h-full border-4 border-main-color rounded-full animate-[spin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite] border-t-transparent"></div>
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
        </div>
      ) : (
        <>
          {/* Staff Profile Header */}
          <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-main-color to-secondary-color p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/30 group-hover:ring-white/50 transition-all duration-300 bg-gradient-to-br from-main-color to-secondary-color flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {userData.phone}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {userData.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 opacity-70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {userData.address1} - {userData.address2}
                  </span>
                </div>
              </div>

              {/* Role Badge */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`px-4 py-2 rounded-full ${getRoleBadgeStyles(
                    userData.role
                  )}`}
                >
                  {getRoleLabel(userData.role)}
                </div>
                <span className="text-sm opacity-70">
                  Since {formatDate(userData.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {session?.user.role === 0 &&
            userData.id !== session.user.id &&
            userData.id !== 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {userData.role !== 0 && (
                  <button
                    onClick={makeSuperAdmin}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 group"
                  >
                    <FaShieldAlt className="text-xl group-hover:scale-110 transition-transform duration-300" />
                    <span>Make Super Admin</span>
                  </button>
                )}
                {userData.role !== 1 && userData.role !== 0 && (
                  <button
                    onClick={makeNormalAdmin}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 group"
                  >
                    <FaShieldAlt className="text-xl group-hover:scale-110 transition-transform duration-300" />
                    <span>Make Normal Admin</span>
                  </button>
                )}
                {userData.role !== 2 && userData.role !== 3 && (
                  <button
                    onClick={makeNormalUser}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group"
                  >
                    <FaShieldAlt className="text-xl group-hover:scale-110 transition-transform duration-300" />
                    <span>Make Normal User</span>
                  </button>
                )}
                {userData.role <= 2 && (
                  <button
                    onClick={userData.role <= 1 ? banAdmin : banUser}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 group"
                  >
                    <FaBan className="text-xl group-hover:scale-110 transition-transform duration-300" />
                    <span>{userData.role <= 1 ? "Ban Admin" : "Ban User"}</span>
                  </button>
                )}
                {(userData.role === 3 || userData.role === 4) && (
                  <button
                    onClick={makeNormalAdmin}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 group"
                  >
                    <FaShieldAlt className="text-xl group-hover:scale-110 transition-transform duration-300" />
                    <span>Unban User</span>
                  </button>
                )}
                <button
                  onClick={areYouSureHandler}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 group"
                >
                  <BiTrash className="text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span>Delete Account</span>
                </button>
              </div>
            )}

          {/* Special Messages */}
          {session?.user.role !== 0 && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 text-yellow-800">
                <FaInfoCircle className="text-xl" />
                <p className="font-medium">You Are Not Allowed Here</p>
              </div>
            </div>
          )}
          {userData.id === session?.user.id && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 text-blue-800">
                <FaInfoCircle className="text-xl" />
                <p className="font-medium">
                  You Can't Change Your Role, You Are The Owner
                </p>
              </div>
            </div>
          )}
          {userData.id === 1 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 text-red-800">
                <FaInfoCircle className="text-xl" />
                <p className="font-medium">
                  This Account Is For Programming Purposes, Please Don't Do
                  Anything To It
                </p>
              </div>
            </div>
          )}
        </>
      )}
      {/* location_link form */}
      <div>
        <p>Location: {userData.location_link}</p>
        {userData.location_link && (
          <Link
            href={userData.location_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-fit mt-3 px-6 py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          >
            Open in Google Maps
          </Link>
        )}
      </div>
      <form
        onSubmit={addLocation}
        className="flex flex-col justify-center items-center gap-3 mb-8"
      >
        <div className="flex w-full flex-col justify-center items-center gap-1 mt-8">
          <label htmlFor="location_link" className=" font-bold text-gray-700">
            Add Location Link
          </label>
          <input
            type="text"
            id="location_link"
            name="location_link"
            className="block w-full sm:w-1/2  px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-main-color focus:ring-opacity-50"
            placeholder="Location Link"
          />
        </div>
        <button
          type="button"
          disabled={locating}
          onClick={getCurrentLocation}
          className="w-2/3 sm:w-1/2 px-2 py-3 rounded-lg text-white font-semibold bg-main-color hover:bg-secondary-color focus:ring-4 focus:ring-main-color focus:ring-opacity-50 transition-all duration-300"
        >
          {locating ? "Locating..." : "Get Current Location"}
        </button>
        <button
          type="submit"
          className="w-2/3 sm:w-1/2 px-2 py-3 rounded-lg text-white font-semibold bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-main-color focus:ring-opacity-50 transition-all duration-300"
        >
          Add Location
        </button>
      </form>
    </section>
  );
}

// Helper function to get role label
function getRoleLabel(role: number) {
  switch (role) {
    case 0:
      return "Super Admin";
    case 1:
      return "Normal Admin";
    case 2:
      return "Normal User";
    case 3:
      return "Banned User";
    case 4:
      return "Banned Admin";
    default:
      return "Unknown";
  }
}

// Helper function to get role badge styles
function getRoleBadgeStyles(role: number) {
  switch (role) {
    case 0:
      return "bg-indigo-500 text-white font-semibold";
    case 1:
      return "bg-green-500 text-white font-semibold";
    case 2:
      return "bg-blue-500 text-white font-semibold";
    case 3:
      return "bg-red-500 text-white font-semibold";
    case 4:
      return "bg-orange-500 text-white font-semibold";
    default:
      return "bg-gray-500 text-white font-semibold";
  }
}

export default Profile;
