# Celeste Ellyse

Website for Celeste Ellyse, animal communicator and Reiki master: https://celesteellyse.com

Built with Next.js (App Router), React, TypeScript and CSS Modules. The night sky on the Services page uses three.js through React Three Fiber. Hosted on Netlify.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the local dev server |
| `npm run build` | Makes a production build, the same one Netlify runs |
| `npm run lint` | Checks the code with ESLint |
| `npx tsc --noEmit` | Checks types |

## Editing content

All site copy lives in `content/site.ts`: the name, email, social links, home page text, services and prices, booking links, how it works, and the FAQ. Change the text there and the pages update.

- Images go in `public/images/` and are listed in the `images` block of `content/site.ts`.
- Booking links point to Cal.com.
- Use curly apostrophes (’) in copy.

## Where things are

| Path | What it holds |
| --- | --- |
| `app/` | Pages, global styles, site icons and the share image |
| `app/globals.css` | Colours, type sizes, spacing, glass styles and shared buttons |
| `components/` | Nav, footer and the night sky, shared by every page |
| `components/home/` | Home page sections |
| `components/services/` | Services page sections |
| `content/site.ts` | All copy, prices and links |

## Site icons and share image

These are Next.js file conventions in `app/`, and the file names matter:

| File | Used for |
| --- | --- |
| `favicon.ico` | Older browsers |
| `icon.svg`, `icon1.png`, `icon2.png` | Browser tabs and bookmarks |
| `apple-icon.png` | iPhone and iPad home screens |
| `opengraph-image.jpg` | Link previews (1200x630), with alt text in `opengraph-image.alt.txt` |

## Branches and deploys

1. Make each change on its own branch off `dev`.
2. Open a pull request into `dev`.
3. When `dev` is ready to go live, open a pull request from `dev` into `main`.
4. Netlify builds and deploys every change to `main`. If the build fails, the live site stays on the last good version.
