// Brand
export const brand = {
  name: "Celeste Ellyse",
  email: "hello@celesteellyse.com",
  disclaimer:
    "Animal communication and Reiki are complementary practices and not a substitute for veterinary, medical or psychological care.",
}

// Social
export const social = [
  {label: "Instagram", href: "https://instagram.com/celeste.ellyse"},
  {label: "TikTok", href: "https://tiktok.com/@celeste.ellyse"},
]

export const socialHandle = "@celeste.ellyse"

// Navigation
export const nav = [
  {label: "Home", href: "/"},
  {label: "Services", href: "/services"},
]

// Images
export const images = {
  homeHero: "/images/home-hero.jpg",
  aboutPortrait: "/images/about-portrait.jpg",
  bookAnimal: "/images/book-animal.jpg",
  bookYou: "/images/book-you.jpg",
  servicesClouds: "/images/services-clouds.jpg",
  servicesOcean: "/images/services-ocean.jpg",
  moons: [
    "/images/crescent-moon.png",
    "/images/quarter-moon.png",
    "/images/waxing-moon.png",
    "/images/full-moon.png",
  ],
}

// Home
export const home = {
  hero: {
    eyebrow: "Intuitive · Animal communicator · Reiki master",
    tagline: "Lorem ipsum dolor sit amet, consectetur.",
    cta: {label: "Book a session", href: "/services"},
  },
  about: {
    eyebrow: "About",
    heading: "Hi, I'm Celeste.",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    portraitAlt: "Portrait of Celeste",
  },
  book: {
    eyebrow: "Sessions",
    heading: "Book with me",
    intro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    options: [
      {
        title: "For your animal",
        line: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        image: images.bookAnimal,
        imageAlt: "",
        cta: {label: "Book for your animal", href: "/services#animal"},
      },
      {
        title: "For you",
        line: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        image: images.bookYou,
        imageAlt: "",
        cta: {label: "Book for you", href: "/services#you"},
      },
    ],
  },
}

// Services
export type ServiceDetail = {label: string; body: string}

export type Service = {
  id: string
  name: string
  summary: string
  price: string
  bookingUrl: string
  details: ServiceDetail[]
}

export type ServiceGroup = {id: string; name: string; services: Service[]}

const detailsPlaceholder: ServiceDetail[] = [
  {label: "What it is", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."},
  {label: "How it works", body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo."},
  {label: "What you receive", body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla."},
]

export const services = {
  eyebrow: "Sessions for animals & people",
  title: "Services",
  groups: [
    {
      id: "animal",
      name: "For your animal",
      services: [
        {
          id: "animal-communication",
          name: "Animal communication",
          summary: "A written session with your animal, living or passed, with up to 5 of your questions.",
          price: "$180",
          bookingUrl: "#",
          details: detailsPlaceholder,
        },
        {
          id: "two-animal-session",
          name: "Two-animal session",
          summary: "Both animals in one written session, up to 3 questions each.",
          price: "$240",
          bookingUrl: "#",
          details: detailsPlaceholder,
        },
        {
          id: "animal-communication-reiki",
          name: "Animal communication + Reiki",
          summary: "A written session plus up to 20 minutes of distance Reiki for your animal.",
          price: "$225",
          bookingUrl: "#",
          details: detailsPlaceholder,
        },
        {
          id: "animal-reiki",
          name: "Animal Reiki",
          summary: "Up to 20 minutes of distance Reiki while your animal rests at home.",
          price: "$50",
          bookingUrl: "#",
          details: detailsPlaceholder,
        },
      ],
    },
    {
      id: "you",
      name: "For you",
      services: [
        {
          id: "distance-reiki",
          name: "Distance Reiki for people",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
          price: "Price TBD",
          bookingUrl: "#",
          details: detailsPlaceholder,
        },
      ],
    },
  ] satisfies ServiceGroup[],
  howItWorks: {
    eyebrow: "How it works",
    heading: "How sessions work",
    steps: [
      {title: "Book and pay", body: "Choose your session and book it here."},
      {title: "Share their details", body: "Your animal's details and a photo with their eyes visible."},
      {title: "I tune in", body: "I sit quietly with your animal and listen."},
      {title: "Your session arrives", body: "Your written session arrives by email within 7 days."},
    ],
  },
  faq: {
    eyebrow: "Good to know",
    heading: "Questions & policies",
    items: [
      {
        question: "When will my session arrive?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        question: "Cancellations & refunds",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      },
      {
        question: "A note on care",
        answer: brand.disclaimer,
      },
    ],
  },
}
