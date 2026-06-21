import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/context/auth-context"
import { WagmiProvider } from "@/components/providers/WagmiProvider"
import { Toaster } from "react-hot-toast"
import { Providers } from "@/components/providers/WagmiProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" })

export const metadata: Metadata = {
  title: "MatDAO - Fueling Material Science Breakthroughs",
  description:
    "MatDAO is a milestone-driven commercialization platform for advanced materials research. Submit projects, track progress, and unlock funding.",
}

export const viewport: Viewport = {
  themeColor: "#0a0c10",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
