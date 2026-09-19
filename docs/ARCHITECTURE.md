# OffGrid056 Member Resource Library V1: Stage 2 Architecture

**Status:** APPROVED (Stage 2, owner sign-off 20 Sep 2026) · **Date:** 20 September 2026
**Stack (approved at Stage 1):** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · ESLint · Playwright · static export
**Scope rule:** V1 is a static site with no database, server, login or payments. All member state lives in the
browser, behind interfaces that a server can take over later without changing the UI.

---

## 1. INFORMATION ARCHITECTURE

The library is a member tool, not a marketing site. The home page is the member dashboard.

```
MEMBER DASHBOARD (home)
├─ START HERE ................ guided onboarding (6 ordered cards)
├─ LIBRARY (all resources) ... search + filters across everything
├─ THE FIVE FOUNDATIONS ...... overview + progress for all five
│   ├─ AIR ...... Ventilation · Dampness & Moisture · Indoor Air Quality · Healthy Home Checks · Air Worksheets · Air Checklists
│   ├─ WATER .... Water Storage · Rainwater · Water Security · Household Water Planning · Water Worksheets · Water Checklists
│   ├─ SHELTER .. Household Resilience · Heating · Insulation · Weatherproofing · Maintenance · Property Assessment · Shelter Worksheets
│   ├─ FOOD ..... Pantry Resilience · Food Storage · Growing Food · Seasonal Growing · Food Planning · Preservation Guidance · Food Worksheets
│   └─ ENERGY ... Backup Energy · Solar · Lighting · Household Energy Planning · Energy Use · Energy Worksheets · Energy Checklists
├─ PLANNING TOOLS ............ planners, templates, assessments, general worksheets
├─ 30-DAY RESILIENCE PROGRAMME  overview → Day 1…30
├─ RESOURCE PACKS ............ bundles of resources
├─ VIDEOS & TUTORIALS
├─ SUPPLIERS & SERVICES ...... directory (DEMO data in V1)
├─ WORKSHOPS & EVENTS ........ Upcoming · Past · Recordings · Handouts
├─ MEMBER DOWNLOADS .......... every downloadable file in one place
└─ MY LIBRARY ................ Saved resources · My progress
```

**How content finds its place.** Every resource is **one data entry**, and it appears in the right sections
automatically:

| Section | Membership rule |
|---|---|
| Foundation page | `foundation` = that foundation |
| Topical category | `category` = that category slug |
| Type-based category (e.g. "Air Worksheets", "Air Checklists") | **Automatic:** a foundation match plus `resourceType` in the category's `matchTypes`. A worksheet about ventilation therefore appears under *Ventilation* **and** *Air Worksheets* without being entered twice. |
| Start Here | `collections` includes `start-here` (ordered by `order`) |
| Planning Tools | `collections` includes `planning-tools` |
| Resource Packs | `resourceType` = `download-pack` |
| Videos & Tutorials | `resourceType` ∈ {video, tutorial} **or** a `videoUrl` is present |
| Member Downloads | `downloadable` = true and a file is present |
| New This Month | Published in the last 30 days (see §3, `new`) |

`foundation: "general"` covers cross-cutting resources (Start Here, planning, programme). It is a filter value, not a
sixth foundation, and **the Five Foundations framework itself is unchanged.**

---

## 2. ROUTE STRUCTURE

All routes are pre-rendered to static HTML at build time. Dynamic segments are enumerated with
`generateStaticParams` and `dynamicParams = false`, so an unknown slug gives a clean 404.

