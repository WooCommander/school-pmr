export type AdminRole =
  | 'superadmin'
  | 'school_admin'
  | 'director'
  | 'content_manager'

export interface AdminSchoolAccess {
  schoolSlug: string
  role: AdminRole
}

export interface AdminUser {
  id: number
  email: string
  password: string
  name: string
  accesses: AdminSchoolAccess[]
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: 1,
    email: 'admin@pmr.local',
    password: 'admin123',
    name: 'Системный администратор',
    accesses: [
      { schoolSlug: 'dnestrovsk-school-1', role: 'superadmin' },
      { schoolSlug: 'school-2', role: 'superadmin' },
      { schoolSlug: 'school-3', role: 'superadmin' },
      { schoolSlug: 'school-4', role: 'superadmin' },
      { schoolSlug: 'lyceum-1', role: 'superadmin' },
    ],
  },
  {
    id: 2,
    email: 'school1@pmr.local',
    password: 'school123',
    name: 'Администратор ДнСШ №1',
    accesses: [{ schoolSlug: 'dnestrovsk-school-1', role: 'school_admin' }],
  },
  {
    id: 3,
    email: 'director2@pmr.local',
    password: 'director123',
    name: 'Директор ТСШ №2',
    accesses: [
      { schoolSlug: 'school-2', role: 'director' },
      { schoolSlug: 'school-3', role: 'content_manager' },
    ],
  },
]
