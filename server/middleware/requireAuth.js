import jwt from "jsonwebtoken";

const JWT_SECRET = () =>
  process.env.JWT_SECRET || "utopiax-dev-secret-change-me";

/** Require a valid Bearer JWT. Sets req.user from the token payload. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET());
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * If a Bearer token is present and valid, set req.user; otherwise continue
 * as anonymous (used for public lists that include drafts when authed).
 */
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET());
  } catch {
    req.user = null;
  }
  return next();
}