| Route | Page | Rendering |
|---|---|---|
| `/` | Member Dashboard | Static shell; member panels hydrate from storage |
| `/start-here/` | Start Here | Static |
| `/library/` | All resources: search and filters (`?q=&foundation=&type=&difficulty=&time=&status=`) | Static shell; client search and filtering |
| `/foundations/` | Five Foundations overview and progress | Static plus client progress |
| `/foundations/[foundation]/` | e.g. `/foundations/water/` | 5 pages |
| `/foundations/[foundation]/[category]/` | e.g. `/foundations/water/rainwater/` | 33 pages (6 + 6 + 7 + 7 + 7) |
| `/resources/[slug]/` | Resource detail | One page per resource |
| `/planning-tools/` | Planning Tools | Static |
| `/programme/` | 30-Day Programme overview | Static plus client progress |
| `/programme/day/[day]/` | Day 1…30 | 30 pages |
| `/packs/` | Resource Packs | Static |
| `/videos/` | Videos & Tutorials | Static |
| `/suppliers/` | Suppliers & Services directory (`?country=&foundation=&category=`) | Static plus client filtering |
| `/workshops/` | Workshops & Events (tabs: upcoming · past · recordings · handouts) | Client decides past/upcoming *at view time* |
| `/workshops/[slug]/` | Workshop detail | Static |
| `/downloads/` | Member Download Centre (`?type=`) | Static plus client filtering |
| `/saved/` | Saved resources | Client |
| `/progress/` | My Progress (foundations, programme, completed list) | Client |
| `404` | Not found, with search and links home | Static |

- **Trailing slashes are on** (`trailingSlash: true`). Each route exports as `route/index.html`, which works on
  every host, including plain web hosts with no URL rewriting.
- **Filter state lives in the URL query string.** Filtered views can be bookmarked and shared, and the browser Back
  button behaves as expected.

---

## 3. RESOURCE DATA SCHEMA

**Format:** one JSON file per resource in `data/resources/<slug>.json`. Adding a resource means adding one file. A
file-per-entry layout keeps git diffs readable and maps 1:1 onto future CMS or database rows. Every file is
validated at build time with **Zod**. The TypeScript types are *inferred from* the Zod schemas, so types and
validation can never drift apart.

```ts
type FoundationId = "air" | "water" | "shelter" | "food" | "energy" | "general";
type ResourceTypeId = "guide" | "workbook" | "checklist" | "planner" | "assessment" | "worksheet" | "video"
  | "tutorial" | "template" | "supplier-resource" | "workshop" | "programme" | "download-pack";
type Difficulty = "beginner" | "intermediate" | "advanced";
type CollectionId = "start-here" | "planning-tools";

interface Resource {
  // identity
  id: string;                  // stable forever, e.g. "res-0001". Member progress is keyed on this, never on slug
  slug: string;                // URL, e.g. "water-security-guide"; may change without losing member progress
  legacyCode?: string;         // e.g. "OG-08", for the later import of the existing programme assets
  // content
  title: string;
  description: string;         // short: card and search (≤ 220 chars, validated)
  summary?: string;            // longer detail-page intro (plain text or limited Markdown)
  learningObjectives: string[];
  // classification
  foundation: FoundationId;
  category: string;            // must be a valid category of `foundation` (validated)
  resourceType: ResourceTypeId;
  difficulty: Difficulty;
  estimatedTime: number;       // MINUTES (number, so time filters work); shown as "15 min" or "1 h 30 min"
  tags: string[];
  collections?: CollectionId[];
  order?: number;              // ordering inside collections and learning paths
  // flags
  featured: boolean;
  new?: boolean;               // OPTIONAL OVERRIDE. Default "New" = published in the last 30 days
  premium: boolean;            // stored for future tiers; not enforced or shown in V1
  isPlaceholder: boolean;      // true = demo/placeholder. Shows a DEMO badge; a release check can fail on it
  status: "draft" | "published" | "archived";  // only "published" is built into the site
  // media and files
  thumbnail?: { src: string; alt: string };    // absent → branded placeholder generated from foundation + type
  fileUrl?: string;            // "/resources/water/water-security-guide.pdf" or an absolute URL
  fileFormat?: "PDF" | "XLSX" | "DOCX" | "ZIP" | "PNG";
  fileSizeBytes?: number;      // auto-read at build for local files; required for remote files
  externalUrl?: string;        // off-site resource (opens in new tab, labelled as external)
  videoUrl?: string;           // YouTube, Vimeo or direct .mp4/.webm; provider detected automatically
  downloadable: boolean;
  // dates (ISO 8601)
  publishedDate: string;
  updatedDate?: string;
  // relationships
  relatedResources: string[];  // resource ids (validated to exist)
  learningPath?: string;       // learning-path id (validated)
  packItems?: string[];        // download-pack only: the resource ids in the pack
  completionAvailable: boolean;// false for e.g. supplier links, where "complete" makes no sense
}
```

