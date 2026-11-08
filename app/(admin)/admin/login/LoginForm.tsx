"use client";

import { useActionState } from "react";
import { keepValuesOnSubmit } from "@/components/admin/submit";
import { login } from "../actions";
import PasswordInput from "@/components/admin/PasswordInput";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {});

  return (
    <form action={action} onSubmit={keepValuesOnSubmit(action)} className="adm-form">
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      <label htmlFor="password">Mot de passe</label>
      <PasswordInput id="password" name="password" autoComplete="current-password" required />
      {state.error && <p className="adm-error" role="alert">{state.error}</p>}
      <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
