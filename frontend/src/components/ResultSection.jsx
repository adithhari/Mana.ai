import HumeComponent from "./results/HumeComponent";
import SummaryComponent from "./results/SummaryComponent";
import CalenderComponent from "./results/CalenderComponent";
import MindmapComponent from "./results/MindmapComponent";

export default function ResultSection({resultsData}) {

  return (
    <div className="md:min-h-screen w-full bg-black text-white px-6 py-12 space-y-10">
      {/* Hume - Top vertical */}
      <HumeComponent emotionData={resultsData.resultsData.emotionSummary} />

      {/* Summary + Calendar - Horizontal layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryComponent summaryData={resultsData.resultsData.audioSummary}/>
        <CalenderComponent personTasks={resultsData.resultsData.taskMapping} />
      </div>

      {/* Mindmap - Bottom full width */}
      <MindmapComponent mindMapData={resultsData.resultsData.mindMap}/>

      
      <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="mt-10 px-6 py-2 text-sm font-semibold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition"
          >
            Upload Another File
          </button>
        </div>


    </div>
  );
}