**Supporting data**

- `data/taxonomy/foundations.json`: the 5 foundations plus General (name, slug, icon, colour treatment, order,
  description) and their categories. Each category has `slug`, `name`, `description`, and optional `matchTypes`
  for the type-based categories.
- `data/taxonomy/resource-types.json`: 13 types (label, plural, icon, whether "Open" means view, read, watch or
  use).
- `data/learning-paths/<id>.json`: `{ id, title, description, foundation, steps: resourceId[] }`. These power
  "Continue Learning" and "Next recommended resource".
- **Time bands** are derived, not stored:
  - Under 10 min: `< 10`
  - 10–30 min: `10–30`
  - 30–60 min: `31–60`
  - 1 hour+: `> 60`

**Build-time validation** (`npm run validate`, also run automatically before every build):

- schema check on every file;
- unique `id` and `slug`;
- `category` belongs to its foundation;
- every `relatedResources`, `packItems`, `learningPath`, programme and workshop reference exists;
- local files exist on disk;
- a `thumbnail` has `alt` text;
- a `download-pack` has items;
- a placeholder-count report.

**A broken entry fails the build with a readable message instead of breaking a page.**

---

## 4. PROGRAMME DATA SCHEMA

```ts
// data/programme/programme.json
interface Programme {
  id: "30-day-resilience";
  title: string; overview: string; isPlaceholder: boolean;
  weeks: { number: 1 | 2 | 3 | 4 | 5; title: string; days: number[] }[];   // day 29–30 = final "week"
}
// data/programme/days/day-01.json … day-30.json
interface ProgrammeDay {
  day: number;                 // 1–30 (validated: all 30 present, no gaps)
  week: number;
  title: string;
  foundation: FoundationId;
  objective: string;
  action: string;              // the concrete task for the day
  estimatedTime: number;       // minutes
  resourceIds: string[];       // linked library resources
  worksheet?: { resourceId?: string; fileUrl?: string; label: string };
  notesEnabled: boolean;       // member notes stored in member state, not here
  isPlaceholder: boolean;
}
```

- **Completion and notes are member state** (§8), keyed by day number. V1 has **no drip-release**: every day is
  open, and "Continue" goes to the first incomplete day. Timed unlocks need accounts (§14).
- **V1 contains placeholder days only** ("Day 3: Placeholder: Water storage check"). The existing OG-01…OG-45
  programme is imported later and re-skinned per Stage 1 decision E.

---

## 5. SUPPLIER AND WORKSHOP SCHEMA

```ts
// data/suppliers/<slug>.json
interface Supplier {
  id: string; slug: string;
  name: string;                     // V1: "DEMO: Example Water Tank Supplier (NZ)"
  category: string;                 // e.g. "Water tanks", "Solar installers", "Insulation"
  foundations: FoundationId[];      // array: one supplier can serve several foundations
  serviceTypes: ("products" | "installation" | "advice" | "assessment" | "maintenance" | "training")[];
  country: "NZ" | "AU" | "US" | "CA";
  region: string;                   // "Waikato", "Queensland", "Nationwide", "Online"
  website: string;                  // V1 demo entries use https://example.com (reserved, never a real business)
  description: string;
  isDemo: boolean;                  // V1: always true → "DEMONSTRATION CONTENT" label
  verifiedDate?: string;            // for later: when OffGrid056 last checked the listing
}

// data/workshops/<slug>.json
interface Workshop {
  id: string; slug: string; title: string;
  startDate: string;                // ISO with offset, e.g. "2026-11-14T10:00:00+13:00"
  endDate?: string;
  timeZone: string;                 // IANA, e.g. "Pacific/Auckland"; shown in the viewer's local time
  mode: "online" | "in-person" | "hybrid";
  location: string;                 // venue + town, or "Online (link sent to registered members)"
  description: string;
  videoUrl?: string;                // recording, after the event
  downloads: { label: string; resourceId?: string; fileUrl?: string }[];   // handouts
  relatedResources: string[];
  isDemo: boolean;
}
```

