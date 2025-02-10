import React from "react";
import { motion } from "framer-motion";

const submitHandler = (e) => {
  e.preventDefault();
};

const RegisterPage = () => {
  return (
    <motion.div className="min-h-screen bg-transparent text-gray-100 flex flex-col z-10 w-full relative items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-[40%] h-auto bg-transparent border border-gray-500 rounded-xl flex flex-col items-center justify-center z-10 p-6"
      >
        <h2 className="text-4xl font-semibold text-gray-100 mt-2 mb-5 font-mono">Register</h2>
        <form
          className="flex flex-col gap-4 w-full h-full p-6"
          onSubmit={submitHandler}
        >
          <div className="flex w-full gap-4">
            <input
              className="w-1/2 bg-transparent border border-gray-500 py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="text"
              placeholder="First Name"
            />
            <input
              className="w-1/2 bg-transparent border border-gray-500 py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="text"
              placeholder="Last Name"
            />
          </div>
          <div className="flex w-full gap-4">
            <input
              className="w-1/2 bg-transparent border border-gray-500 py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="email"
              placeholder="Email"
            />
            <input
              className="w-1/2 bg-transparent border border-gray-500 py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="tel"
              placeholder="Mobile"
            />
          </div>
          <div className="flex w-full gap-4">
            <input
              className="w-1/2 bg-transparent border border-gray-500 py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="password"
              placeholder="Password"
            />
            <input
              className="w-1/2 bg-transparent border border-gray-500 py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          
          <button className="bg-green-600 hover:bg-green-700 w-full text-white font-bold py-3 px-4 rounded-3xl transition duration-200">
            Register
          </button>
          <p className="text-gray-400 hover:text-white transition duration-200 text-center">
            Already have an account? {" "}
            <a className="text-green-500 hover:text-green-600 transition duration-200" href="/login">
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;
