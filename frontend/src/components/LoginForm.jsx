import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validateManyFields from '../validations';
import Input from './utils/Input';
import { useDispatch, useSelector } from "react-redux";
import { postLoginData } from '../redux/actions/authActions';
import Loader from './utils/Loader';

const LoginForm = ({ Dark, setDark, redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const authState = useSelector(state => state.authReducer);
  const { loading, isLoggedIn } = authState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || "/");
    }
  }, [isLoggedIn, redirectUrl, navigate]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("login", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }
    dispatch(postLoginData(formData.email, formData.password));
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <form
      className={`m-auto my-16 max-w-[500px] p-8 border-2 shadow-md rounded-md ${Dark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className='text-center mb-4'>
            Welcome user, please login here
          </h2>

          <div className="mb-4">
            <label htmlFor="email" className={`after:content-['*'] after:ml-0.5 after:text-red-500 ${Dark ? 'text-white' : 'text-black'}`}>
              Email
            </label>
            <Input
              type="text"
              name="email"
              id="email"
              value={formData.email}
              placeholder="youremail@domain.com"
              onChange={handleChange}
              aria-invalid={formErrors.email ? "true" : "false"}
              aria-describedby="email-error"
            />
            {fieldError("email")}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className={`after:content-['*'] after:ml-0.5 after:text-red-500 ${Dark ? 'text-white' : 'text-black'}`}>
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              placeholder="Your password.."
              onChange={handleChange}
              aria-invalid={formErrors.password ? "true" : "false"}
              aria-describedby="password-error"
            />
            {fieldError("password")}
          </div>

          <button
            className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark disabled:opacity-50'
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </button>

          <div className='pt-4'>
            <Link to="/signup" className={`text-blue-400 ${Dark ? 'text-blue-300' : 'text-blue-400'}`}>
              Don't have an account? Signup here
            </Link>
          </div>
        </>
      )}
    </form>
  );
};

export default LoginForm;