- **Upcoming or past is worked out in the member's browser when they view the page, not at build time.** A static
  site built in October would otherwise still show an October event as "upcoming" in December.
- Recordings = past workshops with a `videoUrl`. Handouts = all workshop `downloads`.

---

## 6. COMPONENT ARCHITECTURE

**Layers (strict one-way dependencies):**

```
app/ (routes)                  server components: load content at build, pass slim props down
   │
components/ (UI)               presentational; interactive parts are small client components ("islands")
   │
lib/ (business logic)          pure TypeScript: search, filters, progress, recommendations, formatting. No React
   ├─ lib/content/             content repository: the ONLY code that reads data/ (swap point for a CMS/DB)
   └─ lib/member/              member-state store + hooks: the ONLY code that touches storage (swap point for accounts)
   │
data/ (content)                JSON only, no code
```

| Group | Components |
|---|---|
| Layout | `AppHeader` · `MemberSidebar` · `MobileNavigation` (bottom bar + drawer) · `Breadcrumbs` · `SkipLink` · `PageHeader` |
| Resources | `ResourceCard` · `ResourceGrid` · `ResourceFilters` · `SearchBar` · `FoundationBadge` · `ResourceTypeBadge` · `DifficultyBadge` · `StatusBadges` (New / Featured / Demo) · `PlaceholderThumbnail` · `ResourceViewer` · `DownloadButton` · `OpenButton` · `VideoEmbed` (click-to-load) · `RelatedResources` · `LearningObjectives` |
| Member | `CompletionButton` · `SaveButton` · `ContinueLearning` · `RecentlyViewed` · `SavedResources` · `RecommendedNextStep` · `NewThisMonth` |
| Progress | `ProgressBar` · `FoundationProgress` (the Five Foundations panel) · `ProgrammeProgress` |
| Programme | `ProgrammeOverview` · `ProgrammeDay` · `DayNavigation` · `DayChecklist` · `DayNotes` |
| Directory | `SupplierCard` · `SupplierFilters` · `WorkshopCard` · `WorkshopTabs` · `DownloadTable` |
| UI primitives | `Button` · `Badge` · `Card` · `Tabs` · `Dialog`/`Sheet` (mobile filters) · `EmptyState` · `Skeleton` · `VisuallyHidden` · `DemoBanner` |

**Rules:**
- Pages never read `data/` directly; they go through `lib/content`.
- Components never touch `localStorage`; they go through `lib/member` hooks.
- Cards receive a slim `ResourceSummary` (no long text), so list pages ship little data to the browser.

**Placeholder thumbnails** are generated inline as SVG, with no image files: the foundation colour treatment, the
foundation icon, the resource-type label and an **"IMAGE TO COME"** tag. This makes it obvious the imagery is
temporary (Stage 1 decision C), and it costs almost nothing to load.

---

## 7. STORAGE ABSTRACTION

```ts
// lib/member/store.ts: the contract every storage backend implements
interface MemberStore {
  load(): Promise<MemberState>;
  // favourites
  setSaved(resourceId: string, saved: boolean): Promise<void>;
  // completion
  setCompleted(resourceId: string, completed: boolean): Promise<void>;
  // history
  recordView(resourceId: string): Promise<void>;
  setLastLocation(loc: LastLocation): Promise<void>;
  // programme
  setDayCompleted(day: number, completed: boolean): Promise<void>;
  setDayNotes(day: number, notes: string): Promise<void>;
  // lifecycle
  subscribe(listener: (s: MemberState) => void): () => void;   // other tab / other device changes
  exportState(): Promise<MemberState>;                          // backup / migration to an account
  importState(s: MemberState, mode: "merge" | "replace"): Promise<void>;
}
```

- **V1 implementation:** `LocalMemberStore` (localStorage). **Later:** `RemoteMemberStore` (API + database). Only
  one line in `lib/member/index.ts` chooses which one to use.
- **All methods are async** even though localStorage is synchronous. Server storage will be async, so no calling
  code has to change later.
