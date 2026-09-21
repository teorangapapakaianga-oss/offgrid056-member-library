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
}: {
  /** verified downloads, by market */
  files: Partial<Record<MarketCode, MarketFile>>;
  title: string;
  updatedDate: string;
  openable?: boolean;
}) {
  const available = Object.keys(files) as MarketCode[];

  return (
    <MarketGate availableMarkets={available}>
      {(market) => {
        const file = market ? files[market] : undefined;
        if (!market || !file) return null; // MarketGate has already explained why
        const info: FileInfo = { ...file, title, updatedDate, openable };
        return (
          <div>
            <DownloadActions file={info} />
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
