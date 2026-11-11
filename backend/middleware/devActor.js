// Temporary local-development identity only. Replace with the platform JWT/session
// authentication middleware before exposing this API outside localhost.
export function attachDevelopmentActor(req, res, next) {
  if (process.env.NODE_ENV !== "production") {
    req.user = {
      name: req.get("x-dev-user") || "Local Developer",
      role: req.get("x-dev-role") || "Superadmin",
    };
  }
  next();
}
