const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function validImageKey(key) {
  return /^[A-Za-z0-9_-]{1,64}$/.test(key || "");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/content") {
      if (!env.LANDING_KV) return json({ error: "LANDING_KV no está vinculado" }, 503);

      if (request.method === "GET") {
        const stored = await env.LANDING_KV.get("landing:content", "json");
        if (!stored) return json({ error: "Todavía no hay contenido publicado" }, 404);
        return json(stored);
      }

      if (request.method === "PUT") {
        let body;
        try {
          body = await request.json();
        } catch {
          return json({ error: "JSON inválido" }, 400);
        }
        await env.LANDING_KV.put("landing:content", JSON.stringify(body));
        return json({ ok: true });
      }

      return json({ error: "Método no permitido" }, 405);
    }

    if (url.pathname === "/api/image") {
      if (!env.LANDING_KV) return json({ error: "LANDING_KV no está vinculado" }, 503);
      const key = url.searchParams.get("key") || "";
      if (!validImageKey(key)) return json({ error: "Clave de imagen inválida" }, 400);
      const storageKey = `landing:image:${key}`;

      if (request.method === "GET") {
        const result = await env.LANDING_KV.getWithMetadata(storageKey, "arrayBuffer");
        if (!result.value) return new Response("Imagen no encontrada", { status: 404 });
        const contentType = result.metadata?.contentType || "image/jpeg";
        return new Response(result.value, {
          headers: {
            "content-type": contentType,
            "cache-control": "public, max-age=300",
          },
        });
      }

      if (request.method === "POST") {
        const len = Number(request.headers.get("content-length") || 0);
        if (len > 10 * 1024 * 1024) return json({ error: "La imagen supera 10 MB" }, 413);
        const contentType = request.headers.get("content-type") || "image/jpeg";
        if (!contentType.startsWith("image/")) return json({ error: "El archivo debe ser una imagen" }, 415);
        const buffer = await request.arrayBuffer();
        if (!buffer.byteLength) return json({ error: "Imagen vacía" }, 400);
        if (buffer.byteLength > 10 * 1024 * 1024) return json({ error: "La imagen supera 10 MB" }, 413);
        await env.LANDING_KV.put(storageKey, buffer, { metadata: { contentType } });
        return json({ ok: true, url: `/api/image?key=${encodeURIComponent(key)}&v=${Date.now()}` });
      }

      return json({ error: "Método no permitido" }, 405);
    }

    return env.ASSETS.fetch(request);
  },
};
