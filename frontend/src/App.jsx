import { useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Live from "./components/Live";
import ResultSection from "./components/ResultSection";

export default function App() {
  const [showLive, setShowLive] = useState(true);
  const [responseData, setResponseData] = useState({});
  const [showResultSection, setShowResultSection] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const resultSectionRef = useRef(null);

  const handleFileUploaded = (data) => {
    setResponseData(data);
    console.log("✅ Upload successful:", data);
    setShowResultSection(true);
    setShowLive(false);
    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleMicRecordingComplete = () => {
    setShowResultSection(true);
    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  
  return (
    <div>
      <Navbar />
      <Hero
        onFileUploaded={handleFileUploaded}
        showUploadButton={showUploadButton}
      />

      {showLive && (
        <div className="min-h-[200px] flex items-center justify-center">
          <Live
            setShowUploadButton={setShowUploadButton}
            onRecordingComplete={handleMicRecordingComplete}
          />
        </div>
      )}


      {showResultSection && (
        <div
          ref={resultSectionRef}
          className="animate-fadeIn transition-all duration-500 ease-out"
        >
          <ResultSection resultsData={responseData}/>
        </div>
    

      )}


    </div>
  );
}
