"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { Loader } from "lucide-react"

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    setIsLoading(true)
    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      })

      alert("User registered successfully!")
      navigate("/login")
    } catch (error) {
      console.log("Error registering user", error)
      alert("Error registering user. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div className="min-h-screen bg-transparent text-gray-100 flex flex-col z-10 w-full relative items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-lg bg-transparent border border-gray-500 rounded-xl flex flex-col items-center justify-center z-10 p-6 sm:p-8"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-100 mt-2 mb-5 font-mono">Register</h2>
        <form className="flex flex-col gap-4 w-full h-full" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <input
              name="firstName"
              className="w-full sm:w-1/2 bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="text"
              placeholder="First Name"
              onChange={handleChange}
            />
            <input
              name="lastName"
              className="w-full sm:w-1/2 bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="text"
              placeholder="Last Name"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <input
              name="email"
              className="w-full sm:w-1/2 bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              name="mobile"
              className="w-full sm:w-1/2 bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="tel"
              placeholder="Mobile"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <input
              name="password"
              className="w-full sm:w-1/2 bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <input
              name="confirmPassword"
              className="w-full sm:w-1/2 bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
          </div>

          <button
            className="bg-green-600 hover:bg-green-700 w-full text-white font-bold py-2 sm:py-3 px-4 rounded-3xl transition duration-200 items-center justify-center flex"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" size={24} color="white" overlinePosition={"center"} underlinePosition={"center"}/> : "Register"}
          </button>
          <p className="text-sm sm:text-base text-gray-400 hover:text-white transition duration-200 text-center mt-4">
            Already have an account?{" "}
            <Link className="text-green-500 hover:text-green-600 transition duration-200" to="/login">
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default RegisterPage