- **React hooks sit on top:** `useMemberState()`, `useSaved(id)`, `useCompleted(id)`, `useRecent()`,
  `useProgramme()`, via one `MemberStateProvider` and `useSyncExternalStore`.
- **Changes appear immediately.** The UI updates at once and the store persists in the background. Marking a
  resource complete updates the dashboard, foundation progress and card badges with no page reload.

---

## 8. LOCALSTORAGE STRATEGY

**One namespaced, versioned key:** `og056.member.v1`

```json
{
  "schemaVersion": 1,
  "saved":     { "res-0004": "2026-09-20T09:12:00Z" },
  "completed": { "res-0001": "2026-09-20T09:30:00Z" },
  "recent":    [ { "id": "res-0004", "at": "2026-09-20T09:12:00Z" } ],
  "lastLocation": { "kind": "resource", "id": "res-0004", "at": "…" },
  "programme": { "days": { "1": { "completed": true, "completedAt": "…", "notes": "Checked the tank" } } },
  "assessments": {},
  "updatedAt": "…"
}
```

- **Keyed by resource `id`, never by slug or title.** Renaming a resource or changing its URL never loses anyone's
  progress. Ids for deleted resources are ignored gracefully.
- **Timestamps are stored rather than booleans.** This allows "completed this week", correct ordering, and a clean
  merge when a member later creates an account.
- **Recent history is capped:** at most 20 entries stored, de-duplicated with the newest first. The dashboard shows
  8.
- **Programme notes** are capped at 2,000 characters per day. Total state stays well under 100 KB, against a
  roughly 5 MB browser limit.
- **Safety:**
  - Every read and write is wrapped in try/catch.
  - Corrupt data is backed up to `og056.member.v1.corrupt` and then reset, rather than crashing the site.
  - If storage is unavailable (private browsing, blocked), the site falls back to an in-memory store and shows a
    gentle note: *"Your progress can't be saved in this browser."*
- **Migrations:** `schemaVersion` plus a migration function per version, so later schema changes never wipe member
  progress.
- **Cross-tab sync:** the `storage` event keeps two open tabs consistent.
- **Known V1 limit:** progress belongs to one browser on one device. See the owner decision on backup/export in §15.

---

## 9. SEARCH AND FILTER ARCHITECTURE

- **Index:** built at build time from the content repository. It holds the searchable fields only: title,
  description, tags, category name, foundation name and type label. It ships as a small static JSON file
  (`/search-index.json`), **loaded only when the member first focuses a search box or opens the Library**, so the
  dashboard stays light.
- **Engine: MiniSearch 7** (MIT, about 7 KB gzipped). It gives prefix matching ("rainw…" finds "rainwater"), fuzzy
  matching (typo tolerance) and field weighting:
  - title ×5
  - tags ×3
  - category / foundation / type ×2
  - description ×1
- **Market spelling synonyms:** the four markets spell differently, so a synonym map folds variants together, e.g.
  mould/mold, colour/color, programme/program, fibre/fiber, storey/story, gas bottle/propane tank. A US member
  searching "mold" finds the NZ-spelled resource.
- **Filters are pure functions** in `lib/filters.ts`, applied after search, and each is unit-tested:
  - foundation, resource type and difficulty (multi-select);
  - time band;
  - status: New, Featured, Completed, Not completed. Completed and Not completed read member state.
- **Responsiveness:** typing is debounced about 120 ms and results update in place, without a page reload.
  Result counts are announced to screen readers through an `aria-live` region.
- **URL sync:** the query and filters are written to the address bar (`router.replace`), so views are shareable
  and survive a refresh.
- **Header search** on every page opens results in `/library/?q=…`.
- **Scale:** client-side search comfortably handles a few thousand resources. Past that, see §14.

---

## 10. PROGRESS, FAVOURITES AND RECENT-ITEMS ARCHITECTURE

All of these are **derived by pure functions in `lib/progress`**, from two inputs: content, and member state. Nothing
derived is stored, so it can never go stale.

