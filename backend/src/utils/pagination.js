export function parsePagination(query, { maxLimit = 50, defaultLimit = 12 } = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  let limit = Number.parseInt(query.limit, 10) || defaultLimit;
  limit = Math.min(Math.max(1, limit), maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
