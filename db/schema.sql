-- Bitumad — schéma Neon. Idempotent : `npm run db:setup` peut être relancé sans risque.

-- Demandes reçues par les formulaires du site : devis (accueil), message et partenariat (page Contact).
-- `details` garde les champs propres à chaque formulaire (type de projet, quantité, région, poste, nature…).
CREATE TABLE IF NOT EXISTS inquiries (
  id            bigserial PRIMARY KEY,
  created_at    timestamptz NOT NULL DEFAULT now(),
  kind          text NOT NULL CHECK (kind IN ('devis', 'message', 'partenariat')),
  name          text NOT NULL,
  email         text NOT NULL,
  phone         text,
  organisation  text,
  subject       text,
  message       text NOT NULL DEFAULT '',
  details       jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- Messages : new → read → archived. Devis : new → in_progress → quoted → won / lost, puis archived.
  status        text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'in_progress', 'quoted', 'won', 'lost', 'archived')),
  -- Note interne de l'équipe (suivi du devis), jamais visible du demandeur.
  note          text,
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inquiries_kind_created_idx ON inquiries (kind, created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries (status) WHERE status = 'new';

-- Mesure d'audience maison, sans cookie : `visitor` est un hash quotidien (IP + navigateur + sel),
-- impossible à relier d'un jour à l'autre ou à une personne.
CREATE TABLE IF NOT EXISTS page_views (
  id          bigserial PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  path        text NOT NULL,
  referrer    text,
  utm_source  text,
  visitor     text NOT NULL,
  country     text,
  device      text,
  browser     text,
  -- Secondes passées onglet visible sur la page (beacon de sortie).
  duration    integer
);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at DESC);
-- Engaged-time beacons update the visitor's latest view of one path.
CREATE INDEX IF NOT EXISTS page_views_visitor_path_idx ON page_views (visitor, path, id DESC);

-- Core Web Vitals réels. L'identifiant est stable pour une mesure : les mises à jour
-- de LCP/INP/CLS remplacent la valeur intermédiaire au lieu de la dupliquer.
CREATE TABLE IF NOT EXISTS web_vitals (
  metric_id       text PRIMARY KEY,
  created_at      timestamptz NOT NULL DEFAULT now(),
  path            text NOT NULL,
  name            varchar(3) NOT NULL CHECK (name IN ('LCP', 'INP', 'CLS')),
  value           double precision NOT NULL,
  rating          varchar(20),
  navigation_type varchar(32),
  device          text
);
CREATE INDEX IF NOT EXISTS web_vitals_path_name_created_idx ON web_vitals (path, name, created_at DESC);
CREATE INDEX IF NOT EXISTS web_vitals_created_idx ON web_vitals (created_at);

-- Agrégats quotidiens, conservés sans limite. Chaque journée terminée de page_views y est résumée
-- puis supprimée (voir lib/admin-stats.ts) : la base grossit de quelques dizaines de lignes par jour au plus.
-- Le hash visiteur changeant chaque jour, additionner les visiteurs quotidiens donne le même total qu'avant.
CREATE TABLE IF NOT EXISTS page_views_daily (
  day     date NOT NULL,
  path    text NOT NULL,
  source  text NOT NULL DEFAULT '',  -- utm_source, sinon domaine référent, sinon ''
  views   integer NOT NULL,
  PRIMARY KEY (day, path, source)
);

-- Un visiteur (IP + navigateur, sur une journée) a un seul pays / appareil / navigateur : la somme reste exacte.
CREATE TABLE IF NOT EXISTS visitors_daily (
  day       date NOT NULL,
  country   text NOT NULL DEFAULT '',
  device    text NOT NULL,
  browser   text NOT NULL,
  visitors  integer NOT NULL,
  PRIMARY KEY (day, country, device, browser)
);

-- Sessions : vues d'un même visiteur espacées de moins de 30 min d'inactivité. `duration` en secondes cumulées.
CREATE TABLE IF NOT EXISTS sessions_daily (
  day       date PRIMARY KEY,
  sessions  integer NOT NULL,
  duration  bigint NOT NULL
);

-- Comptes de l'espace admin. Mot de passe haché en scrypt (voir lib/password.ts), jamais stocké en clair.
-- `session_key` signe les cookies de session : le changer (déconnexion) invalide les sessions du compte.
CREATE TABLE IF NOT EXISTS admin_users (
  id              bigserial PRIMARY KEY,
  created_at      timestamptz NOT NULL DEFAULT now(),
  email           text NOT NULL UNIQUE,
  name            text NOT NULL,
  password_hash   text NOT NULL,
  last_login_at   timestamptz,
  session_key     text NOT NULL DEFAULT gen_random_uuid()::text
);

-- Limitation de débit (voir lib/rate-limit.ts) : un compteur par clé (« route:ip »), fenêtre fixe.
CREATE TABLE IF NOT EXISTS rate_limits (
  key           text PRIMARY KEY,
  window_start  timestamptz NOT NULL DEFAULT now(),
  count         integer NOT NULL DEFAULT 1
);

-- Réglages du site modifiables depuis l'admin (ex. `maintenance` : { "enabled": bool, "message": text }).
CREATE TABLE IF NOT EXISTS site_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
