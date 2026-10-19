# Compute Trading — Market Landscape Brief

**Date:** 2026-10-19 · **Author:** Last Myle Engineering (Hermes research run) · **Trigger:** Architect "Compute Trading" market-map infographic
**Status:** Research dir of record; feeds the compute-trading-intel dashboard + cron.

## 1. What this market is

AI compute (GPU-hour rental prices on specific accelerators) is being financialized into a tradable asset class, on three converging layers:

1. **Regulated derivatives** — listed futures & options on GPU rental prices.
2. **Price benchmarks (indexes)** — daily indices of GPU rental rates that contracts settle against.
3. **Spot/forward capacity platforms** — ~20+ marketplaces where physical compute trades OTC.

The infographic's map (Architect, Oct 2026) is directionally accurate but self-serving: Architect's own AI Exchange is highlighted in two of four categories. Independent verification below.

## 2. Derivatives layer — verified state

| Exchange | Partner index | Product | Status (as of 2026-10-19) |
|---|---|---|---|
| **CME Group** | Silicon Data | H100 + B200 monthly-rental futures, cash-settled, NYMEX, curve to 36 months | Announced 2026-08-11; listing planned **2026-10-05 pending CFTC approval** |
| **Architect (AI Exchange / AX)** | Ornn | GPU-hour futures & options (H100/H200/B200/B300), monthly→yearly; perpetual futures on metals/energy/power | Already trades compute futures **outside the US**; US exchange (post-DCM acquisition) pending CFTC review; site shows live spot tickers (H100 $2.35/hr, B200 $4.95/hr) |
| **ICE** | — | Compute futures in development | No launch date |
| **Nodal Exchange** | Compute Desk | GPU compute futures settling against Compute Desk blended daily indexes | Announced 2026-09-03; pending regulatory compliance |

- CFTC sent a request-for-comment on compute futures to OMB (week of 2026-08-17); typical 30–60 day comment period. **Approval timing is the single biggest gating factor for the whole layer.**
- Silicon Data raised $30M Series A tied to the CME contract.

## 3. Index layer

Four live GPU price indexes (three already on Bloomberg Terminal): **Silicon Data** (CME's settlement source), **Ornn** (OCPI; Architct/AX partner; raised $5.7M seed), **Compute Desk** (Nodal partner; exclusive private-transaction coverage), and **SemiAnalysis** (monthly H100 1-yr contract survey index, 100+ participants). Divergence is material — indices have differed by ~$1/hr on the same accelerator in the same window, so **which index you settle against changes the hedge result**. Index competition is the real battleground; the "EFP" (exchange-for-physical) card in the map is Architect+Compute Desk marketing a futures→spot conversion network that has no verified independent footprint yet.

## 4. Spot layer

20+ OTC marketplaces confirmed active in 2026: hyperscaler-adjacent (Nvidia DGX Cloud Lepton, DigitalOcean), neoclouds (VoltagePark, CoreWeave-class), marketplaces (Vast.ai, Compute Exchange), decentralized (Akash, Clore.ai, Spheron, Aethir, SaladCloud, Render-class), and newer pure-play venues (SF Compute, Hyperbolic, RunPod, Prime Intellect, Andromeda, Shadeform, HydraHost, Ornn, Cudo Compute, Compute Desk). Live pricing spans ~$0.29/hr budget spot to $8+/hr hyperscaler — a ~25× spread that is exactly why index providers and derivatives exist. Vast.ai publishes market-set pricing across 40+ DCs; aggregator trackers (aicomputetracker.com) maintain evidence-aware price histories.

## 5. Market size & drivers

- Architect cites ~$0→trillion-scale global AI compute spend converging on a ~$1T+/yr AI infrastructure capex estimate by 2030; US derivatives market is the world's largest (~$0T displayed placeholder on site — treat marketing numbers skeptically).
- Demand-side hedgers: frontier labs, hyperscalers, enterprise AI (buy-side); neoclouds, GPU-as-a-service, colos (sell-side); private credit underwriting datacenter debt (the real institutional wedge — lenders need a mark for GPU collateral).
- Analogy: this is the 1980s oil-futures moment — spot markets existed, then indexes, then CME listing price risk.

## 6. Assessment (invest lens, B2B/supply-chain/bootstrap)

- **Conviction:** compute-as-asset-class is real, not vaporware — CME + Silicon Data launch timeline and Nodal/Compute Desk entry are primary-source verified. Liquidity, not regulation, is now the open question.
- **Watch, don't commit:** first-month open interest on whichever product launches first is the validation metric (one analyst estimate: ~500 contracts/day = early validation).
- **Narrowest wedges for a bootstrap shop:** (a) price-data aggregation/verification across the 20+ spot venues feeding the index debate; (b) risk tooling for private-credit GPU-collateral marks; (c) monitoring/intel products (this report). Avoid: becoming another marketplace, index administration (regulatory burden), or brokerage.
- **Key risks:** index divergence undermines settlement trust; CFTC delay; GPU price deflation (B300 at $7.40/hr vs H100 $2.35/hr suggests curve is already steeply backwardated) making long-dated hedges expensive; concentration in a single index provider per exchange.

## 7. Sources

- CME/Silicon Data announcement (2026-08-11) — cmegroup.com media room; Axios (2026-08-12)
- CFTC RFIC via OMB — Bloomberg (2026-08-17), The Latent summary
- Architect/Ornn press release — architect.co/resources/press/architect-ornn-compute-futures/ (2026)
- Nodal/Compute Desk — Business Wire (2026-09-03); Bloomberg (2026-09-03)
- Silicon Data $30M Series A — techbeat.co; Ornn $5.7M seed — LinkedIn/pulse2news
- Index divergence — KuCoin news; LinkedIn analyses (2026)
- Spot pricing — vast.ai/pricing; aicomputetracker.com; local-ai-zone top-20 (2026)
- Infographic — Architect "Compute Trading" (user-provided image)

## 8. Monitoring plan (cron)

Track: CFTC approval status + comment period, CME launch/trading volumes, Nodal + ICE + Architect US launches, index methodology changes and divergence (Silicon Data/Ornn/Compute Desk/SemiAnalysis), spot-price moves on major venues, new marketplace entrants/consolidation, private-credit GPU-collateral deals. Weekly digest → dashboard.
