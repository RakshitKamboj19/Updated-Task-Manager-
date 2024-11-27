import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';

const Login = ({ Dark, setDark }) => {
  const { state } = useLocation();
  const redirectUrl = state?.redirectUrl || null;

  useEffect(() => {
    document.title = 'Login';
  }, []);

  return (
    <MainLayout Dark={Dark} setDark={setDark}>
      {/* Page Background */}
      <motion.div
        className={`min-h-screen py-12 ${Dark ? 'bg-gray-900' : 'bg-blue-100'}`} // Dark mode background
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={`max-w-md mx-auto text-center ${Dark ? 'text-white' : 'text-black'}`}>
          <motion.h1
            className={`text-4xl font-bold mb-6 ${Dark ? 'text-blue-400' : 'text-blue-800'}`} // Adjusted text color for dark mode
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Welcome Back!
          </motion.h1>
          <motion.p
            className={`text-lg mb-8 ${Dark ? 'text-gray-300' : 'text-gray-700'}`} // Adjusted text color for dark mode
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Please log in to access your tasks and continue managing your productivity.
          </motion.p>

          {/* Login Form with Conditional Background Color */}
          <motion.div
            className={`p-8 rounded-lg shadow-lg ${Dark ? 'bg-gray-800' : 'bg-blue-50'}`} // Adjusted form background color
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <LoginForm Dark={Dark} setDark={setDark} redirectUrl={redirectUrl} />
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Login;