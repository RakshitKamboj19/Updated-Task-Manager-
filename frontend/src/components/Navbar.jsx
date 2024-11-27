import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../redux/actions/authActions";

const Navbar = ({ Dark, setDark }) => {
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dark-mode");
    if (savedTheme) setDark(JSON.parse(savedTheme));
  }, [setDark]);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  const toggleTheme = () => {
    const newTheme = !Dark;
    setDark(newTheme);
    localStorage.setItem("dark-mode", JSON.stringify(newTheme));
  };

  const renderNavLinks = () => (
    <>
      {authState.isLoggedIn ? (
        <>
          <li
            className={`py-2 px-3 rounded-md ${
              location.pathname === "/tasks/add" ? "bg-blue-500 text-white" : ""
            }`}
          >
            <Link to="/tasks/add" className="block w-full h-full">
              <i className="fa-solid fa-plus"></i> Add Task
            </Link>
          </li>
          <li
            className="py-2 px-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition rounded-md"
            onClick={handleLogoutClick}
          >
            Logout
          </li>
        </>
      ) : (
        <li
          className={`py-2 px-3 cursor-pointer transition rounded-md ${
            location.pathname === "/login"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Link to="/login">Login</Link>
        </li>
      )}
      <li
        className="py-2 px-3 cursor-pointer dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-md transition"
        onClick={toggleTheme}
      >
        <i
          className={`mr-2 ${Dark ? "fa-solid fa-sun" : "fa-solid fa-moon"}`}
        ></i>
      </li>
    </>
  );

  return (
    <header
      className={`flex justify-between sticky top-0 p-4 ${
        Dark ? "bg-gray-800 text-white" : "bg-white text-black"
      } shadow-sm items-center transition-colors duration-300`}
    >
      <h2 className="cursor-pointer text-blue-600 dark:text-blue-400 flex items-center">
        <Link to="/">
          <i className="fas fa-tasks text-3xl mr-2"></i>
          <span style={{
            fontSize: "2rem",
            fontWeight: "bold"
          }}>Task Manager</span>
        </Link>
      </h2>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-4 uppercase font-medium">
        {renderNavLinks()}
      </ul>

      {/* Hamburger Icon for Mobile */}
      <span
        className="md:hidden cursor-pointer text-gray-700 dark:text-gray-300"
        onClick={toggleNavbar}
        aria-label="Toggle Navigation Menu"
      >
        <i className="fa-solid fa-bars"></i>
      </span>

      {/* Mobile Navigation */}
      {isNavbarOpen && (
        <div
          className={`fixed inset-0 ${
            Dark ? "bg-gray-900" : "bg-gray-100"
          } shadow-md w-screen sm:w-9/12 h-screen transition-transform transform translate-x-0 md:translate-x-full z-50`}
          aria-label="Mobile Navigation Menu"
        >
          <div className="flex">
            <span
              className="m-4 ml-auto cursor-pointer text-gray-700 dark:text-gray-300"
              onClick={toggleNavbar}
              aria-label="Close Navigation Menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </span>
          </div>
          <ul className="flex flex-col gap-4 uppercase font-medium text-center">
            {renderNavLinks()}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
