import About from "@/components/home/About"
import Hero from "@/components/home/Hero"
import SayHello from "@/components/home/SayHello"
import SessionPaths from "@/components/home/SessionPaths"
import SiteFooter from "@/components/SiteFooter"

/** Home page. */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <SessionPaths />
        <SayHello />
      </main>
      <SiteFooter />
    </>
  )
}
