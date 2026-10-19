"use client";

/** Horizontal market-spine in the dc-pipeline-sim style: Spot → Indexes → Derivatives,
 *  with status dots per tracked venue/index/exchange. */

export type SpineNode = {
  id: string;
  label: string;
  sub: string | null;
  color: string;
  status: "listed" | "announced" | "pending" | "active" | "watch";
};

const STATUS_COLOR: Record<SpineNode["status"], string> = {
  listed: "#2ecc71",
  active: "#2ecc71",
  announced: "#ff8a4f",
  pending: "#ff8a4f",
  watch: "#8b93a7",
};

const STAGES: { label: string; x: number; color: string }[] = [
  { label: "Spot marketplaces (20+)", x: 90, color: "#4f8cff" },
  { label: "Price indexes (4)", x: 480, color: "#b78cff" },
  { label: "Derivatives exchanges", x: 870, color: "#ffd54f" },
];

export default function MarketSpine({
  nodes,
}: {
  nodes: { layer: "spot" | "index" | "derivs"; name: string; status: SpineNode["status"] }[];
}) {
  const buckets: Record<string, [number, number]> = {
    spot: [30, 300],
    index: [380, 580],
    derivs: [660, 930],
  };
  const byLayer = (l: string) => nodes.filter((n) => n.layer === l);

  return (
    <div className="card" style={{ padding: "1.25rem 1.5rem 1.25rem" }}>
      <h2>Market structure</h2>
      <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
        <svg viewBox="0 0 960 190" style={{ width: "100%", minWidth: 760, height: "auto" }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="none" stroke="#999" strokeWidth="1.2" />
            </marker>
          </defs>
          <line x1="120" y1="60" x2="820" y2="60" stroke="#999" strokeWidth="1.2" markerEnd="url(#arrow)" />
          <line x1="820" y1="60" x2="120" y2="60" stroke="#999" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.4" />

          {STAGES.map((st) => (
            <g key={st.label}>
              <circle cx={st.x} cy={60} r={14} fill={st.color} />
              <text x={st.x} y={95} textAnchor="middle" fontSize="12.5" fill="#ccc" fontWeight="600">
                {st.label}
              </text>
            </g>
          ))}

          {/* venue chips under each stage */}
          {Object.entries(buckets).map(([layer, [x0, x1]]) => {
            const items = byLayer(layer).slice(0, 7);
            return (
              <g key={layer}>
                {items.map((n, i) => (
                  <g key={n.name}>
                    <circle cx={x0 + 10} cy={125 + i * 17} r={4.5} fill={STATUS_COLOR[n.status]} />
                    <text x={x0 + 22} y={128.5 + i * 17} fontSize="10.5" fill="#aaa">
                      {n.name}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}

          <text x={480} y={185} textAnchor="middle" fontSize="9.5" fill="#777">
            green = live/launched · orange = announced/pending · gray = watch · flow: spot liquidity → benchmarks → listed price risk
          </text>
        </svg>
      </div>
    </div>
  );
}
