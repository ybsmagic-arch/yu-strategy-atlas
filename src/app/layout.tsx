import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = { title: { default:"余氏案例智庫｜YU Strategy Atlas", template:"%s｜余氏案例智庫" }, description:"以企業、政權、IP、兵法與 YMOS 六層，系統整理每日商業案例。" };

export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="zh-Hant"><body className="paper-noise"><Header/><main>{children}</main><Footer/></body></html> }
