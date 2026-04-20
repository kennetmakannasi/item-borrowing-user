import { createFileRoute } from '@tanstack/react-router'
import ActivationPage from '../../pages/auth/invitePage'
import { z } from 'zod'

const inviteSearchSchema = z.object({
  jwt: z.string().catch(''), // Jika tidak ada, default ke string kosong
})

export const Route = createFileRoute('/auth/invite')({
  validateSearch: (search) => inviteSearchSchema.parse(search),
  component: ActivationPage,
})