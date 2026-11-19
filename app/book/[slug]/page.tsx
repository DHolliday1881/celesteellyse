import type {Metadata} from "next"
import {notFound} from "next/navigation"
import IntakeForm from "@/components/book/IntakeForm"
import NightSkyLoader from "@/components/NightSkyLoader"
import SiteFooter from "@/components/SiteFooter"
import {booking} from "@/content/booking"
import styles from "./page.module.css"

export const dynamicParams = false

/** One booking page per intake form. */
export function generateStaticParams() {
  return booking.forms.map(({slug}) => ({slug}))
}

/** Title and description for a booking page. */
export async function generateMetadata(props: PageProps<"/book/[slug]">): Promise<Metadata> {
  const {slug} = await props.params
  const form = booking.forms.find((item) => item.slug === slug)
  return {
    title: `Book: ${form?.title} · Celeste Ellyse`,
    description: booking.intro,
  }
}

/** Booking page: the intake form in a card on the starry navy sky, then the session's calendar. */
export default async function BookPage(props: PageProps<"/book/[slug]">) {
  const {slug} = await props.params
  const form = booking.forms.find((item) => item.slug === slug)
  if (!form) notFound()

  return (
    <div className={styles.page}>
      <NightSkyLoader />
      <main className={styles.main}>
        <IntakeForm form={form} />
      </main>
      <SiteFooter />
    </div>
  )
}
