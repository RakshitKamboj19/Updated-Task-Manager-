import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import validateManyFields from "../validations";
import Input from "./utils/Input";
import Loader from "./utils/Loader";

const SignupForm = ({ Dark, setDark }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [fetchData, { loading, error: serverError }] = useFetch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields("signup", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    const config = { url: "/auth/signup", method: "post", data: formData };
    localStorage.setItem("email", formData.email);
    fetchData(config)
      .then(() => {
        navigate("/otp");
      })
      .catch((err) => {
        console.error("Error during signup:", err);
      });
  };

  const fieldError = (field) => (
    <p
      className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}
      id={`${field}-error`}
    >
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <form
      className={`m-auto my-16 max-w-[500px] p-8 rounded-md shadow-md ${
        Dark ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className="text-center mb-4">Welcome user, please signup here</h2>
          {serverError && (
            <p className="mb-4 text-red-500 text-center">
              <i className="mr-2 fa-solid fa-circle-exclamation"></i>
              {serverError.message || "An error occurred. Please try again."}
            </p>
          )}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Name
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              placeholder="Your name"
              onChange={handleChange}
              aria-describedby="name-error"
            />
            {fieldError("name")}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Email
            </label>
            <Input
              type="text"
              name="email"
              id="email"
              value={formData.email}
              placeholder="youremail@domain.com"
              onChange={handleChange}
              aria-describedby="email-error"
            />
            {fieldError("email")}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              placeholder="Your password.."
              onChange={handleChange}
              aria-describedby="password-error"
            />
            {fieldError("password")}
          </div>

          <button
            className="bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </button>

          <div className="pt-4">
            <Link to="/login" className="text-blue-400">
              Already have an account? Login here
            </Link>
          </div>
        </>
      )}
    </form>
  );
};

export default SignupForm;