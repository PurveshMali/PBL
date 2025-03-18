import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import PredictionsResult from "../components/predictions/PredictionsResult";
import axios from "axios";
import AIPoweredInsights from "../components/predictions/AIPoweredInsights";
import Header from "../components/common/Header";

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
  const [result, setResult] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const fuelTypes = ["Coal", "Oil", "Lignite", "Natural Gas"];
  const regions = ["East", "West", "North", "South"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
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
    setResult(null); // Reset previous result

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/predict",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setResult(response.data.predicted_so2_emissions);
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (error) {
      console.log("Error fetching prediction:", error);
      alert("Failed to fetch prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="flex-1 overflow-auto relative z-10">
      <Header title="Prediction" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 flex justify-center items-center flex-col">
        <motion.div
          className="bg-gray-800 w-[80%] bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center justify-center flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h2 className="text-xl sm:text-4xl font-semibold text-gray-100 mt-2 mb-5 font-serif">
            Get Predictions
          </h2>
          <form
            className="flex flex-col gap-4 w-full h-full"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col sm:flex-row w-full gap-4">
              <div className="w-full sm:w-1/2">
                <select
                  name="fuel_type"
                  className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleChange}
                  value={formData.fuel_type}
                >
                  <option value="" disabled>
                    Select Fuel Type
                  </option>
                  {fuelTypes.map((type) => (
                    <option key={type} value={type} className="bg-gray-800">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.fuel_type && (
                  <p className="text-red-500 text-sm">{errors.fuel_type}</p>
                )}
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
                {errors.fuel_cost && (
                  <p className="text-red-500 text-sm">{errors.fuel_cost}</p>
                )}
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
                  <option value="" disabled>
                    Select Year
                  </option>
                  {years.map((year) => (
                    <option key={year} value={year} className="bg-gray-800">
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="text-red-500 text-sm">{errors.year}</p>
                )}
              </div>
              <div className="w-full sm:w-1/2">
                <select
                  name="month"
                  className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleChange}
                  value={formData.month}
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  {months.map((month) => (
                    <option key={month} value={month} className="bg-gray-800">
                      {month}
                    </option>
                  ))}
                </select>
                {errors.month && (
                  <p className="text-red-500 text-sm">{errors.month}</p>
                )}
              </div>
            </div>
            <div className="w-full">
              <select
                name="region"
                className="w-full bg-transparent border border-gray-500 py-2 sm:py-3 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.region}
              >
                <option value="" disabled>
                  Select Region
                </option>
                {regions.map((region) => (
                  <option key={region} value={region} className="bg-gray-800">
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && (
                <p className="text-red-500 text-sm">{errors.region}</p>
              )}
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 w-full text-white font-bold py-2 sm:py-3 px-4 rounded-xl transition duration-200 items-center justify-center flex mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin" size={24} color="white" />
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </motion.div>

        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-8">
          {(result !== null && <PredictionsResult result={result} />) || (
            <div className=" text-gray-500 text-base font-medium">
              Prediction will be shown here{" "}
              <span className="text-grey-200 font-thin">
                (Please submit the above form with appropriate values)
              </span>
            </div>
          )}
        </motion.div>

        <div className="mt-8 w-[80%]">
          <AIPoweredInsights />
        </div>
      </main>
    </motion.div>
  );
};

export default FuelCostForm;
