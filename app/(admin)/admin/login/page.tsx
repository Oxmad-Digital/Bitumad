import { redirect } from "next/navigation";
import AuthScreen from "@/components/admin/AuthScreen";
import { getAdmin } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <AuthScreen title="Espace admin">
      <LoginForm />
    </AuthScreen>
  );
}
