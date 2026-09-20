# Adding and editing content

All content lives in `data/` as JSON. **One new resource is one new file.** Nothing in `app/` or `components/`
needs to change, and `npm run validate` checks everything before a build.

After any change: `npm run validate`, then `npm run dev` to look at it.

---

## 1. Resources

One file per resource: `data/resources/<slug>.json`. Copy an existing one and edit it.

```jsonc
{
  "id": "res-0031",                  // PERMANENT and unique. Never reuse or change it: member progress is keyed on it.
  "slug": "water-security-guide",    // the web address: /resources/water-security-guide/
  "legacyCode": "OG-08",             // optional: the old code, for imported material
  "title": "Water Security Guide",
  "description": "One or two sentences for cards and search (10–220 characters).",
  "summary": "Optional longer introduction shown on the resource page.",
  "learningObjectives": ["What the member will be able to do", "…"],

  "foundation": "water",             // air | water | shelter | food | energy | general
  "category": "water-security",      // must be a category of that foundation (see data/taxonomy/foundations.json)
  "resourceType": "guide",           // guide, workbook, checklist, planner, assessment, worksheet, video,
                                     // tutorial, template, supplier-resource, workshop, programme, download-pack
  "difficulty": "beginner",          // beginner | intermediate | advanced
  "estimatedTime": 25,               // MINUTES (a number), which drives the time filters
  "tags": ["water security", "storage"],
  "collections": ["start-here"],     // optional: start-here, planning-tools
  "order": 3,                        // optional: position within a collection or list

  "featured": false,
  "new": true,                       // optional override. Leave it out and "New" lasts 30 days from publishedDate.
  "premium": false,                  // stored for future paid tiers; not shown or enforced in V1
  "isPlaceholder": false,            // TRUE for demo content: shows the Demo badge and the banner
  "status": "published",             // draft | published | archived — only published is built

  "thumbnail": { "src": "/images/water-security.webp", "alt": "Describe the picture" },  // optional
  "fileUrl": "/resources/water/water-security-guide.pdf",   // optional
  "fileFormat": "PDF",               // PDF | XLSX | DOCX | ZIP | PNG
  "downloadable": true,
  "externalUrl": "https://example.com/page",   // optional: a resource hosted elsewhere
  "videoUrl": "https://www.youtube.com/watch?v=…",  // optional: YouTube, Vimeo or a direct video file

  "publishedDate": "2026-09-10",
  "updatedDate": "2026-09-19",       // optional
  "relatedResources": ["res-0015", "res-0017"],   // optional: ids, shown first under Related
  "learningPath": "water-basics",    // optional
  "packItems": ["res-0003", "res-0005"],          // download-pack only
  "completionAvailable": true        // false when "mark complete" makes no sense
}
```

**Where it appears, automatically:** its foundation page, its category page, any type-based category (for example
a worksheet also appears under "Water Worksheets"), search and filters, the Download Centre if it has a file, the
Videos page if it has a video, and Start Here or Planning Tools if listed in `collections`.

**Files:** put the file in `public/resources/<foundation>/<slug>.pdf` and set `fileUrl` to
`/resources/<foundation>/<slug>.pdf`. **The file size is read from the file itself at build time**, so it is never
wrong. Keep PDFs as small as sensible; nothing is embedded in a page.

### Replacing demonstration content with the real thing

1. Replace the file in `public/resources/…` with the real one (same path keeps every link working).
2. Rewrite `title`, `description`, `summary`, `learningObjectives` and `tags`.
3. Set `"isPlaceholder": false` and update `updatedDate`.
4. `npm run validate` — and for a launch, `npm run validate -- --release`, which fails while any placeholder remains.

**Never change an `id`.** A slug can change (old links then stop working), but an id must not: member progress,
favourites and history are keyed on it.

---

## 2. Learning paths

`data/learning-paths/<id>.json`:

```jsonc
{
  "id": "water-basics",
  "title": "Water Basics",
  "description": "One sentence.",
  "foundation": "water",
  "steps": ["res-0014", "res-0015", "res-0017", "res-0016"]   // ordered resource ids
}
```

Add `"learningPath": "water-basics"` to each resource in the path so the "step 2 of 4" strip appears on it.

