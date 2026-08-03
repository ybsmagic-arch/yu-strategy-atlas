import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export const metadata:Metadata={title:{default:"YMOS Knowledge Platform",template:"%s｜YMOS Knowledge Platform"},description:"六大研究知識庫、中醫藥 AI 知識基礎與 YMOS 跨領域取經系統",icons:{icon:"/yu-tcm-logo.png",apple:"/yu-tcm-logo.png"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body className="paper-noise"><Header/><main>{children}</main><Footer/></body></html>}
