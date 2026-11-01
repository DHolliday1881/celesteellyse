// Brand
export const brand = {
  name: "Celeste Ellyse",
  email: "hello@celesteellyse.com",
  emailPrompt: "Questions? Email me",
  disclaimer: "I'm not a veterinarian or doctor. Sessions don't replace professional care.",
}

// Social
export const social = [
  {label: "Instagram", href: "https://instagram.com/celeste.ellyse"},
  {label: "TikTok", href: "https://tiktok.com/@celeste.ellyse"},
]

// Navigation
export const nav = [
  {label: "Home", href: "/"},
  {label: "Services", href: "/services"},
]

// Images
export const images = {
  homeHero: "/images/home-hero.jpg",
  aboutPortrait: "/images/about-portrait.png",
  bookAnimal: "/images/book-animal.jpg",
  bookYou: "/images/book-you.jpg",
  servicesClouds: "/images/night-clouds.jpeg",
  servicesOcean: "/images/sunset-ocean.jpeg",
  moonCrescent: "/images/crescent-moon.png",
  moonQuarter: "/images/quarter-moon.png",
  moonWaxing: "/images/waxing-moon.png",
  moonFull: "/images/full-moon.png",
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

export type BookingOption = {price: string; duration: string; url: string}

export type Service = {
  id: string
  name: string
  summary: string
  options: BookingOption[]
  details: ServiceDetail[]
  note?: string
}

export type ServiceGroup = {id: string; name: string; services: Service[]}

const details = (whatItIs: string, howItWorks: string, whatYouReceive: string): ServiceDetail[] => [
  {label: "What it is", body: whatItIs},
  {label: "How it works", body: howItWorks},
  {label: "What you receive", body: whatYouReceive},
]

const addReikiNote = "Want to add Reiki? Book Animal Reiki separately. Many people like it after their session arrives."

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
          summary:
            "A written conversation with your animal, living or passed, with up to 5 of your questions. Sessions run 45 to 60 minutes.",
          options: [
            {
              price: "$180",
              duration: "45 min",
              url: "https://cal.com/celesteellyse/animal-communication",
            },
          ],
          details: details(
            "I connect with your animal and write down everything they share through words, images, and feelings: who they are, how they feel, and their answers to your questions. For animals who have passed, it's a chance to hear from them again.",
            "When you book, share their name and your questions, plus their age and who they live with if they're living. Then reply to your confirmation email with a clear photo, eyes visible.",
            "Your written session by email within 7 days: what your animal shared, what they showed me, and their answers to each of your questions. It's yours to keep and come back to whenever you want to hear from them again.",
          ),
          note: addReikiNote,
        },
        {
          id: "two-animal-session",
          name: "Two-animal session",
          summary:
            "Two animals in one written session, living or passed, with up to 3 questions each. Sessions run 60 to 75 minutes.",
          options: [
            {
              price: "$240",
              duration: "60 min",
              url: "https://cal.com/celesteellyse/two-animal-session",
            },
          ],
          details: details(
            "The same written conversation, with two animals. They can share a home, or one can be here and one passed.",
            "When you book, share each animal's name and your questions. For living animals, also tell me their age and who they live with. Then reply to your confirmation email with a clear photo of each, eyes visible.",
            "One written session by email within 7 days, with each animal in their own voice and their answers to your questions. Yours to keep and come back to.",
          ),
          note: addReikiNote,
        },
        {
          id: "animal-reiki",
          name: "Animal Reiki",
          summary: "Distance Reiki while your animal rests at home. Sessions run 20 to 25 minutes.",
          options: [
            {
              price: "$50",
              duration: "20 min",
              url: "https://cal.com/celesteellyse/animal-reiki",
            },
          ],
          details: details(
            "Gentle energy work for calm and balance. It's lovely during stressful stretches, recovery, older age, or big changes, or as a follow-up after a communication session. Animals carry a different energy than people, so Reiki meets them differently, and a shorter session is all they need.",
            "Pick a time, and share your animal's name and a photo. Your animal can rest wherever they like, with no need to keep them still. I'll text you right before I begin.",
            "A follow-up by email or phone call, sharing what I felt and saw during the session.",
          ),
        },
      ],
    },
    {
      id: "you",
      name: "For you",
      services: [
        {
          id: "distance-reiki",
          name: "Distance Reiki",
          summary: "Reiki from a distance while you rest somewhere comfortable.",
          options: [
            {
              price: "$100",
              duration: "45 min",
              url: "https://cal.com/celesteellyse/distance-reiki",
            },
            {
              price: "$80",
              duration: "30 min",
              url: "https://cal.com/celesteellyse/distance-reiki-30",
            },
          ],
          details: details(
            "Gentle energy work, sent to you wherever you are. It's lovely when you're stressed, grieving, worn out, or in the middle of a big change. Some people feel warmth or deep calm during the session, and some notice the shift in the days after.",
            "Pick a time and tell me where you'll be. Lie down somewhere quiet, and I'll text you before I begin. All you have to do is rest.",
            "A follow-up by email or phone call, sharing what I felt and saw during your session.",
          ),
        },
      ],
    },
  ] satisfies ServiceGroup[],
  howItWorks: {
    eyebrow: "How it works",
    heading: "Four steps, start to finish",
    moons: [images.moonCrescent, images.moonQuarter, images.moonWaxing, images.moonFull],
    tabs: [
      {
        id: "animal-communication",
        label: "Animal communication",
        steps: [
          {title: "Book and pay", body: "Pick your session and any open time to hold your spot."},
          {title: "Share their details", body: "Their name, your questions, and a clear photo with their eyes visible."},
          {title: "I tune in", body: "I sit quietly with your animal and write down everything they share."},
          {title: "Your session arrives", body: "Your written session arrives by email within 7 days."},
        ],
      },
      {
        id: "distance-reiki",
        label: "Distance Reiki",
        steps: [
          {title: "Book a time", body: "Pick the time that works best for you."},
          {
            title: "Tell me who it's for",
            body: "For you, your name and the city you'll be in. For your animal, their name and a photo.",
          },
          {
            title: "Rest",
            body: "I'll text you before I begin. Lie down somewhere quiet, or let your animal rest wherever they like.",
          },
          {
            title: "Afterward",
            body: "A follow-up by email or phone call, sharing what I felt and saw during your session.",
          },
        ],
      },
    ],
  },
  faq: {
    eyebrow: "Good to know",
    heading: "Questions & policies",
    groups: [
      {
        label: "Sessions",
        items: [
          {
            question: "Do I need to be there for a written session?",
            answer:
              "No. Written sessions aren't live. The time you pick when booking just holds your spot, and your written session arrives by email within 7 days.",
          },
          {
            question: "Can you connect with an animal who has passed?",
            answer:
              "Yes. Just share their name and a clear photo of them, and I'll connect with them the same way.",
          },
          {
            question: "What do I need to send you?",
            answer:
              "For animal communication: their name, your questions, and a clear photo with their eyes visible. For a living animal, also their age and who they live with. Reply to your confirmation email with the photo. For Animal Reiki: their name and a photo. For Distance Reiki: your name and the city you'll be in.",
          },
          {
            question: "What happens during a Reiki session?",
            answer:
              "At your booked time, I'll text you before I begin. Lie down somewhere quiet, or let your animal rest wherever they like. They don't need to stay still. Afterward, I'll follow up by email or phone call with what I felt and saw.",
          },
          {
            question: "Does distance matter?",
            answer:
              "Not at all. Every session happens from a distance, wherever you and your animal are.",
          },
        ],
      },
      {
        label: "Policies",
        items: [
          {
            question: "Are you a vet or doctor?",
            answer:
              "No. I'm not a veterinarian, doctor, or therapist, and my sessions aren't medical care. I don't diagnose, treat, or give medical advice, and nothing I share replaces care from a professional. If your animal is sick, hurt, or acting differently, please see your vet first, and please don't stop or delay any treatment because of a session. Sessions aren't for emergencies.",
          },
          {
            question: "Can a session change my animal's behavior?",
            answer:
              "Animals have their own minds. A session can help you understand what's going on for them, but I can't promise a change or specific answers. For ongoing behavior concerns, a trainer or your vet is a great partner.",
          },
          {
            question: "Do you help find missing animals?",
            answer:
              "Not right now. I'm not taking missing animal cases at this time. If your animal is missing, contact local shelters and your microchip company, and post in neighborhood groups.",
          },
          {
            question: "Cancellations & refunds",
            answer:
              "You can cancel for a full refund up to 48 hours before the time you booked. For written sessions, that's the date you picked when booking. After that, refunds aren't available, but you can still reschedule up to 24 hours before, from your confirmation email.",
          },
          {
            question: "Who can book?",
            answer:
              "Sessions are for ages 18 and up, and I only connect with an animal when their guardian has asked me to.",
          },
        ],
      },
    ],
  },
}
