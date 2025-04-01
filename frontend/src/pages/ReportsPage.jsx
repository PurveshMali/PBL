import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet, Filter, Eye, Loader } from "lucide-react";
import axios from "axios";
import Header from "../components/common/Header";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(null);

  // Mock data for reports
  const mockReports = [
    {
      id: 1,
      title: "Annual Emissions Report",
      description: "Comprehensive analysis of annual SO2 emissions across all regions and fuel types.",
      type: "emissions",
      date: "2025-03-15",
      formats: ["pdf", "csv"]
    },
    {
      id: 2,
      title: "Regional Fuel Cost Analysis",
      description: "Breakdown of fuel costs by region with projected cost trends for the next fiscal year.",
      type: "cost",
      date: "2025-03-01",
      formats: ["pdf"]
    },
    {
      id: 3,
      title: "Comparative Emissions by Fuel Type",
      description: "Cross-comparison of emissions data between different fuel types over the last 5 years.",
      type: "emissions",
      date: "2025-02-20",
      formats: ["pdf", "csv"]
    },
    {
      id: 4,
      title: "Monthly Cost Fluctuation",
      description: "Detailed analysis of monthly fuel cost fluctuations with seasonal pattern identification.",
      type: "cost",
      date: "2025-02-10",
      formats: ["csv"]
    },
    {
      id: 5,
      title: "Predictive Emissions Model Results",
      description: "Results from the advanced predictive emissions model with forecasts for the next 3 years.",
      type: "forecast",
      date: "2025-01-25",
      formats: ["pdf", "csv"]
    },
    {
      id: 6,
      title: "Regulatory Compliance Report",
      description: "Analysis of current emissions levels against regulatory standards across all regions.",
      type: "compliance",
      date: "2025-01-15",
      formats: ["pdf"]
    }
  ];

  useEffect(() => {
    // Simulating API fetch with setTimeout
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would fetch from your API
        // const response = await axios.get("http://127.0.0.1:8080/reports");
        // setReports(response.data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          setReports(mockReports);
          setIsLoading(false);
        }, 1200);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = async (reportId, format) => {
    setDownloadLoading(`${reportId}-${format}`);
    try {
      // In a real application, you would make an API call to download the file
      // const response = await axios.get(`http://127.0.0.1:8080/reports/${reportId}/download?format=${format}`, {
      //   responseType: 'blob'
      // });

      // Mock download delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock download functionality
      const fileName = `report-${reportId}.${format}`;
      
      // In a real implementation, you would create a blob from the response and download it
      // const blob = new Blob([response.data]);
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = fileName;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);

      console.log(`Downloading ${fileName}`);
      
      // Show success message
      alert(`Downloaded ${fileName} successfully!`);
    } catch (error) {
      console.error(`Error downloading report ${reportId} in ${format} format:`, error);
      alert(`Failed to download report. Please try again later.`);
    } finally {
      setDownloadLoading(null);
    }
  };

  const handleView = (reportId) => {
    // In a real app, this would open a detailed view or preview
    alert(`Viewing report ${reportId}`);
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === "all" || report.type === filter;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const reportTypes = ["all", "emissions", "cost", "forecast", "compliance"];

  return (
    <motion.div className="flex-1 overflow-auto relative z-10">
      <Header title="Reports" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-400 mt-2">
            View and download comprehensive reports on emissions, costs, and forecasts
          </p>

          {/* Search and filter controls */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/3">
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 py-2 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/3 flex items-center">
              <Filter className="mr-2 text-gray-400" size={18} />
              <select
                className="w-full bg-gray-800 bg-opacity-50 border border-gray-700 py-2 px-4 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {reportTypes.map((type) => (
                  <option key={type} value={type} className="bg-gray-800">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-medium text-white">{report.title}</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300">
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4 flex-grow">{report.description}</p>
                <div className="text-gray-500 text-xs mb-4">
                  Generated on: {new Date(report.date).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="flex items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                    onClick={() => handleView(report.id)}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  {report.formats.includes("pdf") && (
                    <button
                      className="flex items-center justify-center gap-1 bg-red-900 hover:bg-red-800 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      onClick={() => handleDownload(report.id, "pdf")}
                      disabled={downloadLoading === `${report.id}-pdf`}
                    >
                      {downloadLoading === `${report.id}-pdf` ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <FileText size={16} />
                      )}
                      PDF
                    </button>
                  )}
                  {report.formats.includes("csv") && (
                    <button
                      className="flex items-center justify-center gap-1 bg-green-900 hover:bg-green-800 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      onClick={() => handleDownload(report.id, "csv")}
                      disabled={downloadLoading === `${report.id}-csv`}
                    >
                      {downloadLoading === `${report.id}-csv` ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <FileSpreadsheet size={16} />
                      )}
                      CSV
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredReports.length === 0 && (
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400">No reports match your search criteria.</p>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
};

export default ReportsPage;