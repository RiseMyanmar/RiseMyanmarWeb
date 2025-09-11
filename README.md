# 🌍 Rise Myanmar Web Platform  
_Open-source platform to coordinate earthquake relief in Myanmar—real-time needs tracking, interactive maps, news, and trusted donation campaigns (English + Burmese)._

[![Visit Live Site](https://img.shields.io/badge/Live%20Site-Open%20Platform-brightgreen?style=for-the-badge)](https://risemyanmarweb.onrender.com/)
![Status](https://img.shields.io/badge/Status-Active-blue?style=flat-square)
![Tech](https://img.shields.io/badge/Front%20End-React%2019-%2361DAFB?style=flat-square)
![Map](https://img.shields.io/badge/Maps-Mapbox-informational?style=flat-square)
![Auth](https://img.shields.io/badge/Auth-Auth0-orange?style=flat-square)

> ⏳ First page load can feel slow (free Render tier cold start). Please give it a few seconds—after the initial wake-up it’s much faster. Your patience keeps the platform accessible.

---

## 🛑 Why This Exists: The March 28, 2025 Earthquake  
On **March 28, 2025**, a **magnitude 7.7 earthquake** struck Myanmar near **Mandalay**, along the highly active **Sagaing Fault**.  
- The rupture extended across an exceptionally long segment and exhibited **supershear characteristics**, amplifying destructive ground motion.  
- It was felt across much of **Southeast Asia**.  
- Reported fatalities exceeded **3,800 lives lost**, with thousands more injured or displaced.  

We built (and are evolving) this platform to:  
1. Aggregate the most up-to-date, trusted situational intelligence during and after the crisis  
2. Provide bilingual (English / Burmese) accessibility for local communities and diaspora support  
3. Surface verified donation and logistics channels  
4. Map critical infrastructure, impacted zones, shelters, and evolving needs  

> Figures are based on early multi-source field and media reporting provided in project context. Always verify casualty and damage statistics with official sources (e.g., Department of Meteorology and Hydrology (Myanmar), USGS, EMSC, humanitarian situation reports). We welcome PRs that add properly cited data provenance.

---

## 🚀 Quick Access / အမြန်ဝင်ကြည့်ရန်  
**Live Platform:** https://risemyanmarweb.onrender.com/  
If the spinner stays a bit longer: the server is waking up.

**မြန်မာလို:** ပထမဆုံး ဖွင့်တဲ့အခါ ခဏစောင့်ရနိုင်ပါတယ် (free hosting cold start)။ _ဤ Platform က ငလျင်အခြေအနေ Update တွေ၊ လိုအပ်ချက်တွေ၊ ကူညီလှူဒါန်းချင်သူတွေကို ချိတ်ဆက်ပေးဖို့ ဖန်တီးထားတာပါ_ 🙏

---

## 🕊️ In Memoriam & Purpose  
Every data point represents human lives, families, and recovery journeys.  
This repository is maintained with a commitment to:  
- Accuracy over virality  
- Transparency over obscurity  
- Coordination over duplication  

If you can help verify, translate, map, or improve—your contribution matters.

---

## 💡 What the Platform Does  
When disaster strikes, information fragmentation slows help. Rise Myanmar aggregates:  
- Real-time and emerging needs  
- Trusted donation & relief channels  
- Geo-context (fault proximity, affected townships, shelter locations)  
- Situation updates for both local residents & global supporters  

---

## ✨ Core Features (Existing / Planned)  
| Category | Feature | Status |
|----------|---------|--------|
| Mapping | Interactive Mapbox GL map for incidents, shelters, needs | ✅ |
| Authentication | Secure login via Auth0 (roles / contributor access) | ✅ |
| Localization | English & Burmese interface | ✅ (initial) |
| Needs Tracking | Real-time listing of requests & status | 🚧 |
| Donations | Curated & verified fundraising / supply channels | 🚧 |
| News & Updates | Situation briefs & field updates | 🚧 |
| Transparency | Open-source repo for accountability | ✅ |
| Future | Offline-first caching | Planned |
| Future | Mobile-friendly PWA | Planned |
| Future | Role-based dashboards (volunteer / admin) | Planned |

---

## 🧵 Earthquake Context Integration (Design Intent)  
| Data Layer | Source Candidates | Display Strategy |
|------------|------------------|------------------|
| Epicenter & Fault Trace | USGS / academic fault shapefiles | Map overlay (faint dashed red) |
| Intensity (MMI) | ShakeMap (if public) | Choropleth gradient |
| Reported Casualties | Aggregated CITED reports | Badge + disclaimers |
| Shelters / Clinics | Local NGOs, gov updates | Icon set w/ capacity |
| Donations | Verified campaigns | Trust badges (verified / pending) |
| Updates Timeline | Timestamped bulletins | Vertical chronological feed |

---

## 🖼️ Screens / Visuals (Add Later)  
| Section | Placeholder | Description |
|---------|-------------|-------------|
| Landing | `assets/screens/landing.png` | Mission + earthquake context |
| Map     | `assets/screens/map.png`     | Layer toggles (fault, needs, shelters) |
| Needs   | `assets/screens/needs.png`   | Filter + urgency |
| Donate  | `assets/screens/donations.png` | Verified channels |
| Burmese UI | `assets/screens/mm-ui.png` | Localization sample |

> Add real screenshots soon—visual credibility increases user retention & trust.

---

## 🧭 User Flow  
1. Visitor lands → mission + earthquake context + loading notice  
2. Map exploration → toggle layers (needs / shelters / fault line)  
3. Click marker → structured panel (what, where, status, verification)  
4. Donate / Act → direct link or required action instructions  
5. (If authenticated) Submit or update entries (with moderation flow)  

---

## 🛠️ Tech Stack  
| Layer | Tool |
|-------|------|
| Front-end | React 19 |
| Routing | react-router-dom |
| Auth | Auth0 (auth0-react) |
| Mapping | mapbox-gl |
| Build | react-scripts |
| Testing | React Testing Library / jest-dom |
| Performance Monitoring | web-vitals |

_Stack derived from current `package.json` (scan may be partial)._

---

## 🏗️ Project Structure (Indicative)  
```
RiseMyanmarWeb/
  src/
    components/
    pages/
    hooks/
    context/
    services/
    assets/
  public/
  package.json
  README.md
```
(Adjust after adding concrete directories.)

---

## ⚙️ Local Development  
### 1. Prerequisites  
- Node.js ≥ 18  
- Yarn or npm  
- Mapbox access token  
- Auth0 (Domain + Client ID)  

### 2. Clone  
```bash
git clone https://github.com/RiseMyanmar/RiseMyanmarWeb.git
cd RiseMyanmarWeb
```

### 3. Install  
```bash
npm install
# or
yarn install
```

### 4. Environment Variables  
Create `.env.local`:
```
REACT_APP_AUTH0_DOMAIN=your-tenant-region.auth0.com
REACT_APP_AUTH0_CLIENT_ID=yourClientId
REACT_APP_MAPBOX_TOKEN=pk.YourMapboxToken
REACT_APP_API_BASE_URL=https://api.example.com
```

### 5. Run Dev  
```bash
npm start
```

### 6. Build  
```bash
npm run build
```

---

## 🔐 Authentication Notes  
- Wrap protected routes using Auth0 guards (e.g., `withAuthenticationRequired`)  
- Proposed roles: `public`, `contributor`, `moderator`, `admin`  
- Add audit log for data edits (future)  

---

## 🗺️ Mapping Considerations  
| Challenge | Approach |
|-----------|----------|
| Many markers | Clustering + progressive load |
| Fault trace overlay | Lightweight GeoJSON layer |
| Performance | Lazy-load map component |
| Urgency visualization | Color + pulse for “critical” |
| Accessibility | Alt text + high-contrast theme toggle |

---

## 🌐 Localization (i18n)  
Use resource JSON files (`en`, `my`).  
Add runtime language switcher (persist to localStorage).  
Encourage contributions for refinement of Burmese technical phrasing.

---

## 🧪 Testing Strategy (Planned)  
| Area | Tool | Example |
|------|------|---------|
| Components | @testing-library/react | Render map controls |
| Auth Flows | Mock Auth0 | Redirect unauth access |
| Data Panels | Snapshot + behavioral | Show verified badge |
| i18n | Locale switch tests | Burmese key presence |
| Performance | Lighthouse CI (future) | TTI / LCP gating |

---

## 🔄 Performance & Hosting  
| Aspect | Current | Improvement Ideas |
|--------|---------|-------------------|
| Hosting | Free Render | Paid tier / edge deploy |
| Cold Start | Visible delay | “Warming server” UX + prefetch |
| Bundling | CRA | Migrate to Vite / Next.js |
| Map Load | Immediate | IntersectionObserver lazy init |
| Data Fetch | Sequential | Parallel + SW caching |

Inline preloader suggestion:
> “If loading exceeds 10s: server is waking (free tier). Thanks for your patience.”

---

## 📡 Data Integrity & Verification  
| Data Type | Trust Model |
|-----------|-------------|
| Donations | Require human verification + timestamp |
| Needs | Mark “unverified”, “verified”, “fulfilled” |
| Casualty Stats | Cite source(s) + version number |
| Geospatial Layers | Track origin (e.g., USGS, OSM, local survey) |

Recommended citation footer per panel:
```
Source: USGS event feed (retrieved 2025-03-29T12:00Z)
```

---

## 🧭 Roadmap  
- [ ] Verified data pipeline (moderator UI)  
- [ ] Public API documentation  
- [ ] Role-based dashboards  
- [ ] Offline PWA + fallback cache  
- [ ] Real-time socket updates  
- [ ] Fault + intensity layer integration  
- [ ] Data provenance badges  
- [ ] Multi-theme & accessibility improvements  
- [ ] Donation impact tracker visualization  
- [ ] Export to CSV / humanitarian formats (HXL)  

---

## 🙌 Contributing  
1. Open an issue describing improvement / feature  
2. Branch naming: `feat/`, `fix/`, `docs/`, `chore/`  
3. Keep PRs small & focused  
4. Provide context (screenshots / before-after)  
5. No secrets in commits  
6. Cite data sources clearly (link + retrieval timestamp)

Potential labels:
- `feature`
- `bug`
- `i18n`
- `data-quality`
- `good-first-issue`
- `urgent-response`

---

## 📣 Community & Impact  
Seeking:  
- GIS volunteers (fault & shelter layer refinement)  
- Translators (improve Burmese clarity)  
- Data verifiers (triage unverified submissions)  
- Humanitarian partners (ingest structured feeds)  

Open an issue to coordinate.

---

## 🌏 Burmese Call-to-Action  
၂ဝ၂၅ မတ် ၂၈ ရက် မြန်မာနိုင်ငံမှာ ဖြစ်ပွားခဲ့တဲ့ ငလျင်ကြီးကြောင့် ထိခိုက်သေဆုံး၊ နေရပ်ပြောင်းရွှေ့မှုတွေ ပေါ်ပေါက်လာပါတယ်။ ဒီ Platform က သတင်းအချက်အလက်တွေအချိန်နှင့်တပြေးညီ စုစည်းပြသပြီး ကူညီလိုသူတွေကို လမ်းညွှန်ပေးနိုင်ရန် ရည်ရွယ်ပါတယ်။  
➡️ ဝင်ကြည့်ရန်: https://risemyanmarweb.onrender.com/  
ပထမဆုံးဝင်စဉ် ခဏစောင့်ပေးပါ—server က run လုပ်လာနေတယ်။

---

## ⭐ Support & Visibility  
If you believe in transparent, localized disaster coordination:  
1. ⭐ Star the repo  
2. Share with Myanmar diaspora & relief networks  
3. Open issues with structured suggestions  
4. Contribute a first PR (docs / i18n / data integrity)  

---

## 🧾 License  
No license file detected. Consider adding one (MIT / Apache-2.0) to maximize reuse & trust.

---

## 📌 Disclaimer  
This README integrates earthquake impact details provided by project context. Figures and scientific characterizations (e.g., supershear rupture) should be continuously validated against authoritative seismic and humanitarian sources. Pull requests updating or refining data with citations are encouraged.

---

## ❤️ Final Call  
Every minute of clarity reduces chaos in crisis.  
Visit the platform, explore the map, and help amplify trusted relief pathways.

👉 https://risemyanmarweb.onrender.com/

“Information organized is help accelerated.”

---
