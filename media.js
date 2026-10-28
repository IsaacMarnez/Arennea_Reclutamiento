export async function onRequestGet({ request, env }) {
  if (!env.LANDING_KV) return new Response('Not configured', { status: 404 });
  const url = new URL(request.url);
  const key = (url.searchParams.get('key') || '').trim();
  if (!/^[a-zA-Z0-9_-]{2,64}$/.test(key)) return new Response('Bad key', { status: 400 });

  const result = await env.LANDING_KV.getWithMetadata(`image:${key}`, 'arrayBuffer');
  if (!result?.value) return new Response('Not found', { status: 404 });
  const type = result.metadata?.contentType || 'image/jpeg';
  return new Response(result.value, {
    headers: {
      'content-type': type,
      'cache-control': 'public, max-age=31536000, immutable'
    }
  });
}
