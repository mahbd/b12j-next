import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./NavBar";
import AuthProvider from "./Provider";

export const metadata: Metadata = {
  title: "CPCCB",
  description:
    "An online platform for competitive programming contests and tutorials.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="winter">
      <body>
        <AuthProvider>
          <NavBar />
          <div className="horizontal-center lg:max-w-4xl w-full mx-5 md:mx-10 lg:mx-auto p-2">
            {/* <div className="hidden md:block">
              <Sidebar />
            </div> */}
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