| Output | Rule |
|---|---|
| **Foundation progress %** | Completed ÷ completable, counting published resources in that foundation with `completionAvailable` |
| **Assessment status** (per foundation) | *Not started* / *Done*: whether the foundation's `assessment`-type resource(s) are completed. The `assessments` slot is reserved for scored assessments later. |
| **Next recommended resource** (per foundation) | First incomplete step of the foundation's learning path → else incomplete featured → else the easiest incomplete resource |
| **Continue Learning** | `lastLocation` if it is incomplete → else the next step in the member's most recent learning path → else Start Here |
| **Recently viewed** | Recorded when a resource detail page opens; newest first; shows 8 |
| **Saved** | The saved map, newest first; `/saved/` gives the full list with the same filters as the Library |
| **Programme progress** | Completed days ÷ 30; "Continue" goes to the first incomplete day |
| **New This Month** | `new` override, otherwise published in the last 30 days |
| **Recommended Next Step** (one dashboard card) | Assessment not done → *Household Resilience Assessment* · programme started → *next programme day* · otherwise the foundation with the lowest % → its next recommended resource |

**Dashboard load path:**
1. The static shell renders instantly.
2. The member panels show skeletons for a split second.
3. The panels fill from the store.

**The member dashboard makes no network request other than the page itself.**

---

## 11. RESPONSIVE AND NAVIGATION ARCHITECTURE

| Breakpoint | Navigation | Layout |
|---|---|---|
| **Desktop** ≥ 1024 px | Persistent `MemberSidebar` (Charcoal, with Resilience Green active state): Dashboard · Start Here · Library · Five Foundations (expandable to the 5) · Planning Tools · 30-Day Programme · Packs · Videos · Suppliers · Workshops · Downloads · Saved · Progress. `AppHeader` holds the search box. | 3–4 column card grid |
| **Tablet** 768–1023 px | The sidebar collapses to an off-canvas drawer, opened from the header menu button | 2–3 column grid |
| **Mobile** < 768 px | `MobileNavigation` bottom bar with 5 targets: **Home · Library · Programme · Saved · Menu**. Menu opens the full drawer. Search is a header icon that expands to a full-width field. Filters open in a bottom sheet. | 1 column; cards become compact rows |

**Accessibility target: WCAG 2.2 AA**

- **Page structure:** semantic landmarks (`header`, `nav`, `main`, `aside`) and a "Skip to content" link.
- **Keyboard:** everything is reachable by keyboard. The drawer and sheet trap focus, close on Esc and return focus
  to the button that opened them. Focus rings are always visible.
- **Tap targets:** at least 44 × 44 px on mobile. The base font is 16 px, and nothing is below 14 px.
- **Motion:** `prefers-reduced-motion` is respected.
- **Images:** real thumbnails require `alt` text (validated at build). Decorative icons are `aria-hidden`.

**Brand colour contrast (calculated):**

| Pairing | Ratio | Use |
|---|---|---|
| Deep Green #35551A on Warm White #F4F2EA | 7.6 : 1 ✅ | Links, headings, primary text accents on light |
| Charcoal #11130F on Resilience Green #A8CF20 | 10.3 : 1 ✅ | Primary buttons (charcoal text on green) |
| Resilience Green on Charcoal | 10.3 : 1 ✅ | Active navigation, focus ring on dark |
| Earth Taupe #756B5B on Warm White | 4.7 : 1 ✅ (just) | Secondary text at body size and above only |
| **Resilience Green on Warm White** | **1.6 : 1 ❌** | **Never for text or icons on light backgrounds**, only fills |

---

## 12. DEPLOYMENT ARCHITECTURE

- **Build and output:** `npm run build` runs validation, then `next build` with `output: "export"`, producing a
  plain static folder `out/`.
- **Images:** `images.unoptimized: true`. Static export has no image server, so real thumbnails are pre-sized to
  WebP by a `tools/` script at import time.
- **Fonts:** self-hosted through `next/font/local`, using the guide's approved Bebas Neue and Montserrat files. OFL
  licence files go alongside them.

| Host | Setup |
|---|---|
| **Vercel** | Import the repository; the framework is auto-detected. `vercel.json` sets headers. |
| **Cloudflare Pages** | Build command `npm run build`, output folder `out`. `public/_headers` sets headers. |
| **Railway** | Serve `out/` with a static file server (documented start command) |
| **Any web host** | Upload the contents of `out/` |

