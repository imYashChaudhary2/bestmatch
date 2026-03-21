<div align="center">

# 🌟 BestMatch

### AI-Powered Device Comparison — Phones · Tablets · Laptops

[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-bestmch.surge.sh-4f6ef7?style=for-the-badge)](https://bestmch.surge.sh)
[![Claude](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet-cc785c?style=for-the-badge)](https://anthropic.com)
[![Version](https://img.shields.io/badge/Version-2.5-22c55e?style=for-the-badge)]()
[![Devices](https://img.shields.io/badge/Local%20DB-120%2B%20Devices-a855f7?style=for-the-badge)]()

Compare any smartphone, tablet, or laptop — specs load instantly from a local database or are fetched live by AI. No backend. No manual updates.

</div>

---

## 🚀 What is BestMatch?

Type any device name and BestMatch shows full specs side-by-side in under 2 seconds — sourced from a local database of 120+ devices, or fetched live from the Anthropic API for anything not in the list.

```
Input  →  "iPhone 17 Pro vs Samsung S25 Ultra vs Pixel 9 Pro"
Output →  3 cards loaded side-by-side with images, specs, and AI verdict
```

---

## ✨ Features

### 🤖 AI Spec Engine
- Search **any device ever made** — not limited to a preset list
- Powered by `claude-sonnet-4-6` via Anthropic API
- Returns structured JSON: display, processor, camera, battery, RAM, price
- API is called **only as a fallback** — listed devices load instantly

### 📦 Local Database — 120+ Devices
- iPhone 13 → 17 series, Galaxy S23 → S25, Pixel 7 → 9, OnePlus 12 → 15
- Xiaomi, Redmi, Poco, Vivo, Realme, Nothing, Motorola
- Full tablet coverage: iPad, Galaxy Tab S9/S10, Xiaomi Pad, OnePlus Pad
- Full laptop coverage: MacBook, Dell XPS, Asus ROG, Lenovo Legion, HP, Razer, MSI, LG Gram
- Strict word-by-word matching — no false positives

### 🖼️ Three-Tier Image System

| Priority | Source | Detail |
|:--------:|--------|--------|
| 1st | Local `/images/` folder | Same-origin, zero CORS, instant |
| 2nd | Verified CDN URLs | GSMArena, Samsung, Apple, Dell, Asus, Lenovo, HP, Microsoft |
| 3rd | Wikimedia Commons | Live search fallback for any unlisted device |

Multi-image **slideshow** with auto-play every 3s and dot navigation.

### ⚡ Unified Smart Search
- Type `iPhone 16 vs S25 vs Pixel 9` — parses and loads all 3 at once
- Understands separators: `vs`, `versus`, `and`, `or`, `,`, `&`, `/`
- 3 named comparison slots with visual fill indicators and one-click clear
- Quick-fill hint chips for popular devices below the search bar

### 🧠 AI Analysis Engine

Enter a priority like *"best camera"*, *"best battery"*, or *"best for gaming"* — AI scores every loaded device and picks a winner.

Criteria are auto-detected from your query:

| Your Query | Criteria Scored |
|------------|----------------|
| camera / photo / zoom | Camera Quality · Low Light · Zoom · Video |
| battery / charging / endurance | Battery Size · Charging Speed · Efficiency |
| gaming / fps / performance | Processor · GPU · RAM · Thermal Management |
| value / budget / price | Price · Features per ₹ · Build Quality |
| display / screen / refresh | Display Quality · Brightness · Refresh Rate |

Returns a score out of 10, animated per-criteria bar charts, winner badge, and a 2–3 sentence AI verdict.

### 🔗 Shareable URLs
- Share button encodes the current comparison into a URL
- Anyone opening the link sees the exact same comparison pre-loaded
- Supports `?d0=`, `?d1=`, `?d2=` query params for direct deep links

```
https://bestmch.surge.sh/?cat=mobile&d0=iPhone+16+Pro&d1=Samsung+S25+Ultra&d2=Pixel+9
```

### 💾 Session Persistence
- URL params encode your comparison state — bookmarkable and shareable
- Page reload with params auto-loads all devices back instantly

### 📄 PDF Export
- PDF button triggers the browser print dialog — save any comparison as a PDF

---

## ⚙️ How It Works

```
User types device name or multi-device query
                    │
                    ▼
      Smart parser splits on "vs / and / or / ,"
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
    LOCAL_DB hit?        LOCAL_DB miss?
    Render instantly     Anthropic API call
                         → parse JSON → render
                    │
                    ▼
          Image lookup pipeline
       /images/ → CDN → Wikimedia
                    │
                    ▼
       Slideshow built (if 2+ images)
                    │
                    ▼
       Shareable URL auto-generated
                    │
                    ▼
       AI Analysis → scores + verdict
```

---

## 📁 File Structure

```
bestmatch/
├── index.html          ← Mobiles comparison page
├── tablet.html         ← Tablets comparison page
├── laptop.html         ← Laptops comparison page
├── shared.css          ← All styles unified (replaced 3 separate CSS files)
├── bestmatch.js        ← Core logic: local DB, image system, AI calls, search
├── image_map.js        ← Verified CDN image URL map
├── config.js           ← API key (gitignored — create locally)
├── favicon.svg         ← Branded SVG favicon
└── site.webmanifest    ← PWA manifest
```

---

## 📋 Changelog

| Version | Changes |
|---------|---------|
| v2.5 | Console boot log with device count; internal cleanup |
| v2.4 | GSMArena CDN URLs verified; Wikimedia fallback stabilized |
| v2.3 | Three-tier image system; multi-image slideshow with auto-play |
| v2.2 | Session persistence via URL params; PDF export |
| v2.1 | Shareable URLs; AI verdict panel with per-criteria bar charts |
| v2.0 | Full rewrite — unified search, glassmorphism UI, shared.css, Anthropic API |
| v1.0 | Static database, 3 separate CSS/JS files, basic card UI |

---

## 📬 Contact
<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-imYashChaudhary2-181717?style=flat-square&logo=github)](https://github.com/imYashChaudhary2)
[![X](https://img.shields.io/badge/X-@imYChaudhary22-000000?style=flat-square&logo=x)](https://x.com/imYChaudhary22)
[![Email](https://img.shields.io/badge/Email-imYash.Chaudhary2%40gmail.com-ea4335?style=flat-square&logo=gmail)](mailto:imYash.Chaudhary2@gmail.com)

</div>

---

<div align="center">
© 2025 BestMatch · Specs powered by AI · Compare smarter
</div>