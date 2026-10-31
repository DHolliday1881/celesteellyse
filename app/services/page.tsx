import type {Metadata} from "next"
import Image from "next/image"
import Faq from "@/components/services/Faq"
import HowSessionsWork from "@/components/services/HowSessionsWork"
import ServiceList from "@/components/services/ServiceList"
import SiteFooter from "@/components/SiteFooter"
import {images, services} from "@/content/site"
import styles from "./page.module.css"

export const metadata: Metadata = {
  title: "Services · Celeste Ellyse",
}

/** Services page over a night sky that fades into an ocean sunset. */
export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.clouds} aria-hidden="true">
        <Image src={images.servicesClouds} alt="" fill preload sizes="100vw" />
      </div>
      <div className={styles.ocean} aria-hidden="true">
        <Image src={images.servicesOcean} alt="" fill sizes="100vw" />
      </div>

      <main className={styles.main}>
        <header className={styles.title}>
          <p className={`label ${styles.eyebrow}`}>{services.eyebrow}</p>
          <h1 className={styles.heading}>{services.title}</h1>
          <span className={styles.rule} aria-hidden="true" />
        </header>
        <ServiceList groups={services.groups} />
        <HowSessionsWork />
        <Faq />
      </main>

      <SiteFooter />
    </div>
  )
}
