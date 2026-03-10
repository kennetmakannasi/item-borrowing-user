import { createFileRoute } from '@tanstack/react-router';
import MainPage from '../../pages/mainPage';

export const Route = createFileRoute('/_main/')({
  component: CardsPage,
});

function CardsPage() {
  return (
    <MainPage/>
  );
}