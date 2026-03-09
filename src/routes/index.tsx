import { createFileRoute } from '@tanstack/react-router';
import MainPage from '../pages/mainPage';

export const Route = createFileRoute('/')({
  component: CardsPage,
});

function CardsPage() {
  return (
    <MainPage/>
  );
}