import type {Metadata} from "next"
import {Jost, Raleway} from "next/font/google"
import Link from "next/link"
import "./globals.css"

const raleway = Raleway({subsets: ["latin"], variable: "--font-raleway"})
const jost = Jost({subsets: ["latin"], variable: "--font-jost"})

export const metadata: Metadata = {
  title: "Celeste Ellyse",
  description: "Animal communication sessions.",
}

/** Root layout: loads brand fonts and wraps every page. */
export default function RootLayout({children}: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${raleway.variable} ${jost.variable}`}>
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
