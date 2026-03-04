import type {
  SearchResponse,
  SuggestionItem,
  DomainRecord,
  PurchasePreview,
  DomainSearchResult,
  DNSRecord,
  RenewalInfo,
} from "./types";

const API = "/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error || "Request failed");
  }
  return res.json();
}

export const api = {
  // Auth
  register: (data: { username: string; password: string; confirm: string }) =>
    request<{ message: string }>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { username: string; password: string }) =>
    request<{ username: string }>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => request<{ message: string }>("/logout", { method: "POST" }),

  me: () => request<{ username: string; contactIds: string[] }>("/me"),

  // Dashboard
  dashboard: () => request<{ domains: DomainRecord[] }>("/dashboard"),

  // Search
  search: (q: string, tlds: string) =>
    request<SearchResponse>(
      `/search?q=${encodeURIComponent(q)}&tlds=${encodeURIComponent(tlds)}`
    ),

  suggestions: (q: string, tlds: string) =>
    request<{ suggestions: SuggestionItem[] }>(
      `/suggestions?q=${encodeURIComponent(q)}&tlds=${encodeURIComponent(tlds)}`
    ),

  // Contacts
  listContacts: () =>
    request<{
      contacts: {
        id: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        error?: string;
      }[];
    }>("/contacts"),

  deleteContact: (id: string) =>
    request<{ message: string }>(`/contacts/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  createContact: (data: {
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    street: string;
    city: string;
    postalCode: string;
    stateProvince: string;
    phonePrefix: string;
    phoneNumber: string;
    organization?: string;
  }) =>
    request<{ contactId: string }>("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Purchase
  purchasePreview: (domain: string) =>
    request<PurchasePreview>(`/purchase/${encodeURIComponent(domain)}`),

  purchaseConfirm: (data: {
    domain: string;
    contactId: string;
    period: number;
  }) =>
    request<{ operationId: string; message: string }>("/purchase", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Domain management
  domainOverview: (name: string) =>
    request<{ detail: DomainSearchResult }>(`/domains/${name}`),

  pendingOps: (name: string) =>
    request<{ pendingOperations: { id: string; type: string }[] }>(
      `/domains/${name}/pending`
    ),

  dnsList: (name: string) =>
    request<{ records: DNSRecord[] }>(`/domains/${name}/dns`),

  dnsCreate: (
    name: string,
    data: { type: string; subName?: string; values: string[]; ttl: number }
  ) =>
    request<{ message: string }>(`/domains/${name}/dns`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  dnsDelete: (name: string, id: string) =>
    request<{ message: string }>(`/domains/${name}/dns/${id}`, {
      method: "DELETE",
    }),

  flagsGet: (name: string) =>
    request<{ flags: Record<string, unknown> }>(`/domains/${name}/flags`),

  flagsUpdate: (name: string, data: Record<string, string>) =>
    request<{ message: string }>(`/domains/${name}/flags`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  renewalInfo: (name: string) =>
    request<{ renewal: RenewalInfo }>(`/domains/${name}/renewal`),

  renew: (name: string, data: { period: number }) =>
    request<{ message: string }>(`/domains/${name}/renew`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
