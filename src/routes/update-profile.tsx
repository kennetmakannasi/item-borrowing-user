import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../middlewares/protected-route'
import UpdateProfilePage from '../pages/updateProfilePage'

export const Route = createFileRoute('/update-profile')({
  component: () => (
    <ProtectedRoute>
      <UpdateProfilePage/>
    </ProtectedRoute>
  ),
})
