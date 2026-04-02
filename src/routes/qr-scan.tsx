import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '../middlewares/protected-route'
import ScanQrPage from '../pages/scanQrPage'

export const Route = createFileRoute('/qr-scan')({
  component: () => (
    <ProtectedRoute>
      <ScanQrPage/>
    </ProtectedRoute>
  ),
})