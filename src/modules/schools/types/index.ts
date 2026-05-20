export interface SchoolProfileDTO {
  id: number
  slug: string
  shortName: string
  fullName: string
  city: string
  address: string
  phone: string
  email: string
  hours: string
  heroTitle: string
  heroText: string
  stats: Array<{ value: string; label: string }>
  type: string
}

export interface SchoolProfile {
  id: number
  slug: string
  shortName: string
  fullName: string
  city: string
  address: string
  phone: string
  email: string
  hours: string
  heroTitle: string
  heroText: string
  stats: Array<{ value: string; label: string }>
  type: string
}
