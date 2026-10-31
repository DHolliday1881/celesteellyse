import About from "@/components/home/About"
import Hero from "@/components/home/Hero"
import SiteFooter from "@/components/SiteFooter"

/** Home page. */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
      </main>
      <SiteFooter />
    </>
  )
}
