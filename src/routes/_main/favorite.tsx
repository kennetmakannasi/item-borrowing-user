import { createFileRoute } from '@tanstack/react-router';
import FavoritePage from '../../pages/favoritePage';

export const Route = createFileRoute('/_main/favorite')({
  component: FavoritePage,
});