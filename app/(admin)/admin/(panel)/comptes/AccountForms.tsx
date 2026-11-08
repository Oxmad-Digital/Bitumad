"use client";

import { useActionState, useEffect, useRef } from "react";
import { keepValuesOnSubmit } from "@/components/admin/submit";
import { changePassword, createAdmin } from "../../actions";

type State = { error?: string; ok?: string };

function Feedback({ state }: { state: State }) {
  if (state.error) return <p className="adm-error" role="alert">{state.error}</p>;
  if (state.ok) return <p className="adm-ok" role="status">{state.ok}</p>;
  return null;
}

/** Clears the form after each successful submit (every submit returns a new state object). */
function useResetOnSuccess(state: State) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);
  return ref;
}

export function CreateAdminForm({ minLength }: { minLength: number }) {
  const [state, action, pending] = useActionState(createAdmin, {});
  const ref = useResetOnSuccess(state);

  return (
    <form ref={ref} action={action} onSubmit={keepValuesOnSubmit(action)} className="adm-form">
      <label htmlFor="new-name">Nom</label>
      <input id="new-name" name="name" required />
      <label htmlFor="new-email">Email</label>
      <input id="new-email" name="email" type="email" required />
      <label htmlFor="new-password">Mot de passe provisoire</label>
      <input id="new-password" name="password" type="password" autoComplete="new-password" minLength={minLength} required />
      <Feedback state={state} />
      <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>Créer le compte</button>
    </form>
  );
}

export function ChangePasswordForm({ minLength }: { minLength: number }) {
  const [state, action, pending] = useActionState(changePassword, {});
  const ref = useResetOnSuccess(state);

  return (
    <form ref={ref} action={action} onSubmit={keepValuesOnSubmit(action)} className="adm-form">
      <label htmlFor="current">Mot de passe actuel</label>
      <input id="current" name="current" type="password" autoComplete="current-password" required />
      <label htmlFor="next">Nouveau mot de passe</label>
      <input id="next" name="next" type="password" autoComplete="new-password" minLength={minLength} required />
      <label htmlFor="confirm">Confirmer</label>
      <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={minLength} required />
      <Feedback state={state} />
      <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>Modifier</button>
    </form>
  );
}
