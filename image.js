import { authorized, json } from './_auth.js';

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) return json({ ok: false, error: 'No autorizado' }, 401);
  if (!env.LANDING_KV) return json({ ok: false, error: 'Falta el binding LANDING_KV' }, 500);

  const url = new URL(request.url);
  const key = (url.searchParams.get('key') || '').trim();
  if (!/^[a-zA-Z0-9_-]{2,64}$/.test(key)) return json({ ok: false, error: 'Clave de imagen inválida' }, 400);

  const type = request.headers.get('content-type') || 'image/jpeg';
  if (!type.startsWith('image/')) return json({ ok: false, error: 'Solo se aceptan imágenes' }, 415);

  const body = await request.arrayBuffer();
  if (!body.byteLength) return json({ ok: false, error: 'Archivo vacío' }, 400);
  if (body.byteLength > 5 * 1024 * 1024) return json({ ok: false, error: 'La imagen supera 5 MB' }, 413);

  const version = Date.now().toString();
  await env.LANDING_KV.put(`image:${key}`, body, { metadata: { contentType: type, version } });
  return json({ ok: true, url: `/api/media?key=${encodeURIComponent(key)}&v=${version}` });
}
