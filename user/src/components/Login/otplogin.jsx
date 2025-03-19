import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on Backspace
      inputRefs.current[index - 1].focus();
    }
  };

const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length === 4) {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_URL+"/api/user/VerifyOTP", {
          email,
          otp: otpCode,
        });

        if (response.data.success) {
            const userData = response.data.user;
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", response.data.token);
            alert("OTP Verified Successfully!");
            navigate("/");
        } else {
          alert("Invalid OTP. Please try again.");
        }
      } catch (error) {
        alert("OTP verification failed. Please try again.");
      }
    } else {
      alert("Please enter a valid 4-digit OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Enter OTP
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          We have sent a 4-digit OTP to <span className="font-semibold">{email}</span>
        </p>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          ))}
        </div>

        {/* Verify OTP Button */}
        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700 transition-all duration-300"
          onClick={handleSubmit}
        >
          Verify OTP
        </button>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Didn't receive the OTP? <span className="text-blue-500 cursor-pointer">Resend</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;