---

## 3. The 30-Day Programme

- `data/programme/programme.json` — title, overview, and the weeks with their day numbers.
- `data/programme/days/day-01.json` … `day-30.json` — one file per day.

```jsonc
{
  "day": 9,
  "week": 2,
  "title": "Day 9 — …",
  "foundation": "water",
  "objective": "What this day is for.",
  "action": "The one practical thing to do today.",
  "estimatedTime": 20,
  "resourceIds": ["res-0015"],
  "worksheet": { "label": "Water Storage Calculator", "resourceId": "res-0015" },  // optional
  "notesEnabled": true,
  "isPlaceholder": false
}
```

Rules the validator enforces: all 30 days present exactly once, the weeks cover days 1–30, every linked resource
exists and is published, and **a worksheet must point at a resource that actually has a file**.

Completion and notes are member state, not content: nothing about a member is stored in these files.

---

## 4. Suppliers

`data/suppliers/<slug>.json`:

```jsonc
{
  "id": "sup-0011",                 // permanent and unique
  "slug": "example-water-tanks",
  "name": "Example Water Tanks",
  "category": "Water tanks & storage",
  "foundations": ["water"],
  "serviceTypes": ["products", "installation"],   // products, installation, advice, assessment, maintenance, training
  "country": "NZ",                  // NZ | AU | US | CA
  "region": "Waikato",              // or "Nationwide", "Online"
  "website": "https://example.com",
  "description": "Up to 300 characters.",
  "isDemo": false,                  // true shows the "Demonstration content" label
  "verifiedDate": "2026-09-20"      // when OffGrid056 last checked the listing; leave out for demo entries
}
```

**House rules:** listings are informational, inclusion is not an endorsement, members do their own checks and
choose their own supplier. OffGrid056 does not guarantee or certify anyone. Demonstration entries must be named
`DEMO: …` and use `https://example.com`. **Do not invent a `verifiedDate`:** set it only when someone has actually
checked the listing, so old entries can be found and reviewed later.

---

## 5. Workshops

`data/workshops/<slug>.json`:

```jsonc
{
  "id": "wks-0006",
  "slug": "water-storage-workshop",
  "title": "Household Water Storage Workshop",
  "startDate": "2026-11-12T18:30:00+13:00",   // ISO with the offset
  "endDate": "2026-11-12T20:00:00+13:00",     // optional
  "timeZone": "Pacific/Auckland",
  "mode": "online",                  // online | in-person | hybrid
  "location": "Online (link sent to registered members)",
  "description": "What the session covers.",
  "foundations": ["water"],
  "bookingUrl": "https://example.com/booking", // optional: an EXTERNAL booking page
  "bookingLabel": "Register for this workshop",// optional button wording
  "videoUrl": "https://vimeo.com/123456789",   // optional recording, added after the event
  "downloads": [{ "label": "Worksheet", "resourceId": "res-0015" }],
  "relatedResources": ["res-0014"],
  "isDemo": false
}
```

- **Upcoming or past is decided in the member's browser**, so a static build never goes stale.
- The **Book / Register** button appears only when `bookingUrl` is set and the event has not happened. There is no
  booking engine in the library, by design.
- Recordings are past workshops with a `videoUrl`; handouts are the `downloads`.

---

## 6. Foundations, categories and resource types

`data/taxonomy/foundations.json` and `data/taxonomy/resource-types.json`. Adding a category is a few lines; a
category with `"matchTypes": ["worksheet"]` collects every worksheet in that foundation automatically.

**Do not change the Five Foundations** (Air, Water, Shelter, Food, Energy). `general` is for cross-cutting
resources and is not a sixth foundation.

---

## 7. What the validator checks

`npm run validate` fails the build on: a malformed file, a duplicate id or slug, a category that does not belong
to its foundation, a reference to a resource that does not exist or is not published, a missing file on disk, a
thumbnail without alt text, a download pack with no items, a programme day that is missing, duplicated or has a
worksheet with no file, a workshop whose end is before its start, a handout pointing at nothing, and a "real"
supplier still using an example.com address. `--release` additionally fails on any remaining demonstration content.
