export const normalizePhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
};
export const normalizeEmail = (value = "") => String(value).trim().toLowerCase();
export const normalizeSocial = (value = "") => String(value).trim().toLowerCase().replace(/^@/, "").replace(/\/$/, "").split("/").filter(Boolean).pop() || "";

// Copper OS stores timestamps as UTC; SLA rules are evaluated in India Standard Time.
const IST_OFFSET_MINUTES = 330;
function istParts(date) {
  const shifted = new Date(date.getTime() + IST_OFFSET_MINUTES * 60_000);
  return { y: shifted.getUTCFullYear(), m: shifted.getUTCMonth(), d: shifted.getUTCDate(), day: shifted.getUTCDay(), h: shifted.getUTCHours(), min: shifted.getUTCMinutes() };
}
function fromIST(y, m, d, h, min = 0) {
  return new Date(Date.UTC(y, m, d, h, min) - IST_OFFSET_MINUTES * 60_000);
}
function nextWorkingDay(y, m, d) {
  const date = new Date(Date.UTC(y, m, d));
  do { date.setUTCDate(date.getUTCDate() + 1); } while (date.getUTCDay() === 0);
  return { y: date.getUTCFullYear(), m: date.getUTCMonth(), d: date.getUTCDate() };
}

export function calculateFirstResponseDue(createdAt = new Date()) {
  const p = istParts(new Date(createdAt));
  if (p.day === 0) {
    const monday = nextWorkingDay(p.y, p.m, p.d);
    return fromIST(monday.y, monday.m, monday.d, 15);
  }
  let due;
  if (p.h < 9 || p.h >= 21) {
    let target = p.h >= 21 ? nextWorkingDay(p.y, p.m, p.d) : { y: p.y, m: p.m, d: p.d };
    due = fromIST(target.y, target.m, target.d, 15);
  } else {
    due = new Date(new Date(createdAt).getTime() + 2 * 60 * 60_000);
    const dueParts = istParts(due);
    if (dueParts.day === 0) {
      const monday = nextWorkingDay(dueParts.y, dueParts.m, dueParts.d);
      due = fromIST(monday.y, monday.m, monday.d, 15);
    }
  }
  return due;
}

export function getSlaStatus(lead, now = new Date()) {
  if (lead.firstResponseAt) return "Met";
  const due = new Date(lead.firstResponseDueAt);
  if (now > due) return "Lapsed";
  if (due.getTime() - now.getTime() <= 30 * 60_000) return "At risk";
  return "Pending";
}
