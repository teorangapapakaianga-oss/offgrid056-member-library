"use client";

/**
 * The download for a resource whose file differs by market.
 *
 * The member sees **one** file: theirs. Two countries' emergency guidance side by side would invite picking
 * the wrong one, and that is the failure this whole layer exists to prevent.
 *
 * If their market has no verified file, nothing is offered and the reason is given. There is no fallback to
 * another country's download — fail closed, per the owner ruling.
 */
import { MarketGate } from "@/components/member/market-controls";
import { DownloadActions, type FileInfo } from "@/components/resources/download-actions";
import { Icon } from "@/components/ui/icon";
import { companionForMarket, type CompanionFile } from "@/lib/content/companions";
import { formatBytes } from "@/lib/format-bytes";
import { marketName, type MarketCode } from "@/lib/member/market";

export interface MarketFile {
  fileUrl: string;
  format: string;
  sizeBytes: number | null;
}

export function MarketDownload({
  files,
  title,
  updatedDate,
  openable = true,
  companions,
}: {
  /** verified downloads, by market */
  files: Partial<Record<MarketCode, MarketFile>>;
  title: string;
  updatedDate: string;
  openable?: boolean;
  /** editable versions by market (Stage 11.0J): offered as a secondary option beside the chosen market's own file */
  companions?: Partial<Record<MarketCode, CompanionFile>>;
}) {
  const available = Object.keys(files) as MarketCode[];

  return (
    <MarketGate availableMarkets={available}>
      {(market) => {
        const file = market ? files[market] : undefined;
        if (!market || !file) return null; // MarketGate has already explained why
        const info: FileInfo = { ...file, title, updatedDate, openable };
        const companion = companionForMarket(companions, files, market);
        return (
          <div>
            <DownloadActions file={info} />
            {companion && (
              <p className="mt-3 border-t border-og-line pt-3">
                <a href={companion.fileUrl} download className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-og-deep underline-offset-2 hover:underline">
                  <Icon name="download" className="size-4" />
                  Editable version
                  <span className="sr-only"> of {title} for {marketName(market)} (Word document)</span>
                </a>
                <span className="block text-xs text-og-taupe">
                  Word document · {formatBytes(companion.sizeBytes)} · {marketName(market)} edition
                </span>
              </p>
            )}
            <p className="mt-2 text-xs text-og-taupe">
              This version is for <strong className="font-semibold text-og-charcoal">{marketName(market)}</strong> —
              emergency numbers and local guidance match your market.
            </p>
          </div>
        );
      }}
    </MarketGate>
  );
}
