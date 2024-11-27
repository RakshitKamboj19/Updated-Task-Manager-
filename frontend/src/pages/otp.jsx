import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

import { motion } from "framer-motion";
import Loader from "../components/utils/Loader";

const OtpPage = ({ Dark, setDark }) => {
  const [fetchData, { loading }] = useFetch();
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email"),
    otp: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = { url: "/auth/otp", method: "post", data: formData };
      localStorage.removeItem("email");
      fetchData(config).then(() => {
        navigate("/login");
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <form
      className={`m-auto my-16 max-w-[500px] p-8 border-2 shadow-md rounded-md ${Dark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
      {loading ? (
        <Loader />
      ) : (
        <motion.div
          className={`min-h-screen flex items-center justify-center ${Dark ? 'bg-gray-900' : 'bg-blue-100'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className={`p-8 rounded-lg shadow-lg max-w-sm w-full ${Dark ? 'bg-gray-700' : 'bg-white'}`}>
            <h1 className={`text-2xl font-bold text-center ${Dark ? 'text-blue-400' : 'text-blue-800'} mb-4`}>
              Enter OTP
            </h1>
            <p className={`text-center mb-6 ${Dark ? 'text-gray-300' : 'text-gray-700'}`}>
              Please enter the OTP sent to your email address.
            </p>

            <div className="mb-4">
              <label htmlFor="otp" className={`block mb-2 ${Dark ? 'text-gray-300' : 'text-gray-700'}`}>
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${Dark ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-black border-gray-300'} focus:ring-blue-400`}
              />
            </div>

            <button
              className={`w-full py-2 mt-4 font-medium rounded-lg ${Dark ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={handleSubmit}
            >
              Verify OTP
            </button>
          </div>
        </motion.div>
      )}
    </form>
  );
};

export default OtpPage;