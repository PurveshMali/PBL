import React from "react";
import { motion } from "framer-motion";

const submitHandler = (e) => {
  e.preventDefault();
};
const LoginPage = () => {
  return (
    <motion.div className="min-h-screen bg-transperant text-gray-100 flex flex-col z-10 w-full relative items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-[30%] h-auto bg-transperenrt border border-gray-500 rounded-xl flex flex-col items-center justify-center z-10
      p-3"
      >
        <h2 className="text-4xl font-semibold text-gray-100 mt-2 font-mono">Login</h2>
        <form
          action=""
          className="flex flex-col items-center justify-between gap-4 w-full h-full p-6"
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <input
            className="w-full mb-2 bg-transparent border border-gray-500 py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            type="text"
            placeholder="Username"
          />
          <input
            className="w-full mb-2 bg-transparent border border-gray-500 py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            type="text"
            placeholder="Username"
          />
          <input
            className="w-full mb-2 bg-transparent border border-gray-500 py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            type="text"
            placeholder="Username"
          />
          <input
            className="w-full mb-2 py-3 px-4 rounded-3xl bg-transparent border border-gray-500  text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            type="text"
            placeholder="Username"
          />
          <button className="bg-green-600 hover:bg-green-700 w-full text-white font-bold py-3 px-4 rounded-3xl transition duration-200sm:w-auto">
            Login
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
