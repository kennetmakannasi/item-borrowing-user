import { createFileRoute } from '@tanstack/react-router'
import ItemDetailPage from '../pages/itemDetailPage'

export const Route = createFileRoute('/item')({
  component: ItemDetailPage,
})