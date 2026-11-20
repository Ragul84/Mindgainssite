-- Shared player profile (Live Theatre + NationLap): best-effort D1 mirror of the account profile stored in the
-- TheatreHall Durable Object instance "profile-v1". The Worker creates it lazily on the first save (worker/theatre-hooks.js),
-- so running this file is optional and safe (IF NOT EXISTS).
CREATE TABLE IF NOT EXISTS mg_profile (uid TEXT PRIMARY KEY, name TEXT NOT NULL, gender TEXT NOT NULL, state TEXT NOT NULL DEFAULT '', color INTEGER NOT NULL DEFAULT -1, updated_at INTEGER NOT NULL);
