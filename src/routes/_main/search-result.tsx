import { createFileRoute } from '@tanstack/react-router'
import SearchResultPage from '../../pages/searchResultPage'

export const Route = createFileRoute('/_main/search-result')({
  component: SearchResultPage,
})