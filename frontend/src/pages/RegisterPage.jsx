"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Preventing user from exceeding character limit for firstName & lastName
    let newValue = value;
    if ((name === "firstName" || name === "lastName") && value.length > 20) {
      newValue = value.slice(0, 20);
    }
  
    // Updating formData with new value
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  
    // Handling validation errors
    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors };
  
      if (name === "firstName" && newValue.length > 20) {
        errors.firstName = "Max 20 characters allowed.";
      } else {
        delete errors.firstName;
      }
  
      if (name === "lastName" && newValue.length > 20) {
        errors.lastName = "Max 20 characters allowed.";
      } else {
        delete errors.lastName;
      }
  
      return errors;
    });
  };
  

  // Simple validation function
  const validateForm = () => {
    const errors = {};
    const { firstName, lastName, email, mobile, password, confirmPassword } =
      formData;

    if (!firstName) errors.firstName = "First name is required.";
    if (!lastName) errors.lastName = "Last name is required.";
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email.";
    }
    if (!mobile) {
      errors.mobile = "Mobile number is required.";
    }else if (mobile.length != 10) {
      errors.mobile = "Mobile number must be 10 characters.";
    }
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        }
      );

      if (response.status === 201) {
        alert("User registered successfully!");
        navigate("/login");
      } else {
        alert("Error registering user. Please try again.");
      }
    } catch (error) {
      console.log("Error registering user", error);
      alert("Error registering user. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen bg-transparent text-gray-100 flex flex-col z-10 w-full relative items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-lg bg-transparent border border-gray-500 rounded-xl flex flex-col items-center justify-center z-10 p-6 sm:p-8"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-100 mt-2 mb-5 font-mono">
          Register
        </h2>
        <form
          className="flex flex-col gap-4 w-full h-full"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="w-full sm:w-1/2">
              <input
                name="firstName"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                value={formData.firstName}
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.firstName}
                </p>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <input
                name="lastName"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
                value={formData.lastName}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="w-full sm:w-1/2">
              <input
                name="email"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                value={formData.email}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <input
                name="mobile"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                type="tel"
                placeholder="Mobile"
                onChange={handleChange}
                value={formData.mobile}
              />
              {formErrors.mobile && (
                <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="w-full sm:w-1/2">
              <input
                name="password"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <input
                name="confirmPassword"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={formData.confirmPassword}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            className="bg-green-600 hover:bg-green-700 w-full text-white font-bold py-2 sm:py-3 px-4 rounded-3xl transition duration-200 items-center justify-center flex"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin" size={24} color="white" />
            ) : (
              "Register"
            )}
          </button>
          <p className="text-sm sm:text-base text-gray-400 hover:text-white transition duration-200 text-center mt-4">
            Already have an account?{" "}
            <Link
              className="text-green-500 hover:text-green-600 transition duration-200"
              to="/login"
            >
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;
