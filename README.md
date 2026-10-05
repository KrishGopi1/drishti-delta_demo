# DRISHTI-Δ web demo

Semantic search and multi-temporal change analysis of Sentinel-2 imagery, running entirely in the browser.
Team NOVA · Smart India Hackathon 2026 · PS 26227.

## What it does

| Feature | How it works here |
|---|---|
| Globe home | MapLibre GL globe with Sentinel-2 cloudless 2025, slowly rotating |
| Text search | CLIP ViT-B/32 (8-bit ONNX) in a Web Worker ranks every archive tile by meaning |
| Query parser | Splits the question into concept, place (state / place name) and time chips |
| Semantic change search (SGR) | gain = similarity(after, query) − similarity(before, query) |
| Image to image search | Upload or drop any image; same CLIP space as text |
| Place search + fly-to | Catalogue match first, then OpenStreetMap Nominatim |
| Before / after slider | Two synced maps, drag the orange handle; years 2016 to 2025 |
| Time-lapse | Cross-fades the 10 annual mosaics |
| Change detection (PCM-lite) | Peer-normalised scores → conformal p-values → CUSUM onset → Fisher → BH-FDR → persistence ≥ 3 |
| Explain | Zero-shot CLIP labels for the before and after year |
| Discover | k-means on CLIP embeddings, clusters named by closest description |
| Review + export | Confirm / reject / follow-up with notes, audit log, GeoJSON export with provenance |
| How it works | Journey, architecture, PCM / HEK / SGR, Beta evidence, impact, stack, references |


## First load

The CLIP model (about 150 MB) downloads from huggingface.co on the first visit and is cached by the browser.
The archive index (57 tiles) is then embedded and cached in IndexedDB. Later visits are instant.
If the model cannot be downloaded, search falls back to keywords (clearly labelled) and everything else keeps working.

## URL options

* `?q=solar park in Rajasthan` runs a query on load
* `?mock=1` UI test mode with fake embeddings (no model download)
* `?direct=1` loads tiles straight from EOX (no proxy; pixel features may be blocked by CORS)

## Tests

```bash
npm test        # Node 18+, unit tests for the PCM statistics (no browser needed)
```

They check the conformal p-value, CUSUM onset, persistence count, chi-square survival used by Fisher's method, Benjamini-Hochberg FDR and the robust (median / MAD) peer normalisation.

## Accessibility

* Colour-blind-safe change colours (Okabe-Ito palette), always with a text label beside the colour
* Every result card is reachable with Tab and opens with Enter or Space; visible focus outline
* The before / after slider moves with the arrow keys
* Animations are switched off when the system asks for reduced motion
* Plain-language search, so no GIS or coding skills are needed

## Security and privacy

* The production design runs on-premise, air-gapped after data staging, so imagery and results never leave the user's network
* Every analyst decision is written to an audit log and travels with the export (already in this demo)
* Planned: role-based logins (viewer, analyst, reviewer); analyst account data handled under India's DPDP Act 2023; imagery of sensitive areas handled under the National Geospatial Policy 2022
* This demo stores nothing on a server: the review queue lives in the browser and the AI runs locally

## Sustainability

* Reuses free, open Copernicus data instead of new acquisitions
* Change statistics run on CPU in batches; each tile is embedded once, and HEK keeps one key per tile per year (about 9 MB instead of about 280 MB for a 50 × 50 km area over 3 years)
* Built to monitor forests, wetlands and water bodies

## Team NOVA

Roles: Neelakantha Reddy and Ananya Macha - data pipeline, Gopi Krish and Vamshika - PCM statistics, retrieval and AI, Johnson Oduri and Snehaja web demo and design. Domain guidance from our mentor (Dr. Ansith S, remote sensing and AI).

## scope

* Retrieval uses general CLIP in the browser; the production design uses RemoteCLIP on a server with Qdrant.
* Imagery is one cloud-free composite per year (EOX Sentinel-2 cloudless), which stands in for HEK's season-free key.
* PCM-lite uses RGB greenness (VARI) and brightness; the Beta pipeline uses NDVI / NDBI on every Sentinel-2 L2A date.
* The Jewar evidence card (80 tiles × 14 dates, 1 candidate, confidence 0.56) comes from the Beta pipeline run.

## Attribution and licences

Sentinel-2 cloudless by EOX IT Services GmbH (contains modified Copernicus Sentinel data), s2maps.eu.
2016 mosaic CC BY 4.0; 2017 onward CC BY-NC-SA 4.0 (non-commercial demonstration).
Labels and geocoding © OpenStreetMap contributors. MapLibre GL JS (BSD-3), transformers.js (Apache-2.0), ONNX Runtime Web (MIT).
