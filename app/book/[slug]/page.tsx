import type {Metadata} from "next"
import Link from "next/link"
import {notFound} from "next/navigation"
import IntakeForm from "@/components/book/IntakeForm"
import NightSkyLoader from "@/components/NightSkyLoader"
import SiteFooter from "@/components/SiteFooter"
import {booking, findChoice, sessionHeader} from "@/content/booking"
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
  const {option} = await props.searchParams
  const header = form && sessionHeader(form, findChoice(form, typeof option === "string" ? option : undefined))
  return {
    title: `Book ${header?.name} · Celeste Ellyse`,
    description: booking.intro,
  }
}

/** Booking page: the session's name, price and a Change link above the intake form card, then the session's calendar. */
export default async function BookPage(props: PageProps<"/book/[slug]">) {
  const {slug} = await props.params
  const form = booking.forms.find((item) => item.slug === slug)
  if (!form) notFound()
  const {option} = await props.searchParams
  const choice = findChoice(form, typeof option === "string" ? option : undefined)
  const header = sessionHeader(form, choice)

  return (
    <div className={styles.page}>
      <NightSkyLoader />
      <main className={styles.main}>
        <header className={styles.header}>
          <p className={`label ${styles.eyebrow}`}>· {booking.eyebrow} ·</p>
          <h1 className={styles.title}>{header.name}</h1>
          <p className={styles.details}>
            {header.from && <span>{booking.from} </span>}
            <span className={styles.price}>{header.price}</span>
            {header.duration && (
              <>
                <span aria-hidden="true"> · </span>
                <span>{header.duration}</span>
              </>
            )}
            <span aria-hidden="true"> · </span>
            <Link href={`/services#session-${header.card}`} className={styles.change}>
              {booking.change}
              <span className="visually-hidden"> session</span>
            </Link>
          </p>
        </header>
        <IntakeForm form={form} initialChoice={choice} />
      </main>
      <SiteFooter />
    </div>
  )
}
