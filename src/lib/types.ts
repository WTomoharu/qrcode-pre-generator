export type Sheet = {
  uid: string
}

export type QRCode = {
  uid: string
  sheet: string
  url: string | null
}