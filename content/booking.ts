// Booking intake forms, posted to Netlify Forms; every field name must also be in public/__forms.html
import {services} from "./site"

/** Points every Cal.com embed at the $1 test events; set to false to book the real events. */
export const USE_TEST_EVENTS = true

export const CAL_USER = "celesteellyse"

export type IntakeField =
  | {kind: "text" | "email" | "tel" | "textarea"; name: string; label: string; hint?: string; required?: boolean; autoComplete?: string}
  | {kind: "photo"; name: string; label: string; required?: boolean}
  | {kind: "choice"; name: string; label: string; options: string[]; required?: boolean}
  | {kind: "heading"; label: string}

export type IntakePage = {label: string; fields: IntakeField[]}

export type CalEvent = {event: string; testEvent: string}

export type SessionChoice = CalEvent & {option: string; label: string; price: string; duration?: string}

export type IntakeForm = {
  slug: string
  formName: string
  title: string
  pages: IntakePage[]
  booking: CalEvent | {choices: SessionChoice[]}
}

// Shared questions
const firstName: IntakeField = {kind: "text", name: "first-name", label: "Your first name", required: true, autoComplete: "given-name"}
const email: IntakeField = {
  kind: "email",
  name: "email",
  label: "Your email",
  hint: "Use the same one when you book.",
  required: true,
  autoComplete: "email",
}
const phone = (hint: string): IntakeField => ({kind: "tel", name: "phone", label: "Your phone number", hint, required: true, autoComplete: "tel"})
const livingOrPassed = (name: string, label: string): IntakeField => ({kind: "choice", name, label, options: ["Living", "Passed"], required: true})
const questions = (prefix: string, count: number): IntakeField[] =>
  Array.from({length: count}, (_, index) => ({kind: "text", name: `${prefix}question-${index + 1}`, label: `Question ${index + 1}`}))
const anythingElse: IntakeField = {kind: "textarea", name: "anything-else", label: "Anything else you’d like me to know?"}
const sharing = (nameLabel: string, photoLabel: string): IntakePage => ({
  label: "Sharing",
  fields: [
    {kind: "heading", label: "Optional. I’ll only share what you say yes to, and you can change your mind any time."},
    {kind: "choice", name: "share-name", label: nameLabel, options: ["Yes", "No"]},
    {kind: "choice", name: "share-photo", label: photoLabel, options: ["Yes", "No"]},
    {
      kind: "choice",
      name: "share-reading",
      label: "Can I share parts of the reading?",
      options: ["Yes", "No", "Let’s decide together after I read it"],
    },
  ],
})
const aboutAnimal: IntakeField[] = [
  {kind: "text", name: "animal-name", label: "Your animal’s name", required: true},
  {kind: "photo", name: "photo", label: "A photo of your animal, with their eyes visible", required: true},
  livingOrPassed("living-or-passed", "Is your animal living, or have they passed?"),
  {kind: "text", name: "age", label: "Age", hint: "If living."},
  {kind: "text", name: "sex", label: "Sex", required: true},
  {kind: "text", name: "humans", label: "The humans in their life"},
  {kind: "text", name: "other-animals", label: "Other animals in the home"},
]

