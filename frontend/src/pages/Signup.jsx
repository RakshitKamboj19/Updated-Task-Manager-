import React, { useEffect } from 'react';
import SignupForm from '../components/SignupForm';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';

const Signup = ({ Dark, setDark }) => {
  useEffect(() => {
    document.title = 'Signup';
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
            Create Your Account
          </motion.h1>
          <motion.p
            className={`text-lg mb-8 ${Dark ? 'text-gray-300' : 'text-gray-700'}`} // Adjusted text color for dark mode
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join us and start managing your tasks and boosting your productivity today.
          </motion.p>

          {/* Signup Form with Conditional Background Color */}
          <motion.div
            className={`p-8 rounded-lg shadow-lg ${Dark ? 'bg-gray-800' : 'bg-blue-50'}`} // Adjusted form background color
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <SignupForm Dark={Dark} setDark={setDark} />
          </motion.div>

          {/* Footer with Login link */}
          <motion.p
            className={`mt-6 text-center ${Dark ? 'text-gray-400' : 'text-gray-600'}`} // Adjusted text color for dark mode
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Already have an account? <a href="/login" className="text-blue-500">Login here</a>
          </motion.p>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Signup;