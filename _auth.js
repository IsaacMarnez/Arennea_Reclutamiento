export function authorized(request, env) {
  const sent = request.headers.get('x-editor-password') || '';
  const expected = env.EDITOR_PASSWORD || '';
  return Boolean(expected) && sent === expected;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
