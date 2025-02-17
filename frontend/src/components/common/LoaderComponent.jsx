// LoaderComponent.js
import { Loader } from "lucide-react";

const LoaderComponent = ({ message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
      <div className="text-center text-white">
        <Loader className="animate-spin mb-4" size={40} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoaderComponent;
