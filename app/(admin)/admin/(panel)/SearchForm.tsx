/** GET search box: keeps the current filter in a hidden field. */
export default function SearchForm({ action, query, hidden }: { action: string; query: string; hidden: Record<string, string> }) {
  return (
    <form className="adm-search" action={action} role="search">
      {Object.entries(hidden).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      <label className="adm-sr-only" htmlFor="q">Rechercher</label>
      <input id="q" name="q" type="search" defaultValue={query} placeholder="Nom, email, organisation, texte…" />
      <button className="adm-btn">Rechercher</button>
    </form>
  );
}
