"use client";
import { useEffect, useState } from "react";

import MarketSpine from "./MarketSpine";

type Signal = {
  claim: string;
  source: string;
  url: string | null;
  confidence: string;
  run_date: string;
};

type IndexSnapshot = {
  name: string;
  partner_exchange: string | null;
  note: string | null;
};

type Data = {
  updated: string;
  executive_summary: string;
  indexes: IndexSnapshot[];
  signals: Signal[];
  digests: { title: string; date: string; links: string[]; body: string }[];
};

function hostOf(url: string | null) {
  if (!url) return null;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Minimal, safe inline-markdown renderer: **bold** and *em* → styled spans. No HTML. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2)
          return <em key={i}>{p.slice(1, -1)}</em>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

export default function Home() {
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch("/compute-trading.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setErr(true));
  }, []);

  if (err)
    return (
      <main>
        <p className="muted">Data failed to load. Check back shortly.</p>
      </main>
    );
  if (!data)
    return (
      <main>
        <p className="muted">loading…</p>
      </main>
    );

  return (
    <main>
      <header>
        <h1>
          Compute Trading <span className="tld">Intel</span>
        </h1>
        <p className="subtitle">
          Weekly intelligence on the compute-trading market — GPU futures, price indexes, and spot
          marketplaces. A Last Myle Engineering research product.
          {data.updated ? ` Last updated ${data.updated}.` : ""}
        </p>
      </header>

      <MarketSpine
        nodes={[
          { layer: "derivs", name: "CME × Silicon Data", status: "pending" },
          { layer: "derivs", name: "Architect (AX)", status: "announced" },
          { layer: "derivs", name: "Nodal × Compute Desk", status: "announced" },
          { layer: "derivs", name: "ICE", status: "watch" },
          { layer: "index", name: "Silicon Data", status: "active" },
          { layer: "index", name: "Ornn (OCPI)", status: "active" },
          { layer: "index", name: "Compute Desk", status: "active" },
          { layer: "index", name: "SemiAnalysis", status: "active" },
          { layer: "spot", name: "Vast.ai", status: "active" },
          { layer: "spot", name: "VoltagePark", status: "active" },
          { layer: "spot", name: "SF Compute", status: "active" },
          { layer: "spot", name: "Hyperbolic", status: "active" },
          { layer: "spot", name: "RunPod", status: "active" },
          { layer: "spot", name: "Akash Network", status: "active" },
          { layer: "spot", name: "+14 more venues", status: "watch" },
        ]}
      />

      <section className="card">
        <h2>Executive summary</h2>
        <p className="pre">
          {data.executive_summary || "No summary yet — first cron run pending."}
        </p>
      </section>

      <section className="card">
        <h2>Price indexes</h2>
        {data.indexes.length === 0 ? (
          <p className="muted">No index data yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Settlement / exchange partner</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {data.indexes.map((i) => (
                <tr key={i.name}>
                  <td>{i.name}</td>
                  <td>{i.partner_exchange ?? "—"}</td>
                  <td className="muted small">{i.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <h2>Signals</h2>
        {data.signals.length === 0 ? (
          <p className="muted">No signals yet — first cron run pending.</p>
        ) : (
          <ul className="signals">
            {data.signals.map((s, n) => (
              <li key={n}>
                <span className={`badge ${s.confidence || "low"}`}>{s.confidence}</span>{" "}
                <Inline text={s.claim} />{" "}
                <span className="muted small">
                  — {s.source}
                  {hostOf(s.url) ? ` · ${hostOf(s.url)}` : ""} · {s.run_date}
                </span>
                {s.url && (
                  <>
                    {" "}
                    <a href={s.url} target="_blank" rel="noreferrer">
                      source ↗
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Weekly digests</h2>
        {data.digests.length === 0 ? (
          <p className="muted">No digests yet — first cron run pending.</p>
        ) : (
          data.digests.map((d) => (
            <article key={d.title + d.date} className="digest">
              <h3>
                {d.title} <span className="muted small">{d.date}</span>
              </h3>
              <p className="pre">{d.body}</p>
              {d.links.length > 0 && (
                <ul className="small muted" style={{ marginTop: "0.5rem", paddingLeft: "1.1rem" }}>
                  {d.links.slice(0, 8).map((l) => (
                    <li key={l}>
                      <a href={l} target="_blank" rel="noreferrer">
                        {hostOf(l) ?? l}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))
        )}
      </section>

      <footer className="muted small">
        <a href="https://www.lastmyle.co/research" target="_blank" rel="noreferrer">
          Last Myle Engineering
        </a>{" "}
        · research, not investment advice · regenerates weekly from an automated research pipeline.
      </footer>
    </main>
  );
}
