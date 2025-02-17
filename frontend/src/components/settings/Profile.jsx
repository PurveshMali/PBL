import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LoaderComponent from "../common/LoaderComponent";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);  // For managing loader state
  const [showModal, setShowModal] = useState(false);  // To manage the confirmation modal state
  const [isLoggingOut, setIsLoggingOut] = useState(false);  // To track if logout is in progress
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(data);
        console.log(data);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogoutConfirmation = () => {
    setShowModal(true);  // Show the confirmation modal
  };

  const handleLogout = async () => {
    setShowModal(false);  // Close the confirmation modal
    setIsLoggingOut(true);  // Start logging out process
    setLoading(true);  // Show the loader

    try {
      await axios.post("http://localhost:3000/api/auth/logout");
      localStorage.removeItem("token");
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 2000,  // Toast will show for 2 seconds
        hideProgressBar: false,
      });

      setTimeout(() => {
        navigate("/");  // Navigate to the home page after 2 seconds
      }, 2000);  // Wait for 2 seconds before redirecting

    } catch (error) {
      console.log("Error logging out:", error);
      toast.error("Error logging out!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
      });
      setLoading(false);
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-72 text-center">
            <p className="text-lg font-semibold mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loader Component for full-screen loader after logout */}
      {isLoggingOut && <LoaderComponent message="Logging out..." />}

      <SettingSection icon={User} title={"Profile"}>
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <img
            src="https://imgs.search.brave.com/ULAYhDRwYGxF8zO7TOVBH7OnpgV2IP7I-oUB_g1sJcw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8yMC83Ni9t/YW4tYXZhdGFyLXBy/b2ZpbGUtdmVjdG9y/LTIxMzcyMDc2Lmpw/Zw"
            alt="Profile"
            className="rounded-full w-20 h-20 object-cover mr-4"
          />

          <div>
            <h3 className="text-lg font-semibold text-gray-100">{user.firstName} {user.lastName}</h3>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto">
          Edit Profile
        </button>

        <button
          onClick={handleLogoutConfirmation}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 ml-2 rounded transition duration-200 w-full sm:w-auto"
        >
          Log Out
        </button>

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
      </SettingSection>
    </>
  );
};

export default Profile;
