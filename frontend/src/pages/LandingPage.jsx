import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import TrueFocus from "../animations/TrueFocus";
import SplitText from "../animations/SplitText";
import Magnet from "../animations/Magnet";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };
  return (
    <motion.div
      className="min-h-screen bg-transperant text-gray-100 flex flex-col z-10 w-full relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="/frontend/src/components/common/footage1.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken video */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Header */}
      <header className="p-4 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-green-500" />
          <span className="text-xl font-bold">PowerChoice</span>
        </div>
        <nav>
          <button className="px-4 py-2 text-sm font-medium text-green-300 hover:text-green-100 transition-colors">
            Login
          </button>
          <button className="ml-4 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Register
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center relative z-10">
        <TrueFocus
          sentence="Welcome to PowerChoice"
          manualMode={true}
          blurAmount={5}
          borderColor="green"
          animationDuration={0.5}
          pauseBetweenAnimations={1}
        />
        <SplitText
          text="We believe in the power of awareness, innovation, and collective action to create a greener planet."
          className="text-xl font-semibold text-center mb-5 mt-5 w-[70%]"
          delay={50}
          animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
          animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        />

<Magnet padding={500} disabled={false} magnetStrength={50}>
        <button className="px-6 py-3 text-lg mt-10 font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
        
          <Link to="/login">Get Started</Link>
        
        </button>
        </Magnet>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500 relative z-10">
        © 2025 PowerChoice. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default LandingPage;
