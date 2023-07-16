import base32Encode from "base32-encode"

export function getRandomId() {
  const number = crypto.getRandomValues(new Uint8Array(5))
  const text = base32Encode(number, "Crockford")
  return text
}