export const booking = {
  eyebrow: "Book",
  change: "Change",
  from: "From",
  session: {field: "session", notChosen: "Not chosen yet (picked after the form)"},
  intro: "Takes a few minutes. After this, you’ll pick your time.",
  progress: (page: number, total: number) => `${page} of ${total}`,
  buttons: {next: "Next", back: "Back", submit: "Submit & pick a time", submitShort: "Submit", sending: "Sending…", retry: "Try again"},
  photo: {
    choose: "Choose a photo",
    change: "Choose a different photo",
    preparing: "Getting your photo ready…",
    tooBig: "That photo is too large to send. Please choose a different photo.",
    notImage: "Please choose a photo (an image file).",
  },
  errors: {
    required: "Please fill this in.",
    email: "That email doesn’t look quite right.",
    phone: "Please add a phone number I can text.",
    choice: "Please choose one.",
    photo: "Please add a photo.",
    send: "Something went wrong sending your form. Your answers are still here. Please try again.",
    tooLarge: "Your photos are too large to send together. Please choose smaller photos.",
  },
  thanks: "Thank you! Now pick your time.",
  choose: "Which session would you like?",
  trouble: "Trouble booking? Open the booking page",
  forms: [
    {
      slug: "animal-communication",
      formName: "intake-animal-communication",
      title: "Tell me about your animal",
      pages: [
        {label: "About you", fields: [firstName, email]},
        {label: "About your animal", fields: aboutAnimal},
        {
          label: "Your questions",
          fields: [{kind: "heading", label: "Your questions for your animal (up to 5, optional)"}, ...questions("", 5), anythingElse],
        },
        sharing("Can I use your animal’s name?", "Can I use their photo?"),
      ],
      booking: {event: "animal-communication", testEvent: "test-communication"},
    },
    {
      slug: "two-animals",
      formName: "intake-two-animals",
      title: "Tell me about your animals",
      pages: [
        {label: "About you", fields: [firstName, email]},
        {
          label: "Your first animal",
          fields: [
            {kind: "text", name: "animal-1-name", label: "Your first animal’s name", required: true},
            {kind: "photo", name: "animal-1-photo", label: "A photo of your first animal, with their eyes visible", required: true},
            livingOrPassed("animal-1-living-or-passed", "Is your first animal living, or have they passed?"),
            {kind: "text", name: "animal-1-age", label: "Age", hint: "If living."},
            {kind: "text", name: "animal-1-sex", label: "Sex", required: true},
            {kind: "text", name: "humans", label: "The humans in their life"},
            {kind: "text", name: "other-animals", label: "Other animals in the home"},
          ],
        },
        {
          label: "Questions for your first animal",
          fields: [{kind: "heading", label: "Your questions for your first animal (up to 3, optional)"}, ...questions("animal-1-", 3)],
        },
        {
          label: "Your second animal",
          fields: [
            {kind: "text", name: "animal-2-name", label: "Your second animal’s name", required: true},
            {kind: "photo", name: "animal-2-photo", label: "A photo of your second animal, with their eyes visible", required: true},
            livingOrPassed("animal-2-living-or-passed", "Is your second animal living, or have they passed?"),
            {kind: "text", name: "animal-2-age", label: "Your second animal’s age", hint: "If living."},
            {kind: "text", name: "animal-2-sex", label: "Your second animal’s sex", required: true},
          ],
        },
        {
          label: "Questions for your second animal",
          fields: [
            {kind: "heading", label: "Your questions for your second animal (up to 3, optional)"},
            ...questions("animal-2-", 3),
            anythingElse,
          ],
        },
        sharing("Can I use your animals’ names?", "Can I use their photos?"),
      ],
      booking: {event: "two-animal-session", testEvent: "test-communication"},
    },
    {
      slug: "communication-and-reiki",
      formName: "intake-communication-and-reiki",
      title: "Tell me about your animal",
      pages: [
        {label: "About you", fields: [firstName, email, phone("So I can text you before their Reiki.")]},
        {label: "About your animal", fields: aboutAnimal},
        {
          label: "Your questions",
          fields: [{kind: "heading", label: "Your questions for your animal (up to 5, optional)"}, ...questions("", 5)],
        },
        {
          label: "For their Reiki",
          fields: [
            {kind: "heading", label: "For their Reiki (optional)"},
            {kind: "textarea", name: "vet-care", label: "Any vet care or medications right now?"},
            {kind: "textarea", name: "going-on", label: "What’s going on with them right now?", hint: "Health, behavior, any big changes."},
            {kind: "textarea", name: "hoping-for", label: "What are you hoping their Reiki helps with?"},
            anythingElse,
          ],
        },
        sharing("Can I use your animal’s name?", "Can I use their photo?"),
      ],
      booking: {event: "communication-and-reiki", testEvent: "test-communication"},
    },
    {
      slug: "animal-reiki",
      formName: "intake-animal-reiki",
      title: "Your animal’s Reiki session",
      pages: [
        {label: "About you", fields: [firstName, email, phone("So I can text you before their Reiki.")]},
        {
          label: "About your animal",
          fields: [
            {kind: "text", name: "animal-name", label: "Your animal’s name", required: true},
            {kind: "photo", name: "photo", label: "A photo of your animal, with their eyes visible", required: true},
          ],
        },
        {
          label: "For their Reiki",
          fields: [
            {kind: "text", name: "vet-care", label: "Any vet care or medications right now?"},
            {kind: "textarea", name: "going-on", label: "What’s going on with them right now?", hint: "Health, behavior, any big changes."},
            {kind: "textarea", name: "hoping-for", label: "What are you hoping this session helps with?"},
            anythingElse,
          ],
        },
      ],
      booking: {event: "animal-reiki", testEvent: "test-reiki"},
    },
    {
      slug: "distance-reiki",
      formName: "intake-distance-reiki",
      title: "Your Distance Reiki session",
      pages: [
        {
          label: "About you",
          fields: [
            firstName,
            email,
            phone("So I can text you before your session."),
            {kind: "text", name: "city", label: "What city will you be in during your session?", required: true, autoComplete: "address-level2"},
          ],
        },
        {
          label: "Your session",
          fields: [
            {kind: "textarea", name: "going-on", label: "What’s going on for you right now?", hint: "Body, mind, anything you’re carrying."},
            {kind: "textarea", name: "hoping-for", label: "What are you hoping this session helps with?"},
            anythingElse,
          ],
        },
      ],
      booking: {
        choices: [
          {option: "45", label: "One 45-minute session", price: "$120", event: "distance-reiki", testEvent: "test-reiki"},
          {option: "30", label: "One 30-minute session", price: "$100", event: "distance-reiki-30", testEvent: "test-reiki"},
          {
            option: "package",
            label: "3-session package",
            price: "$330",
            duration: "3 × 45 min",
            event: "distance-reiki-3-sessions",
            testEvent: "test-reiki",
          },
        ],
      },
    },
  ] satisfies IntakeForm[],
}

