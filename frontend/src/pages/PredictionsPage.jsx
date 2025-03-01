import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const FuelCostForm = () => {
  const [formData, setFormData] = useState({
    year: "",
    month: "",
    fuel_type: "",
    fuel_cost: "",
    region: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const fuelTypes = ["oil", "natural gas", "biomass", "coal", "gas", "renewable"];
  const regions = ["East", "West", "North", "South"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen bg-transparent text-gray-100 flex flex-col z-10 w-full relative items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        className="bg-gray-800 w-[40%] bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl sm:text-4xl font-semibold text-gray-100 mt-2 mb-5 font-mono">
          Get Predictions
        </h2>
        <form className="flex flex-col gap-4 w-full h-full" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="w-full sm:w-1/2">
              <select
                name="fuel_type"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.fuel_type}
              >
                <option value="" disabled>Select Fuel Type</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type} className="bg-gray-800">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.fuel_type && <p className="text-red-500 text-sm">{errors.fuel_type}</p>}
            </div>
            <div className="w-full sm:w-1/2">
              <input
                name="fuel_cost"
                type="number"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter Fuel Cost"
                onChange={handleChange}
                value={formData.fuel_cost}
              />
              {errors.fuel_cost && <p className="text-red-500 text-sm">{errors.fuel_cost}</p>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="w-full sm:w-1/2">
              <select
                name="year"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.year}
              >
                <option value="" disabled>Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year} className="bg-gray-800">{year}</option>
                ))}
              </select>
              {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
            </div>
            <div className="w-full sm:w-1/2">
              <select
                name="month"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.month}
              >
                <option value="" disabled>Select Month</option>
                {months.map((month) => (
                  <option key={month} value={month} className="bg-gray-800">{month}</option>
                ))}
              </select>
              {errors.month && <p className="text-red-500 text-sm">{errors.month}</p>}
            </div>
          </div>
          <div className="w-full">
            <select
              name="region"
              className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.region}
            >
              <option value="" disabled>Select Region</option>
              {regions.map((region) => (
                <option key={region} value={region} className="bg-gray-800">{region}</option>
              ))}
            </select>
            {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 w-full text-white font-bold py-2 sm:py-3 px-4 rounded-xl transition duration-200 items-center justify-center flex mt-4"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" size={24} color="white" /> : "Submit"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default FuelCostForm;
