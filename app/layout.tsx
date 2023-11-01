import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@/app/_lib/AntdRegistry";
import Header from "./_components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Café & Badminton & Code!",
  description: "Café & Badminton & Code!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerHeight = 40;
  // font artist family see: https://www.fontgenerator.art/
  const headerTitle = "𝕮𝖆𝖋𝖊, 𝕭𝖆𝖉𝖒𝖎𝖓𝖙𝖔𝖓 𝖆𝖓𝖉 𝕮𝖔𝖉𝖊";
  const headerTabs = [
    { name: "𝔥𝔬𝔪𝔢", href: "/" },
    { name: "𝔴𝔦𝔨𝔦", href: "/wiki" },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <Header
            title={headerTitle}
            img={"/logo.svg"}
            tabs={headerTabs}
            height={headerHeight}
          />
          <div style={{ height: `calc(100vh - ${headerHeight}px)` }}>
            {children}
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
