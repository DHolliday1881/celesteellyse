const MAX_SIDE = 1200
const JPEG_QUALITY = 0.8

// Netlify Forms rejects a whole submission over 8 MB
export const MAX_REQUEST_BYTES = 8 * 1024 * 1024

/** Largest photo sent as is when the browser can't shrink it. */
export const MAX_UNRESIZED_BYTES = 2 * 1024 * 1024

export type PreparedPhoto = {file: File; resized: boolean}

const isHeic = (file: File) => /image\/hei[cf]/.test(file.type) || /\.(heic|heif)$/i.test(file.name)

/** True for image files, including HEIC/HEIF that some browsers report without a type. */
export function isImage(file: File) {
  return file.type.startsWith("image/") || isHeic(file)
}

/** Loads an image into an image element, or undefined when this browser can't read it. */
async function decode(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const image = new Image()
  image.src = url
  try {
    await image.decode()
    return image
  } catch {
    return undefined
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Converts a HEIC photo to JPEG for browsers that can't read HEIC; loads the converter only when needed. */
async function heicToJpeg(file: File): Promise<Blob | undefined> {
  try {
    const {default: heic2any} = await import("heic2any")
    const converted = await heic2any({blob: file, toType: "image/jpeg", quality: 0.92})
    return Array.isArray(converted) ? converted[0] : converted
  } catch {
    return undefined
  }
}

/** Draws an image at most MAX_SIDE on its long side and encodes it as JPEG. */
function toJpeg(image: HTMLImageElement): Promise<Blob | null> {
  const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(image.naturalWidth * scale)
  canvas.height = Math.round(image.naturalHeight * scale)
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY))
}

/** Resizes a photo to a small JPEG in the browser, converting HEIC first; keeps the original only when it can't be read but is small. */
export async function preparePhoto(file: File): Promise<PreparedPhoto | "not-image" | "too-big"> {
  if (!isImage(file)) return "not-image"
  let image = await decode(file)
  if (!image && isHeic(file)) {
    const converted = await heicToJpeg(file)
    if (converted) image = await decode(converted)
  }
  const blob = image && (await toJpeg(image))
  if (blob && blob.size > 0) {
    const name = `${file.name.replace(/\.[^.]+$/, "") || "photo"}.jpg`
    return {file: new File([blob], name, {type: "image/jpeg"}), resized: true}
  }
  return file.size <= MAX_UNRESIZED_BYTES ? {file, resized: false} : "too-big"
}
