import { createFileRoute } from '@tanstack/react-router';
import SearchPage from '../../pages/searchPage';


export const Route = createFileRoute('/_main/search')({
  component: SearchPage,
});