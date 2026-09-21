/**
 * Importer admin review — front end. Plain JavaScript, no build step, no framework: this page is never part of
 * the member site, and keeping it dependency-free is what makes that easy to prove.
 *
 * Every change goes to the local API, which checks the workflow rules before anything is written. The UI
 * disables what is not allowed, but the server is what enforces it.
 */
const view = document.getElementById("view");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const kb = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);
const day = (iso) => (iso ? String(iso).slice(0, 10) : "—");

const api = async (path, options) => {
  const res = await fetch(path, { headers: { "content-type": "application/json" }, ...options });
  const body = await res.json();
  if (!res.ok) throw Object.assign(new Error(body.error ?? "request failed"), { body });
  return body;
};

function toast(message) {
  const el = document.createElement("p");
  el.className = "toast";
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 2600);
}

const CONF_PILL = { HIGH: "green", MEDIUM: "", LOW: "warn" };
const KIND_PILL = { resource: "deep", internal: "mute", asset: "mute", package: "mute" };

/* ---------------------------------------------------------------- dashboard */

function bars(title, data) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, n]) => n));
  return `<section><h3>${esc(title)}</h3><ul class="bars">${entries
    .map(
      ([k, n]) =>
        `<li><span>${esc(k)}</span><span class="track"><span class="fill" style="width:${(n / max) * 100}%"></span></span><span class="n">${n}</span></li>`,
    )
    .join("")}</ul></section>`;
}

async function renderDashboard() {
  const d = await api("/api/dashboard");
  const t = d.totals;
  const stat = (n, label, cls = "") => `<div class="stat ${cls}"><b>${n}</b><span>${esc(label)}</span></div>`;

  view.innerHTML = `
    <h1>Importer dashboard</h1>
    <p class="count">Scanned ${day(d.scannedAt)} · ${d.sources.map((s) => `${esc(s.label)} (${s.files})`).join(" · ")}</p>

    <div class="stats">
      ${stat(t.candidates, "total candidates")}
      ${stat(t.readyToReview, "ready to review")}
      ${stat(t.current, "current")}
      ${stat(t.legacy, "legacy", "flag")}
      ${stat(t.duplicates, "duplicates", "flag")}
      ${stat(t.needsReview, "needs review", "flag")}
      ${stat(t.rejected, "rejected")}
      ${stat(t.readyToImport, "ready to import")}
      ${stat(t.imported, "imported")}
    </div>

    <h2>Not member resources</h2>
    <div class="stats">
      ${stat(t.internal, "internal / source only")}
      ${stat(t.assets, "cover + support assets")}
      ${stat(t.packages, "source packages (zip)")}
      ${stat(d.assetsBrand, "brand / programme artwork")}
      ${stat(d.assetsAttached, "artwork attached to a resource")}
      ${stat(d.assetsNeedingReview, "asset link review", "flag")}
    </div>

    <h2>Findings</h2>
    <div class="stats">
      ${stat(d.legacyFindings, "legacy-brand findings", "flag")}
      ${stat(Object.entries(d.duplicateGroups).reduce((n, [, v]) => n + v, 0), "duplicate groups")}
      ${stat(d.duplicateGroups.EXACT ?? 0, "exact")}
      ${stat(d.duplicateGroups.VERSION_CANDIDATE ?? 0, "version candidates")}
      ${stat(d.duplicateGroups.LIKELY ?? 0, "likely")}
      ${stat(d.onlineOnly, "online-only / skipped")}
      ${stat(d.unreadable, "unreadable", d.unreadable ? "stop" : "")}
    </div>

    <h2>Breakdowns</h2>
    <div class="breakdowns">
      ${bars("Foundation", d.byFoundation)}
      ${bars("Resource type", d.byResourceType)}
      ${bars("Foundation confidence", d.byConfidence)}
      ${bars("Resource-type confidence", d.byTypeConfidence)}
      ${bars("File type", d.byFileType)}
      ${bars("Workflow status", d.byStatus)}
    </div>`;
}

/* ---------------------------------------------------------------- candidate list */

let cache = null;
const filters = { foundation: "", resourceType: "", status: "", confidence: "", legacy: "", duplicate: "", fileType: "", material: "", source: "", ogCode: "", q: "" };

async function ensureCandidates() {
  if (!cache) cache = await api("/api/candidates");
  return cache;
}

