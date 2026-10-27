const SENSITIVE = /password|secret|token|authorization|cookie|resume|csrf/i;

export function sanitizeMeta(meta) {
  if (!meta || typeof meta !== 'object') return meta;
  const out = Array.isArray(meta) ? [] : {};
  for (const [key, value] of Object.entries(meta)) {
    if (SENSITIVE.test(key)) {
      out[key] = '[redacted]';
    } else if (value && typeof value === 'object') {
      out[key] = sanitizeMeta(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export function logInfo(message, meta) {
  if (meta) {
    console.info(message, sanitizeMeta(meta));
  } else {
    console.info(message);
  }
}

export function logError(message, meta) {
  if (meta) {
    console.error(message, sanitizeMeta(meta));
  } else {
    console.error(message);
  }
}

export default { logInfo, logError, sanitizeMeta };
