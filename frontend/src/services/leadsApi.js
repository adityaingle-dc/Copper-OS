
import { getToken } from "./authApi";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      payload.message || `Request failed (${response.status})`
    );

    error.status = response.status;
    error.details = payload.details;

    // Clear an expired or invalid session.
    if (response.status === 401) {
      window.dispatchEvent(new Event("copper:unauthorized"));
    }

    throw error;
  }

  return payload;
}

export const mapLead = (lead) => ({
  ...lead,
  id: lead.leadId,
  name: lead.name,
  company: lead.company || "Individual",
  source: lead.source === "Manual add" ? "Manual" : lead.source,
  confidence: lead.winConfidence,
  value: lead.expectedDealValue || 0,
  owner: lead.ownerName || null,
  nextStep: lead.nextStepText,
  due: lead.nextStepDueAt
    ? new Date(lead.nextStepDueAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—",
  sla: lead.slaStatus || "Pending",
  age: lead.createdAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(lead.createdAt).getTime()) / 86400000
        )
      )
    : 0,
  initials: (lead.name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase(),
  avatar: "bg-[#EADFD5] text-[#875438]",
});

export const leadsApi = {
  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();

    const result = await request(
      `/leads${query ? `?${query}` : ""}`
    );

    return {
      ...result,
      data: result.data.map(mapLead),
    };
  },

  get: async (id) => {
    const result = await request(
      `/leads/${encodeURIComponent(id)}`
    );

    return {
      ...result,
      data: {
        ...mapLead(result.data),
        activities: result.data.activities || [],
      },
    };
  },

  create: async (data) => {
    const result = await request("/leads", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      ...result,
      data: mapLead(result.data),
    };
  },

  update: async (id, data) => {
    const result = await request(
      `/leads/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

    return {
      ...result,
      data: mapLead(result.data),
    };
  },

  addActivity: (id, data) =>
    request(`/leads/${encodeURIComponent(id)}/activities`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateActivity: (id, data) =>
    request(`/leads/activities/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  changeStage: async (id, data) => {
    const result = await request(
      `/leads/${encodeURIComponent(id)}/stage`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

    return {
      ...result,
      data: mapLead(result.data),
    };
  },

  assign: async (id, data) => {
    const result = await request(
      `/leads/${encodeURIComponent(id)}/assignment`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

    return {
      ...result,
      data: mapLead(result.data),
    };
  },
};
