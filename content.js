import { authorized, json } from './_auth.js';

export async function onRequestGet({ env }) {
  if (!env.LANDING_KV) return json({ configured: false }, 404);
  const saved = await env.LANDING_KV.get('content', 'json');
  if (!saved) return json({ configured: true, empty: true }, 404);
  return json(saved);
}

export async function onRequestPut({ request, env }) {
  if (!authorized(request, env)) return json({ ok: false, error: 'No autorizado' }, 401);
  if (!env.LANDING_KV) return json({ ok: false, error: 'Falta el binding LANDING_KV' }, 500);

  const raw = await request.text();
  if (raw.length > 250000) return json({ ok: false, error: 'Contenido demasiado grande' }, 413);

  let payload;
  try { payload = JSON.parse(raw); }
  catch { return json({ ok: false, error: 'JSON inválido' }, 400); }

  payload.updatedAt = new Date().toISOString();
  await env.LANDING_KV.put('content', JSON.stringify(payload));
  return json({ ok: true, updatedAt: payload.updatedAt });
}
