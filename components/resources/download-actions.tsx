import { Icon } from "@/components/ui/icon";
import { formatBytes, formatDate } from "@/lib/format-bytes";

export interface FileInfo {
  fileUrl: string;
  format: string;
  sizeBytes: number | null;
  updatedDate: string;
  title: string;
  /** PDFs open in a browser tab; everything else is download-only */
  openable: boolean;
}

/**
 * Open / Download actions (Stage 5). A large PDF is never embedded in the page: "Open" hands it to the browser's
 * own viewer in a new tab, and "Download" saves it. Nothing is fetched until the member chooses.
 */
export function DownloadActions({ file, compact = false }: { file: FileInfo; compact?: boolean }) {
  const meta = `${file.format} · ${formatBytes(file.sizeBytes)} · updated ${formatDate(file.updatedDate)}`;
  return (
    <div className={compact ? "flex flex-wrap items-center gap-2" : "flex flex-col gap-3"}>
      <div className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        {file.openable && (
          <a
            href={file.fileUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-og-charcoal px-4 text-sm font-semibold text-og-white hover:bg-og-deep"
          >
            <Icon name="library" className="size-5" />
            Open
            <span className="sr-only"> {file.title} in a new tab</span>
          </a>
        )}
        <a
          href={file.fileUrl}
          download
          className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold ${
            file.openable ? "bg-white text-og-charcoal ring-1 ring-og-taupe/40 hover:ring-og-deep" : "bg-og-charcoal text-og-white hover:bg-og-deep"
          }`}
        >
          <Icon name="download" className="size-5" />
          Download
          <span className="sr-only"> {file.title}</span>
        </a>
      </div>
      <p className={`text-xs text-og-taupe ${compact ? "" : "text-center sm:text-left"}`}>{meta}</p>
    </div>
  );
}
