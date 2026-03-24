import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../middlewares/protected-route'
import BorrowingDetailPage from '../pages/borrowingDetailPage'

export const Route = createFileRoute('/borrowing-details')({
  component: () => (
    <ProtectedRoute>
      <BorrowingDetailPage/>
    </ProtectedRoute>
  ),
})