/** The Cal.com link (user/event) to book, honouring the test switch. */
export const calLink = ({event, testEvent}: CalEvent) => `${CAL_USER}/${USE_TEST_EVENTS ? testEvent : event}`

/** Every field name a form can send, for the Netlify registration and the restore check. */
export const fieldNames = (form: IntakeForm) =>
  form.pages.flatMap((page) => page.fields.flatMap((field) => ("name" in field ? [field] : [])))

/** The booking choice named by a page's ?option=, if the form offers choices. */
export const findChoice = (form: IntakeForm, option: string | undefined) =>
  "choices" in form.booking ? form.booking.choices.find((choice) => choice.option === option) : undefined

/** Name, price, duration and Services card for the header above a booking form, read from the Services page. */
export function sessionHeader(form: IntakeForm, choice: SessionChoice | undefined) {
  const path = `/book/${form.slug}`
  const matches = services.groups
    .flatMap((group) => group.services)
    .flatMap((service) => service.options.filter((option) => option.url.split("?")[0] === path).map((option) => ({service, option})))
  const match = choice ? matches.find(({option}) => option.url === `${path}?option=${choice.option}`) : matches.length === 1 ? matches[0] : undefined
  if (match) {
    return {
      name: match.service.name,
      price: match.option.price,
      duration: choice?.duration ?? match.option.duration,
      card: match.service.id,
      from: false,
    }
  }
  const cheapest = [...matches].sort((a, b) => Number(a.option.price.replace(/\D/g, "")) - Number(b.option.price.replace(/\D/g, "")))[0]
  return {name: matches[0].service.name, price: cheapest.option.price, duration: undefined, card: matches[0].service.id, from: true}
}
