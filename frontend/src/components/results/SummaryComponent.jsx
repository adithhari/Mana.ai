import { useEffect, useState } from "react";
//import data from "../data/summary.json"; // adjust the path

export default function SummaryComponent({summaryData}) {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Case 1: summary is directly available
    if (summaryData.summary) {
      setSummary(summaryData.summary);
      return;
    }

    // Case 2: raw_output contains stringified summary
    const raw = summaryData.raw_output;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.summary) {
          setSummary(parsed.summary);
          return;
        }
      } catch (err) {
        // Try regex fallback
        const match = raw.match(/"summary":\s*"([^"]+)"/);
        if (match && match[1]) {
          setSummary(match[1]);
          return;
        }
      }
    }

    // If all fails
    setError(summaryData.error || "No summary found.");
  }, []);

  return (
    <div className="glass-card w-full h-full">
      <h2 className="text-2xl font-bold mb-4">AI Summary</h2>

      {summary ? (
        <p className="text-white/90 leading-relaxed text-sm whitespace-pre-wrap">
          {summary}
        </p>
      ) : (
        <div className="text-red-400 text-sm">
          <p>⚠️ Error parsing summary:</p>
          <p className="mt-2 italic">{error}</p>
        </div>
      )}
    </div>
  );
}
