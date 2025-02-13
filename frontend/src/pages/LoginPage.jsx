"use client"

import { useEffect, useState } from "react"
import { delay, motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Loader from "../components/common/Loader"

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value })
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          await axios.get("http://localhost:3000/api/auth/validate", {
            headers: { Authorization: `Bearer ${token}` },
          })
          navigate("/overview")
        } catch (error) {
          console.log("Invalid token, user needs to log in.")
          localStorage.removeItem("token")
        }
      }
    }
    checkAuth()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Basic client-side validation
    if (!credentials.email || !credentials.password) {
      toast.error("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      setIsValidating(true)
      const { data } = await axios.post("http://localhost:3000/api/auth/login", credentials)
      localStorage.setItem("token", data.token)
      toast.success("Login successful!")

      navigate("/overview")
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid credentials"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
      setIsValidating(false)
    }
  }

  return (
    <motion.div className="min-h-screen bg-transparent text-gray-100 flex flex-col z-10 w-full relative items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-md bg-transparent border border-gray-500 rounded-xl flex flex-col items-center justify-center z-10 p-6 sm:p-8"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-100 mt-2 mb-5 font-mono">Login</h2>
        <form className="flex flex-col items-center justify-between gap-4 w-full h-full" onSubmit={handleSubmit}>
          <input
            className="w-full mb-4 bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            type="text"
            name="email"
            value={credentials.email}
            placeholder="Email"
            onChange={handleChange}
            disabled={isLoading}
          />
          <input
            className="w-full mb-4 bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-3xl text-white focus:outline-none focus:ring-1 focus:ring-green-500"
            type="password"
            name="password"
            value={credentials.password}
            placeholder="Password"
            onChange={handleChange}
            disabled={isLoading}
          />
          <button
            className="bg-green-600 hover:bg-green-700 w-full text-white font-bold py-2 sm:py-3 px-4 rounded-3xl transition duration-200 flex justify-center items-center"
            disabled={isLoading}
          >
            {isValidating ? <Loader /> : isLoading ? "Logging in..." : "Login"}
          </button>
          <Link
            className="text-sm sm:text-base text-gray-400 hover:text-white transition duration-200"
            to="/forgot-password"
          >
            Forgot Password?
          </Link>

          <p className="text-sm sm:text-base text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link className="text-green-500 hover:text-green-600 transition duration-200" to="/register">
              Register
            </Link>
          </p>
        </form>
      </motion.div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </motion.div>
  )
}

export default LoginPage

