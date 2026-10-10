import { jsonBody, request } from "../../api/client";
import type { Property } from "../../types";

export interface PropertyAgent {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  profile_image?: string | null;
}

export const propertyApi = {
  list: async () =>
    (await request<{ data: Property[] }>("/properties/getAllProperty")).data,
  get: async (id: number) =>
    (await request<{ data: Property }>(`/properties/getById/${id}`)).data,
  assignedToMe: async () =>
    (await request<{ data: Property[] }>("/properties/assigned-to-me")).data,
  agents: () => request<PropertyAgent[]>("/users/agents"),
  assignAgent: (propertyId: number, agentId: number | null) =>
    request<{ data: Property }>(`/properties/${propertyId}/agent`, {
      method: "PUT",
      ...jsonBody({ agent_id: agentId }),
    }).then((response) => response.data),
};
