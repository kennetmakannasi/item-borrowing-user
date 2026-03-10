import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "../../pages/auth/registerPage";

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});
