import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import rawData from "../../../data/mindmap.json";

export default function MindmapComponent({ mindMapData }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const transformedData = {
      nodes: mindMapData.nodes.map((node) => ({
        id: node.id,
        name: node.label
      })),
      links: mindMapData.edges.map((edge) => ({
        source: edge.from,
        target: edge.to
      }))
    };
    setGraphData(transformedData);
  }, []);

  return (
    <div className="glass-card w-full max-w-6xl mx-auto mb-10">
      <h2 className="text-2xl font-bold mb-4">Mind Map</h2>

      <div className="w-full h-[500px] overflow-hidden rounded-xl">
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeColor={() => "#a855f7"}
          linkColor={() => "#6366f1"}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Inter`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, node.x, node.y);
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
            ctx.fill();
          }}
        />
      </div>
    </div>
  );
}
