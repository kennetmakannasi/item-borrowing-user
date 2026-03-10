import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../../pages/auth/loginPage";

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});
