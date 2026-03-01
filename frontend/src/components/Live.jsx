import { useState, useRef } from "react";
import { Mic, Circle } from "lucide-react";
import RecordRTC from "recordrtc";

export default function Live({ setShowUploadButton, onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const recorderRef = useRef(null);

  const handleClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
        });
        recorder.startRecording();
        recorderRef.current = recorder;
        setIsRecording(true);
        setShowUploadButton(false);
      } catch (err) {
        console.error("Mic permission error:", err);
      }
    } else {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsRecording(false);
        setShowUploadButton(true);

        // Download the recording
        const a = document.createElement("a");
        a.href = url;
        a.download = "mana-recording.webm";
        a.click();
        URL.revokeObjectURL(url);

        // ✅ Trigger result section
        if (onRecordingComplete) {
          onRecordingComplete();
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        {isRecording && (
          <span className="absolute inline-flex h-28 w-28 rounded-full bg-red-600 opacity-75 animate-ping"></span>
        )}

        <button
          onClick={handleClick}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg backdrop-blur-lg transition transform hover:scale-105 relative z-10 ${
            isRecording ? "bg-red-600/80" : "bg-white/10"
          }`}
        >
          {isRecording ? (
            <Circle className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>
      </div>
      <p className="mt-4 text-white text-sm opacity-80">
        {isRecording ? "Recording..." : "Tap to start recording"}
      </p>

    </div>
  );
}
