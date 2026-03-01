import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import data from "../../../data/test.json"; // make sure this is a valid JS/JSON import

export default function HumeComponent({ emotionData }) {
  const [selectedPerson, setSelectedPerson] = useState("A");

  const handleChange = (e) => {
    setSelectedPerson(e.target.value);
  };

  const emotions = emotionData[selectedPerson] || [];

  return (
    <div className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tonal Analysis</h2>
        <select
          value={selectedPerson}
          onChange={handleChange}
          className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg mt-4 md:mt-0"
        >
          {Object.keys(emotionData).map((personKey) => (
            <option key={personKey} value={personKey}>
              Person {personKey}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={emotions}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="emotion" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#a855f7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
