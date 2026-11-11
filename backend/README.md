# Copper OS API — Leads foundation

This is the first persistent backend slice for the Leads module. It uses Express 4 and MongoDB through Mongoose.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Update MONGODB_URI if your MongoDB instance is not local
npm run dev
```

API health check: `GET http://localhost:5000/api/health`

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/leads` | List, search and filter leads (supports `page`, `limit`, `search`, `stage`, `source`, `priority`, `owner=unassigned`) |
| POST | `/api/leads` | Create a lead and initial assignment task |
| POST | `/api/leads/duplicate-check` | Preview duplicate match |
| GET | `/api/leads/:leadId` | Fetch lead and timeline activities |
| PATCH | `/api/leads/:leadId` | Update editable lead fields |
| PATCH | `/api/leads/:leadId/stage` | Request a validated stage transition |
| PATCH | `/api/leads/:leadId/assignment` | Assign/reassign owner |
| POST | `/api/leads/:leadId/activities` | Add task, note, meeting, call or outbound activity |
| PATCH | `/api/leads/activities/:activityId` | Update activity status/details |

## Local development identity

Until Copper OS authentication is implemented, `middleware/devActor.js` supplies a local-only actor in non-production mode. You can set `x-dev-user` and `x-dev-role` headers while testing. This is **not authentication**. Do not expose this API publicly or deploy it to production until the platform's real JWT/session middleware replaces it and role-based authorization is enforced on every route.

## Current implementation boundaries

- Lead IDs are allocated atomically from a MongoDB counter (`CS-LD-00001` format).
- Duplicate keys use normalized phone (last 10 digits), email, Instagram username and LinkedIn slug.
- Manual duplicate creation is blocked by default. A Superadmin override requires a reason and an authenticated Superadmin identity; wire the real identity middleware before production.
- New leads receive an `Assign owner` task due in 30 minutes. Assignment replaces it with `Make first contact` due at the first-response deadline.
- SLA deadlines use IST and the v1.0 Sunday/night rules.
- Stage checks are enforced server-side for outbound action, meeting, proposal fields, Won, Lost and Unqualified.
- This is the core R1 API foundation, not the complete locked specification. CSV import, staff roster assignment, full audit log, notification delivery, integrations, conversion to Client, soft-delete administration, field-level masking/OTP and production authentication are still pending.

## Example create payload

```json
{
  "name": "Rahul Sharma",
  "company": "Vertex Technologies",
  "phone": "+91 9876543210",
  "email": "rahul@example.com",
  "source": "Manual add",
  "services": ["CopperWeb", "CopperBrand"],
  "requirementSummary": "Website and brand refresh"
}
```

The API generates the lead ID, first-response deadline and initial assignment task. Never send a browser-generated lead ID.
