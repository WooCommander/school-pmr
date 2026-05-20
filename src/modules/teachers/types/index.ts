export interface TeacherDTO {
  id: number
  schoolSlug: string
  name: string
  position: string
  subject: string
  category: string
  experience: number
  email?: string
  photo?: string
}

export interface TeacherProfile {
  id: number
  schoolSlug: string
  name: string
  position: string
  subject: string
  category: string
  experience: number
  email?: string
  photo?: string
}

export interface AdministrationContact {
  role: string
  name: string
  email: string | null
}
