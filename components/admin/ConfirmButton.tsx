"use client";

/** A one-button form with a confirmation prompt (deletions). */
export default function ConfirmButton({ action, fields, label = "Supprimer", message = "Supprimer définitivement ? Cette action est irréversible.", className = "adm-btn adm-btn-danger" }: {
  action: (formData: FormData) => Promise<unknown>;
  fields: Record<string, string | null | undefined>;
  label?: string;
  message?: string;
  className?: string;
}) {
  return (
    <form
      action={async (formData) => { await action(formData); }}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {Object.entries(fields).map(([name, value]) => value != null && <input key={name} type="hidden" name={name} value={value} />)}
      <button className={className}>{label}</button>
    </form>
  );
}