- **Search engines:** V1 carries `noindex` (meta tag plus `robots.txt Disallow: /`). A member library should not
  appear in search results.
- **Security headers** (CSP, `X-Content-Type-Options`, `Referrer-Policy`, frame rules) are supplied per host, since
  static export can't set them itself.
- **YouTube:** videos use the `youtube-nocookie.com` embed domain and only load when the member presses play.

---

## 13. FOLDER STRUCTURE

```
OffGrid056-System/
├─ internal\                          ← NOT in the repo: architecture, owner decisions, specs, import/migration notes, QA
└─ offgrid056-member-library\         ← git repository (the app)
   ├─ app\
   │  ├─ layout.tsx                    root: fonts, MemberStateProvider, shell
   │  ├─ page.tsx                      Dashboard
   │  ├─ start-here\  library\  foundations\[foundation]\[category]\
   │  ├─ resources\[slug]\  planning-tools\  programme\day\[day]\
   │  ├─ packs\  videos\  suppliers\  workshops\[slug]\  downloads\  saved\  progress\
   │  └─ not-found.tsx
   ├─ components\  layout\ resources\ member\ progress\ programme\ directory\ ui\
   ├─ data\
   │  ├─ taxonomy\          foundations.json · resource-types.json
   │  ├─ resources\         <slug>.json  (one file per resource)
   │  ├─ learning-paths\    <id>.json
   │  ├─ programme\         programme.json · days\day-01.json … day-30.json
   │  ├─ suppliers\         <slug>.json
   │  └─ workshops\         <slug>.json
   ├─ lib\
   │  ├─ content\           schemas.ts (Zod) · repository.ts · summaries.ts
   │  ├─ member\            store.ts (interface) · local-store.ts · memory-store.ts · migrations.ts · hooks.ts · provider.tsx
   │  ├─ search\            index-builder.ts · search.ts · synonyms.ts
   │  ├─ filters\  progress\  recommendations\  video\  format\
   ├─ public\
   │  ├─ brand\             Design A logo PNGs, favicon (copied unmodified from the approved set)
   │  ├─ icons\             Five Foundations + tool SVG icons (from the guide set)
   │  ├─ images\            real thumbnails later (empty in V1)
   │  └─ resources\         PDFs / files, by foundation (placeholder PDFs only in V1)
   ├─ styles\               globals.css (Tailwind 4 @theme brand tokens) · fonts\ (woff + OFL.txt)
   ├─ docs\                 SETUP · ADDING_RESOURCES · DEPLOYMENT · ARCHITECTURE (summary) · FUTURE_DEVELOPMENT
   ├─ tools\                validate-content.ts · new-resource.ts (scaffold a new entry) · check-links.ts · make-thumbnails
   ├─ tests\                unit\ (Vitest: filters, search, progress, store, migrations) · e2e\ (Playwright)
   ├─ next.config.ts · tsconfig.json · eslint.config.mjs · playwright.config.ts · package.json
   └─ README.md
```

- **Local dev port:** 3800.
- **Package versions are pinned exactly.** Current releases: Next 16.3.5, Tailwind 4.3.3, Zod 4.6.5,
  MiniSearch 7.2.0.

---

## 14. FUTURE SERVER / DATABASE MIGRATION PATH

| Phase | Change | What stays the same |
|---|---|---|
| **V1 (now)** | Static; JSON content; localStorage member state | — |
| **Server mode** | Remove `output: "export"`; host on Vercel or Railway | Every page and component |
| **Accounts** | Add authentication (Supabase Auth fits your other projects; Clerk is an alternative). Protected routes via Next's request proxy. | UI; the content layer |
| **Progress sync** | `RemoteMemberStore` (API routes + Postgres with row-level security). **On first sign-in, the member's local progress is merged into their account:** saved and completed are combined (earliest date kept), recent items merged by time, newest notes kept. | Hooks and components |
| **Paid tiers** | `premium` / entitlement check in `lib/content` and the proxy; gated files served from private storage via signed URLs | Resource schema (the `premium` field already exists) |
| **CMS / admin** | Replace `lib/content/repository.ts` with a database or CMS reader, using the same Zod schemas and the same ids | Pages, search, filters |
| **Skool / CRM** | Membership and events synced by webhook into the account layer | Library UI |
| **Search at scale** | Postgres full-text search or a hosted search service behind the same `search()` function | Search UI |
| **Quizzes, assessments, certificates, notes, comments, reminders, bookings, AI assistant** | New modules attached to the account layer. The `assessments` slot and `learningPath` already exist in the schemas. | Everything above |

