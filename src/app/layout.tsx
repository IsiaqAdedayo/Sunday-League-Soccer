import AntdProvider from "@/components/AntdProvider";
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "SLS Tournament - Sunday League Soccer",
  description: "Amateur Sunday League Soccer Tournament Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdProvider>
          <div className="field-pattern" />
          {children}
        </AntdProvider>
      </body>
    </html>
  );
}
