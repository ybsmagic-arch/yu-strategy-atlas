import { timingSafeEqual } from "node:crypto";

export function isValidIngestToken(authorization: string | null, expected: string | undefined) {
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  const supplied = Buffer.from(authorization.slice(7));
  const secret = Buffer.from(expected);
  return supplied.length === secret.length && timingSafeEqual(supplied, secret);
}
