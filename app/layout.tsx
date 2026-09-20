import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MemberSidebar } from "@/components/layout/member-sidebar";
import { ShellChrome } from "@/components/layout/shell";
import "./globals.css";

// Self-hosted brand fonts (the approved files from the Household Resilience Guide, SIL OFL 1.1, licences alongside).
const bebas = localFont({
  src: "../styles/fonts/BebasNeue-Regular.woff2",
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

// Only the three weights the interface actually uses: body 400, semibold 600 and bold 700 (for <strong>).
// Italic and Medium were declared but never used, and cost about 158 KB on first load.
const montserrat = localFont({
  src: [
    { path: "../styles/fonts/Montserrat-Regular.woff", weight: "400", style: "normal" },
    { path: "../styles/fonts/Montserrat-SemiBold.woff", weight: "600", style: "normal" },
    { path: "../styles/fonts/Montserrat-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: { default: "Member Resource Library | OffGrid056", template: "%s | OffGrid056 Member Library" },
  description: "OffGrid056 member resources for household resilience across the Five Foundations: Air, Water, Shelter, Food and Energy.",
  // V1: a members' library must not appear in search engines (architecture §12).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#11130F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NZ" className={`${bebas.variable} ${montserrat.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-og-green px-4 py-3 font-semibold text-og-charcoal focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <div className="lg:flex">
          <MemberSidebar />
          <div className="min-w-0 flex-1">
            <ShellChrome>
              <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1400px] px-4 pt-6 pb-28 focus:outline-none sm:px-6 md:pb-12 lg:px-10 lg:pt-8">
                {children}
              </main>
              <footer className="mx-auto max-w-[1400px] px-4 pb-28 text-xs text-og-taupe sm:px-6 md:pb-8 lg:px-10">
                <div className="border-t border-og-line pt-4">
                  <p>
                    <span className="font-semibold text-og-deep">Prepared, not panicked.</span> OffGrid056 · Prepare • Adapt • Thrive
                  </p>
                  <p className="mt-1">Member Resource Library V1: demonstration content only. Final resources will be added later.</p>
                </div>
              </footer>
            </ShellChrome>
          </div>
        </div>
      </body>
    </html>
  );
}
