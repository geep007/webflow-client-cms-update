import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "CMS Editor",
  description: "Content management editor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="min-h-screen bg-white">
            <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <a href="/" className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                  Content Editor
                </a>
              </div>
            </header>
            <main className="max-w-5xl mx-auto px-6 py-10">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