function matches(r) {
  const f = filters;
  if (f.foundation && r.foundation !== f.foundation) return false;
  if (f.resourceType && r.resourceType !== f.resourceType) return false;
  if (f.status && r.status !== f.status) return false;
  if (f.confidence && r.confidence !== f.confidence) return false;
  if (f.legacy === "yes" && !r.legacyBranding) return false;
  if (f.legacy === "no" && r.legacyBranding) return false;
  if (f.duplicate && (r.duplicateKind ?? "none") !== f.duplicate) return false;
  if (f.fileType && r.fileType !== f.fileType) return false;
  if (f.material && r.materialKind !== f.material) return false;
  if (f.source && r.sourceLabel !== f.source) return false;
  if (f.ogCode === "(has a code)" && !r.legacyCode) return false;
  if (f.ogCode === "(no code)" && r.legacyCode) return false;
  if (f.ogCode && !f.ogCode.startsWith("(") && r.legacyCode !== f.ogCode) return false;
  if (f.q) {
    const hay = `${r.title} ${r.filename} ${r.legacyCode} ${r.tags.join(" ")}`.toLowerCase();
    if (!hay.includes(f.q.toLowerCase())) return false;
  }
  return true;
}

function select(name, label, options, value) {
  return `<label>${esc(label)}<select data-filter="${name}">
    <option value="">any</option>
    ${options.map((o) => `<option value="${esc(o)}" ${o === value ? "selected" : ""}>${esc(o)}</option>`).join("")}
  </select></label>`;
}

async function renderCandidates() {
  const { rows, vocab } = await ensureCandidates();
  const uniq = (get) => [...new Set(rows.map(get))].filter(Boolean).sort();
  const shown = rows.filter(matches);

  view.innerHTML = `
    <h1>Candidates</h1>
    <div class="filters">
      <label>Search<input type="search" data-filter="q" value="${esc(filters.q)}" placeholder="title, filename, OG code, tag" /></label>
      ${select("foundation", "Foundation", vocab.foundations, filters.foundation)}
      ${select("resourceType", "Resource type", vocab.resourceTypes, filters.resourceType)}
      ${select("status", "Status", uniq((r) => r.status), filters.status)}
      ${select("confidence", "Confidence", ["HIGH", "MEDIUM", "LOW"], filters.confidence)}
      ${select("legacy", "Legacy brand", ["yes", "no"], filters.legacy)}
      ${select("duplicate", "Duplicate", ["EXACT", "LIKELY", "VERSION_CANDIDATE", "none"], filters.duplicate)}
      ${select("ogCode", "OG code", ["(has a code)", "(no code)", ...uniq((r) => r.legacyCode)], filters.ogCode)}
      ${select("fileType", "File type", uniq((r) => r.fileType), filters.fileType)}
      ${select("material", "Material", ["resource", "internal", "asset", "package"], filters.material)}
      ${select("source", "Source folder", vocab.sources, filters.source)}
      <button class="ghost" data-clear>Clear</button>
    </div>

    <p class="count">${shown.length} of ${rows.length} candidates</p>

    <table>
      <thead><tr>
        <th>File</th><th>Material</th><th>Type</th><th>Foundation</th><th>Conf.</th>
        <th>OG</th><th>Legacy</th><th>Duplicate</th><th>Status</th><th>Size</th>
      </tr></thead>
      <tbody>
        ${shown
          .map(
            (r) => `<tr data-id="${esc(r.id)}">
              <td class="file"><a href="#/candidate/${esc(r.id)}">${esc(r.title || r.filename)}</a>
                <small>${esc(r.filename)} · ${esc(r.sourceLabel)}</small></td>
              <td><span class="pill ${KIND_PILL[r.materialKind]}">${esc(r.materialKind)}</span></td>
              <td>${esc(r.resourceType || "—")}</td>
              <td>${esc(r.foundation || "—")}</td>
              <td><span class="pill ${CONF_PILL[r.confidence]}">${esc(r.confidence)}</span></td>
              <td>${esc(r.legacyCode || "—")}</td>
              <td>${r.legacyBranding ? '<span class="pill warn">legacy</span>' : "—"}</td>
              <td>${r.duplicateKind ? `<span class="pill" title="${esc(r.duplicateKind)}">${esc(r.duplicateKind.replace("VERSION_CANDIDATE", "VERSION"))}</span>` : "—"}</td>
              <td><span class="pill ${r.status === "READY_TO_IMPORT" ? "green" : r.status === "NEEDS_REVIEW" ? "warn" : ""}" title="${esc(r.status)}">${esc(r.status.replace(/_/g, " ").toLowerCase())}</span></td>
              <td>${kb(r.sizeBytes)}</td>
            </tr>`,
          )
          .join("")}
      </tbody>
    </table>`;

  view.querySelectorAll("[data-filter]").forEach((el) => {
    const event = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(event, () => {
      filters[el.dataset.filter] = el.value;
      renderCandidates();
    });
  });
  view.querySelector("[data-clear]").addEventListener("click", () => {
    Object.keys(filters).forEach((k) => (filters[k] = ""));
    renderCandidates();
  });
  const search = view.querySelector('[data-filter="q"]');
  if (search === document.activeElement) return;
  if (filters.q) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  }
}

