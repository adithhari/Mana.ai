import { X } from "lucide-react";
import { useRef } from "react";

export default function UploadBox({ onClose, onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onFileSelect(); // ✅ triggers scroll to result section
    }
  };

  return (
    <div className="relative mt-8 w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-8 text-white shadow-2xl backdrop-blur-md transition-all duration-300 flex flex-col items-center text-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/50 hover:text-white transition"
        aria-label="Close upload"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-2xl font-bold mb-4 tracking-tight">Upload Audio/Video</h3>
      <p className="text-sm text-white/60 mb-6 max-w-sm">
        Select an audio or video file to transcribe using MANA's AI.
      </p>

      <input
        type="file"
        accept="audio/*,video/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={handleFileClick}
        className="bg-primary hover:bg-purple-700 px-6 py-3 rounded-xl text-white font-semibold text-sm transition"
      >
        Choose File
      </button>
    </div>
  );
}
