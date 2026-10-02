import type {Metadata} from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "Celeste Ellyse",
  description: "Animal communication sessions.",
}

export default function RootLayout({children}: LayoutProps<"/">) {
  return (
    <html lang="en">
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
