const MAX_SIDE = 1200
const JPEG_QUALITY = 0.8

// Netlify Forms rejects a whole submission over 8 MB
export const MAX_REQUEST_BYTES = 8 * 1024 * 1024

export type PreparedPhoto = {file: File}

type Drawable = HTMLImageElement | ImageBitmap

const isHeic = (file: File) => /image\/hei[cf]/.test(file.type) || /\.(heic|heif)$/i.test(file.name)

/** True for image files, including HEIC/HEIF that some browsers report without a type. */
export function isImage(file: File) {
  return file.type.startsWith("image/") || isHeic(file)
}

/** Loads an image into an image element, or undefined when this browser can't read it. */
async function decodeWithImage(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const image = new Image()
  image.src = url
  try {
    await image.decode()
    return image.naturalWidth > 0 ? image : undefined
  } catch {
    return undefined
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Decodes an image as a bitmap, or undefined when this browser can't read it. */
async function decodeWithBitmap(blob: Blob) {
  if (typeof createImageBitmap !== "function") return undefined
  try {
    return await createImageBitmap(blob)
  } catch {
    return undefined
  }
}

/** Decodes with the browser's own image support first, as Safari reads HEIC natively. */
async function decode(blob: Blob): Promise<Drawable | undefined> {
  return (await decodeWithImage(blob)) ?? (await decodeWithBitmap(blob))
}

/** Converts a HEIC photo to JPEG for browsers that can't read HEIC; loads the converter only when needed. */
async function heicToJpeg(file: File): Promise<Blob | undefined> {
  try {
    const {heicTo} = await import("heic-to")
    return await heicTo({blob: file, type: "image/jpeg", quality: 0.92})
  } catch {
    return undefined
  }
}

/** Draws an image at most MAX_SIDE on its long side and encodes it as JPEG. */
function toJpeg(image: Drawable): Promise<Blob | null> {
  const width = image instanceof HTMLImageElement ? image.naturalWidth : image.width
  const height = image instanceof HTMLImageElement ? image.naturalHeight : image.height
  const scale = Math.min(1, MAX_SIDE / Math.max(width, height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height)
  if (image instanceof ImageBitmap) image.close()
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY))
}

/** Turns any chosen photo into a small JPEG in the browser, using heic-to only when the browser can't read a HEIC itself. */
export async function preparePhoto(file: File): Promise<PreparedPhoto | "not-image" | "unreadable"> {
  if (!isImage(file)) return "not-image"
  let image = await decode(file)
  if (!image && isHeic(file)) {
    const converted = await heicToJpeg(file)
    if (converted) image = await decode(converted)
  }
  const blob = image && (await toJpeg(image).catch(() => null))
  if (!blob || blob.size === 0) return "unreadable"
  const name = `${file.name.replace(/\.[^.]+$/, "") || "photo"}.jpg`
  return {file: new File([blob], name, {type: "image/jpeg"})}
}
