import net from "node:net";

const HOST_LABEL_RE = /^[a-z0-9](?:[a-z0-9_-]{0,61}[a-z0-9])?$/i;

function isLikelyValidHostname(host: string): boolean {
  if (!host || host.length > 253) {
    return false;
  }
  const labels = host.split(".");
  if (labels.length === 0) {
    return false;
  }
  return labels.every((label) => {
    if (!label || label.length > 63) {
      return false;
    }
    return HOST_LABEL_RE.test(label);
  });
}

/**
 * Normalizes an optional gateway host (IP or DNS) used for generated/probed URLs.
 * Rejects full URLs and path/query fragments.
 */
export function normalizeGatewayAdvertiseHost(raw: string | undefined): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.includes("://") || /[/?#]/.test(trimmed)) {
    return undefined;
  }

  // Keep bracketed IPv6 form only for validation; we return the unbracketed host.
  const host =
    trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed.slice(1, -1).trim() : trimmed;
  if (!host) {
    return undefined;
  }

  if (net.isIP(host) !== 0) {
    return host;
  }
  if (host.includes(":")) {
    // Host:port is not allowed in this field.
    return undefined;
  }
  if (isLikelyValidHostname(host)) {
    return host;
  }
  return undefined;
}

export function validateGatewayAdvertiseHostInput(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  return normalizeGatewayAdvertiseHost(trimmed)
    ? undefined
    : "Invalid host. Use an IP or DNS name (no scheme/path/port).";
}
