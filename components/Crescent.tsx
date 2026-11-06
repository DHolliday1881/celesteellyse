/** Crescent moon mark, drawn in the current text colour. */
export default function Crescent({className}: {className: string}) {
  return (
    <svg
      className={className}
      viewBox="6 6 88 88"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M89.90 47.21A40 40 0 1 1 45.82 10.22A34.24 34.24 0 1 0 89.90 47.21Z" />
    </svg>
  )
}
