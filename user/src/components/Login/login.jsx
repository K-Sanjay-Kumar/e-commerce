import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const googlelogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      GetUserProfile(tokenResponse);
    },
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenResponse) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        const userData = {
          name: response.data.name,
          email: response.data.email,
          mobile: response.data.phone_number || "", // If phone number exists
          picture: response.data.picture,
        };

        // Send user data to backend
        axios
          .post(import.meta.env.VITE_SERVER_URL+"/api/user/register", userData)
          .then((response) => {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
            navigate("/");
          })
          .catch((error) => console.error("Error registering user:", error));
      })
      .catch((error) => console.error("Error fetching user profile:", error));
  };

  const sendOTP = () => {
    setLoader(true);
    axios
      .post(import.meta.env.VITE_SERVER_URL+"/api/user/SendOTP", { email })
      .then((response) => {
        setLoader(false);
        navigate("/verify-otp", { state: { email } });
      })
      .catch((error) => {
        setLoader(false);
        alert("Invalid mail id! Please login through Google");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Welcome Back!
        </h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Login Button */}
        <button
          className="w-full bg-primary text-white py-3 rounded-lg mt-4 hover:bg-primary-dark transition-all duration-300"
          onClick={sendOTP}
        >
            {loader ? (
                <div className="flex items-center gap-2">
                    <span className="loader"></span>
                    <span>Sending...</span>
                </div>
            ) : (
                <span>Send OTP</span>
            )}
        </button>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-500">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Login Button */}
        <button
          className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          onClick={googlelogin}
        >
          <FcGoogle className="text-2xl mr-2" />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;


