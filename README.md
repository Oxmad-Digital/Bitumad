This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Espace admin (`/admin`)

Repris de l'admin Oxmad Digital : statistiques d'audience sans cookie, demandes de devis, messages
(contact + partenariats) et comptes admin (email + mot de passe).

Mise en place (une fois) :

1. Créer une base Neon dédiée à Bitumad et copier `.env.example` en `.env.local` (`DATABASE_URL`,
   `ADMIN_SESSION_SECRET` de 32+ caractères, `RESEND_API_KEY`). Mêmes variables sur Vercel.
2. `npm run db:setup` : crée les tables (`db/schema.sql`, idempotent).
3. `npm run admin:create -- prenom@bitumad.mg "Prénom Nom"` : crée un compte (mot de passe affiché).

La même commande réinitialise le mot de passe d'un compte existant (mot de passe oublié). Les autres
comptes se créent ensuite depuis la page Comptes de l'admin.

Chaque formulaire (`/api/contact`) est enregistré en base puis envoyé par email : une demande n'est
perdue que si les deux échouent. Les demandes sont supprimées automatiquement après 3 ans
(`lib/retention.ts`, durée annoncée dans les mentions légales).
