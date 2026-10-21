export function unwrapList(response, aliases = []) {
  const body = response?.data;
  const inner = body?.data;
  const candidates = [
    inner?.items,
    ...aliases.map((key) => inner?.[key]),
    ...aliases.map((key) => body?.[key]),
    Array.isArray(inner) ? inner : null,
    Array.isArray(body) ? body : null,
  ];
  return candidates.find(Array.isArray) || [];
}

export function unwrapResource(response, keys = []) {
  const body = response?.data;
  const inner = body?.data ?? body;
  for (const key of keys) {
    if (inner?.[key] && typeof inner[key] === 'object' && !Array.isArray(inner[key])) {
      return inner[key];
    }
    if (body?.[key] && typeof body[key] === 'object' && !Array.isArray(body[key])) {
      return body[key];
    }
  }
  if (inner && typeof inner === 'object' && !Array.isArray(inner) && !inner.items) {
    return inner;
  }
  return inner;
}

export function unwrapUser(response) {
  const body = response?.data;
  return body?.user || body?.data?.user || null;
}
