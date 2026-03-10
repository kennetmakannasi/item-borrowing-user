import { createFileRoute } from '@tanstack/react-router';
import MainPage from '../../pages/mainPage';

export const Route = createFileRoute('/_main/search')({
  component: CardsPage,
});

function CardsPage() {
  return (
    <MainPage/>
  );
}