**Not built in V1:** authentication, payments, quizzes, comments, reminders, bookings, AI, CRM or Skool
integration.

---

## 15. RISKS AND OWNER DECISIONS REQUIRED

### Decisions (approved as recommended)

| # | Decision | Recommendation |
|---|---|---|
| **D1** | **Foundation colours.** The locked brand has no per-foundation colours; all guide icons share the Deep Green disc. Introducing five new colours would be a brand change. | **Distinguish the five foundations using the 6 existing brand colours only.** Each foundation gets its own background/ink pairing, plus its icon and name label, so none relies on colour alone: <br>• AIR: Warm White background, Deep Green ink<br>• WATER: Deep Green background, Warm White ink<br>• SHELTER: Graphite background, Warm White ink<br>• FOOD: Earth Taupe background, Warm White ink<br>• ENERGY: Resilience Green background, Charcoal ink<br>No new colours. |
| **D2** | **Access control.** V1 has no login, so anyone who has the URL can open it and download its files. | Deploy V1 **privately** (e.g. Cloudflare Access, free for up to 50 users) or with placeholders only, until accounts exist. `noindex` stays on regardless. **Don't publish real paid resources on an open V1 URL.** |
| **D3** | **Progress backup.** Browser-only progress is lost if the member clears their browser or switches device. | Add a small **"Back up / restore my progress"** control (a downloadable file) on `/progress/`. It is cheap, and it becomes the migration path into accounts. |
| **D4** | **"New" badge rule.** | Automatic: published in the last 30 days, with `new` as a manual override. Avoids stale "New" badges. |
| **D5** | **`premium` flag.** | Store it; **don't show or enforce it in V1.** |
| **D6** | **Programme drip-release.** | All 30 days open; "Continue" goes to the first incomplete day. Timed unlocks come later with accounts. |
| **D7** | **Dark mode.** | Not in V1. The sidebar and header are already dark (Charcoal), matching the brand. |
| **D8** | **Interface spelling.** | NZ/UK English in the interface ("favourites", "programme", "colour"), with search synonyms for US spellings (§9). Matches the guide. |
| **D9** | **Search library.** | Approve MiniSearch (MIT). A home-built search is possible, but has weaker typo tolerance. |
| **D10** | **Git commit identity** | Repository-local identity: `OffGrid056`. The global identity is unchanged. |

### Risks

| Risk | Mitigation |
|---|---|
| Content entry errors as the library grows | Zod validation plus the reference checks fail the build with a clear message. `tools/new-resource` creates correctly shaped entries. |
| Member progress lost when resources change | Progress is keyed by permanent ids, not slugs. The validator blocks duplicate or reused ids. |
| Large PDFs slowing pages | PDFs are never embedded; **Open** (new tab, using the browser's own PDF viewer) and **Download** buttons show format and size. Nothing loads until clicked. |
| Static export limits (no proxy, rewrites or server headers) | Designed around them: trailing slashes, host-level headers, client-side "past/upcoming". The move to server mode is documented (§14). |
| Logo exists as PNG only (no SVG) | Use the approved PNGs, sized correctly. **Don't redraw** (standing rule). An official SVG can replace them later if one is supplied. |
| Demo content reaching a live launch | `isPlaceholder`/`isDemo` flags; DEMO badges and banners; a `validate --release` mode fails if any placeholder remains. |
| Legacy navy/gold resources imported by mistake | The import happens only in the later phase, with re-skin rules (Stage 1 decision E) recorded in `internal/IMPORT_NOTES.md`. |

---

**Stage 2 approved. Stage 3 (UI system) is in progress.**