/* ---------------------------------------------------------------- candidate detail */

function inferenceBlock(label, inf) {
  return `<p><strong>${esc(label)}:</strong> ${esc(inf.value ?? "—")}
    <span class="pill ${CONF_PILL[inf.confidence]}">${esc(inf.confidence)}</span></p>
    <ul class="evidence">${inf.evidence.map((e) => `<li>${esc(e)}</li>`).join("") || "<li>no evidence recorded</li>"}</ul>`;
}

function editorField(name, label, value, { type = "text", options = null, low = false, hint = "" } = {}) {
  const input = options
    ? `<select data-draft="${name}">${["", ...options].map((o) => `<option value="${esc(o)}" ${String(o) === String(value ?? "") ? "selected" : ""}>${esc(o || "—")}</option>`).join("")}</select>`
    : type === "textarea"
      ? `<textarea data-draft="${name}">${esc(value ?? "")}</textarea>`
      : `<input type="${type}" data-draft="${name}" value="${esc(value ?? "")}" />`;
  return `<div class="field ${low ? "low" : ""}"><label>${esc(label)}</label>${input}${hint ? `<p class="hint">${esc(hint)}</p>` : ""}</div>`;
}

async function renderDetail(id) {
  const d = await api(`/api/candidate/${encodeURIComponent(id)}`);
  const c = d.candidate;
  const draft = d.draft;
  const vocab = (await ensureCandidates()).vocab;
  const low = (f) => d.lowConfidence.includes(f);
  const categories = vocab.categories[draft.foundation] ?? [];

  view.innerHTML = `
    <a class="back" href="#/candidates">← back to candidates</a>
    <h1>${esc(draft.title || c.source.filename)}</h1>
    <p class="count">
      <span class="pill ${KIND_PILL[c.materialKind]}">${esc(c.materialKind)}</span>
      <span class="pill">${esc(c.source.fileType)}</span>
      <span class="pill ${c.status === "READY_TO_IMPORT" ? "green" : ""}">${esc(d.decision.status)}</span>
      ${c.legacyBranding ? '<span class="pill warn">legacy branding</span>' : ""}
      ${c.reviewFlags.map((f) => `<span class="pill stop">${esc(f)}</span>`).join("")}
    </p>

    ${c.materialKind !== "resource" ? `<div class="warn-note"><strong>Not a member resource.</strong> ${esc(c.importNotes)}</div>` : ""}

    <div class="detail">
      <div>
        <section class="panel">
          <h3>Source facts</h3>
          <dl class="facts">
            <dt>Filename</dt><dd>${esc(c.source.filename)}</dd>
            <dt>Extension</dt><dd>${esc(c.source.extension)}</dd>
            <dt>File size</dt><dd>${kb(c.source.sizeBytes)} (${c.source.sizeBytes.toLocaleString()} bytes)</dd>
            <dt>Modified</dt><dd>${day(c.source.modified)}</dd>
            <dt>Checksum</dt><dd><code>${esc(c.source.checksum.slice(0, 32))}…</code></dd>
            <dt>Source folder</dt><dd>${esc(c.source.sourceLabel)} / ${esc(c.source.folder.split(/[\\/]/).slice(-2).join("/"))}</dd>
          </dl>
          <p class="hint">Source folders are shown here for the admin only. They are never published to the member library.</p>
        </section>

        <section class="panel">
          <h3>Inference</h3>
          ${inferenceBlock("Resource type", c.inferred.resourceType)}
          ${inferenceBlock("Foundation", c.inferred.foundation)}
          ${inferenceBlock("Category", c.inferred.category)}
          ${inferenceBlock("OG code", c.inferred.legacyCode)}
          ${inferenceBlock("Difficulty", c.inferred.difficulty)}
          ${inferenceBlock("Estimated time", c.inferred.estimatedTime)}
        </section>

        <section class="panel">
          <h3>Legacy branding</h3>
          ${
            c.legacyIssues.length
              ? `<ul class="evidence">${c.legacyIssues.map((i) => `<li><strong>${esc(i.issue)}</strong> — ${esc(i.evidence)}</li>`).join("")}</ul>
                 <h4>Migration</h4><ul class="evidence">${c.migrationActions.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>`
              : "<p>None found. The file uses the current brand.</p>"
          }
        </section>

        ${
          d.duplicateGroup
            ? `<section class="panel">
                <h3>Duplicates — ${esc(d.duplicateGroup.groupId)} · ${esc(d.duplicateGroup.kind)}</h3>
                <p>${esc(d.duplicateGroup.reason)}</p>
                ${d.duplicateGroup.contentMismatch ? '<div class="blockers">The PDF and HTML of this document do not match (CONTENT_MISMATCH).</div>' : ""}
                <p><a href="#/duplicates">Open duplicate review →</a></p>
                <ul class="evidence">${d.duplicateGroup.members.filter((m) => m.id !== c.candidateId).map((m) => `<li><a href="#/candidate/${esc(m.id)}">${esc(m.filename)}</a> — ${esc(m.fileType)}, ${kb(m.sizeBytes)}, ${day(m.modified)}</li>`).join("")}</ul>
              </section>`
            : ""
        }

        ${d.textExcerpt ? `<section class="panel"><h3>Extracted text</h3><div class="excerpt">${esc(d.textExcerpt)}</div></section>` : ""}
      </div>

      <div>
        <section class="panel">
          <h3>Proposed library record</h3>
          <div class="two">
            ${editorField("id", "Resource id", draft.id, { hint: 'format "res-0001"' })}
            ${editorField("legacyCode", "Legacy code", draft.legacyCode)}
          </div>
          ${editorField("title", "Title", draft.title, { low: low("title") })}
          ${editorField("slug", "Slug", draft.slug)}
          ${editorField("description", "Description", draft.description, { type: "textarea", hint: "members see this on the card" })}
          <div class="two">
            ${editorField("foundation", "Foundation", draft.foundation, { options: vocab.foundations, low: low("foundation") })}
            ${editorField("category", "Category", draft.category, { options: categories, low: low("category") })}
            ${editorField("resourceType", "Resource type", draft.resourceType, { options: vocab.resourceTypes, low: low("resourceType") })}
            ${editorField("difficulty", "Difficulty", draft.difficulty, { options: vocab.difficulties, low: low("difficulty") })}
            ${editorField("estimatedTime", "Estimated minutes", draft.estimatedTime, { type: "number", low: low("estimatedTime") })}
            ${editorField("status", "Status", draft.status, { options: ["draft", "published", "archived"] })}
          </div>
          ${editorField("tags", "Tags (comma separated)", draft.tags.join(", "))}
          ${editorField("learningObjectives", "Learning objectives (one per line)", draft.learningObjectives.join("\n"), { type: "textarea" })}
          ${editorField("collections", "Collections (comma separated)", draft.collections.join(", "), { hint: vocab.collections.join(" · ") })}
          ${editorField("downloadFile", "Download file", draft.downloadFile)}
          ${editorField("thumbnailCandidateId", "Cover / thumbnail", draft.thumbnailCandidateId ?? "", {
            options: d.attachedAssets.map((a) => a.id),
            hint: d.attachedAssets.length ? d.attachedAssets.map((a) => `${a.id}: ${a.filename} (${a.role})`).join(" · ") : "no artwork has been attached to this resource",
          })}
          <div class="actions">
            <button data-save>Save draft</button>
            <button class="secondary" data-reviewed>Mark guesses as reviewed</button>
          </div>
          <p class="hint">Saving changes the importer workspace only. Source files are never modified.</p>
        </section>

        <section class="panel">
          <h3>Workflow</h3>
          ${
            d.readiness.ok
              ? '<div class="ok-note">This candidate meets every condition for READY_TO_IMPORT.</div>'
              : `<div class="blockers"><strong>Not ready to import:</strong><ul>${d.readiness.blockers.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>`
          }
          <div class="field">
            <label class="check"><input type="checkbox" data-approve ${d.decision.approved ? "checked" : ""} /> I have checked this record and approve it</label>
          </div>
          ${editorField("overrideReason", "Override reason (needed for internal files, artwork and packages)", d.decision.override?.reason ?? "", { type: "textarea" })}
          <div class="actions">
            ${["CURRENT", "LEGACY", "DUPLICATE", "NEEDS_REVIEW", "REJECTED", "READY_TO_IMPORT"]
              .map((s) => `<button class="${s === d.decision.status ? "" : "secondary"}" data-status="${s}">${s.replace(/_/g, " ")}</button>`)
              .join("")}
          </div>
          ${editorField("notes", "Admin notes", d.decision.notes, { type: "textarea" })}
        </section>

        <section class="panel">
          <h3>Preview</h3>
          <div class="card-preview">
            <div class="thumb">${esc(draft.thumbnailCandidateId ? "cover attached" : "no cover")}</div>
            <div class="body">
              <span class="pill deep">${esc(draft.foundation || "—")}</span>
              <h4>${esc(draft.title || "Untitled")}</h4>
              <p>${esc(draft.description || "No description yet — members would see nothing here.")}</p>
              <div class="meta">
                <span class="pill">${esc(draft.resourceType || "type?")}</span>
                <span class="pill">${esc(draft.difficulty)}</span>
                <span class="pill">${esc(draft.estimatedTime || "?")} min</span>
                ${d.preview.downloadable ? `<span class="pill green">${esc(d.preview.fileFormat)} ${kb(c.source.sizeBytes)}</span>` : '<span class="pill mute">no download</span>'}
              </div>
            </div>
          </div>
          <h4>Detail page</h4>
          <dl class="facts">
            <dt>Slug</dt><dd>/library/${esc(draft.slug || "—")}</dd>
            <dt>Objectives</dt><dd>${draft.learningObjectives.length || "none yet"}</dd>
            <dt>Collections</dt><dd>${esc(draft.collections.join(", ") || "none")}</dd>
            <dt>Validation</dt><dd>${d.validation.length ? `<span class="pill stop">${d.validation.length} issue(s)</span>` : '<span class="pill green">passes</span>'}</dd>
          </dl>
          ${c.legacyBranding ? '<div class="warn-note">This resource still carries legacy branding. Re-skinning is Stage 9.9, deferred by the owner.</div>' : ""}
        </section>
      </div>
    </div>`;

  wireDetail(id, d);
}

function collectDraft() {
  const draft = {};
  view.querySelectorAll("[data-draft]").forEach((el) => {
    const name = el.dataset.draft;
    if (name === "overrideReason" || name === "notes") return;
    if (name === "tags" || name === "collections") draft[name] = el.value.split(",").map((s) => s.trim()).filter(Boolean);
    else if (name === "learningObjectives") draft[name] = el.value.split("\n").map((s) => s.trim()).filter(Boolean);
    else if (name === "estimatedTime") draft[name] = Number(el.value) || 0;
    else if (name === "thumbnailCandidateId") draft[name] = el.value || null;
    else draft[name] = el.value;
  });
  return draft;
}

function wireDetail(id, d) {
  const post = async (patch, okMessage) => {
    try {
      await api(`/api/decision/${encodeURIComponent(id)}`, { method: "POST", body: JSON.stringify(patch) });
      cache = null;
      toast(okMessage);
      renderDetail(id);
    } catch (e) {
      const blockers = e.body?.blockers ?? [];
      toast(blockers.length ? `Blocked: ${blockers[0]}` : e.message);
      if (blockers.length) renderDetail(id);
    }
  };

  const overrideValue = () => view.querySelector('[data-draft="overrideReason"]').value.trim();
  const base = () => ({
    draft: collectDraft(),
    notes: view.querySelector('[data-draft="notes"]').value,
    approved: view.querySelector("[data-approve]").checked,
    override: overrideValue() ? { reason: overrideValue(), by: "admin", at: new Date().toISOString() } : null,
  });

  view.querySelector("[data-save]").addEventListener("click", () => post(base(), "Draft saved to the workspace"));
  view.querySelector("[data-reviewed]").addEventListener("click", () =>
    post({ ...base(), reviewedFields: d.lowConfidence }, "Low-confidence guesses marked as reviewed"),
  );
  view.querySelectorAll("[data-status]").forEach((btn) =>
    btn.addEventListener("click", () => post({ ...base(), status: btn.dataset.status }, `Moved to ${btn.dataset.status.replace(/_/g, " ")}`)),
  );
}

/* ---------------------------------------------------------------- duplicates */

async function renderDuplicates() {
  const { groups } = await api("/api/duplicates");

  view.innerHTML = `
    <h1>Duplicate review</h1>
    <p class="count">${groups.length} groups. Nothing is deleted and no winner is chosen automatically — every group is your decision.</p>
    ${groups
      .map(
        (g) => `<section class="panel">
          <h3>${esc(g.groupId)} — ${esc(g.kind)}${g.pdfHtmlPair ? " · PDF/HTML pair" : ""}</h3>
          <p>${esc(g.reason)}</p>
          ${g.contentMismatch ? '<div class="blockers">CONTENT_MISMATCH: the two versions do not say the same thing.</div>' : ""}
          <div class="dup-grid">
            ${g.members
              .map(
                (m) => `<div class="dup-card ${m.disposition === "KEEP" ? "kept" : ""}" data-member="${esc(m.id)}">
                  <strong>${esc(m.title || m.filename)}</strong>
                  <dl class="facts">
                    <dt>File</dt><dd>${esc(m.filename)}</dd>
                    <dt>Type</dt><dd>${esc(m.fileType)}</dd>
                    <dt>Size</dt><dd>${kb(m.sizeBytes)}</dd>
                    <dt>Modified</dt><dd>${day(m.modified)}</dd>
                    <dt>Checksum</dt><dd><code>${esc(m.checksum.slice(7, 19))}…</code></dd>
                    <dt>Branding</dt><dd>${m.legacyBranding ? '<span class="pill warn">legacy</span>' : '<span class="pill green">current</span>'}</dd>
                    <dt>Text</dt><dd>${m.textLength.toLocaleString()} chars</dd>
                    <dt>Source</dt><dd>${esc(m.sourceLabel)}</dd>
                    <dt>Decision</dt><dd>${m.disposition ? `<span class="pill deep">${esc(m.disposition)}</span>` : '<span class="pill mute">none yet</span>'}</dd>
                  </dl>
                  <div class="dup-actions">
                    ${["KEEP", "ARCHIVE", "REVIEW", "IGNORE"].map((a) => `<button class="${m.disposition === a ? "" : "secondary"}" data-dispose="${a}">${a}</button>`).join("")}
                  </div>
                  <p class="hint"><a href="#/candidate/${esc(m.id)}">open candidate →</a></p>
                </div>`,
              )
              .join("")}
          </div>
        </section>`,
      )
      .join("")}`;

  view.querySelectorAll("[data-member]").forEach((card) => {
    card.querySelectorAll("[data-dispose]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        await api(`/api/decision/${encodeURIComponent(card.dataset.member)}`, {
          method: "POST",
          body: JSON.stringify({ disposition: btn.dataset.dispose }),
        });
        cache = null;
        toast(`${card.dataset.member}: ${btn.dataset.dispose}`);
        renderDuplicates();
      }),
    );
  });
}

/* ---------------------------------------------------------------- routing */

async function route() {
  const hash = location.hash || "#/dashboard";
  const [, page, arg] = hash.split("/");
  document.querySelectorAll(".tabs a").forEach((a) => a.removeAttribute("aria-current"));
  const tab = document.querySelector(`.tabs a[data-tab="${page === "candidate" ? "candidates" : page}"]`);
  if (tab) tab.setAttribute("aria-current", "page");

  try {
    if (page === "candidates") await renderCandidates();
    else if (page === "candidate") await renderDetail(arg);
    else if (page === "duplicates") await renderDuplicates();
    else await renderDashboard();
  } catch (e) {
    view.innerHTML = `<div class="blockers">${esc(e.message)}</div>`;
  }
}

window.addEventListener("hashchange", route);
route();
