import type {Metadata} from "next"
import {Jost, Raleway} from "next/font/google"
import Analytics from "@/components/Analytics"
import SiteNav from "@/components/SiteNav"
import "./globals.css"

const raleway = Raleway({subsets: ["latin"], variable: "--font-raleway"})
const jost = Jost({subsets: ["latin"], variable: "--font-jost"})

export const metadata: Metadata = {
  metadataBase: new URL("https://celesteellyse.com"),
  title: "Celeste Ellyse",
  description:
    "Animal communication, animal mediumship, and Reiki with Celeste Ellyse, an animal communicator and Reiki master in New York City. Written sessions and distance Reiki for animals and people.",
}

/** Root layout: loads brand fonts and wraps every page. */
export default function RootLayout({children}: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${raleway.variable} ${jost.variable}`}>
      <body>
        <SiteNav />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
