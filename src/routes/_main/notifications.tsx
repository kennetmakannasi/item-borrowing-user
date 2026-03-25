import { createFileRoute } from '@tanstack/react-router'
import NotificationsPage from '../../pages/notificationsPage'

export const Route = createFileRoute('/_main/notifications')({
  component: NotificationsPage,
})
