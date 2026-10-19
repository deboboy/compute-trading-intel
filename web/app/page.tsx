"use client";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch("/compute-trading.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setErr(true));
  }, []);

  if (err) return <main className="wrap"><p className="muted">Data failed to load. Check back shortly.</p></main>;
  if (!data) return <main className="wrap"><p className="muted">loading…</p></main>;

  return (
    <main className="wrap">
      <header>
        <h1>Compute Trading Intel</h1>
        <p className="muted">
          Weekly intelligence on the compute-trading market — GPU futures, price indexes, and spot
          marketplaces. Maintained by Last Myle Engineering. Updated {data.updated}.
        </p>
      </header>

      <section className="card">
        <h2>Executive summary</h2>
        <p className="pre">{data.executive_summary || "No summary yet — first cron run pending."}</p>
      </section>

      <section className="card">
        <h2>Price indexes</h2>
        {data.indexes.length === 0 ? (
          <p className="muted">No index data yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Index</th><th>Settlement / exchange partner</th><th>Note</th></tr>
            </thead>
            <tbody>
              {data.indexes.map((i) => (
                <tr key={i.name}>
                  <td>{i.name}</td>
                  <td>{i.partner_exchange ?? "—"}</td>
                  <td className="muted">{i.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <h2>Signals this week</h2>
        {data.signals.length === 0 ? (
          <p className="muted">No signals yet — first cron run pending.</p>
        ) : (
          <ul className="signals">
            {data.signals.map((s, n) => (
              <li key={n}>
                <span className="badge">{s.confidence}</span>{" "}
                <strong>{s.claim}</strong>{" "}
                <span className="muted small">
                  {s.source}
                  {hostOf(s.url) ? ` · ${hostOf(s.url)}` : ""} · {s.run_date}
                </span>
                {s.url && (
                  <>
                    {" "}
                    <a href={s.url} target="_blank" rel="noreferrer">source ↗</a>
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
                <ul className="small">
                  {d.links.map((l) => (
                    <li key={l}>
                      <a href={l} target="_blank" rel="noreferrer">{l}</a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))
        )}
      </section>

      <footer className="muted small">
        Last Myle Engineering · research, not investment advice · data regenerates weekly from an
        automated research pipeline.
      </footer>
    </main>
  );
}
