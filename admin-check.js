import { authorized, json } from './_auth.js';

export async function onRequestGet({ request, env }) {
  if (!authorized(request, env)) return json({ ok: false }, 401);
  return json({ ok: true });
}
