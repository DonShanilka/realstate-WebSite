import { jsonBody, request } from "../../api/client";
import type { Property } from "../../types";

export interface PropertyAgent {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  profile_image?: string | null;
}

function normalizeMediaUrl(url: string | null | undefined): string | null {
  return url?.trim() || null;
}

function normalizeVideoUrl(url: string | null | undefined): string | null {
  const normalized = normalizeMediaUrl(url);
  if (!normalized) return null;

  // Seed data adds a property tracking query to Google's public sample-video
  // URLs. Use the canonical sample host and remove the unsupported query.
  try {
    const parsed = new URL(normalized);
    if (
      (parsed.hostname === "storage.googleapis.com" ||
        parsed.hostname === "commondatastorage.googleapis.com") &&
      parsed.pathname.startsWith("/gtv-videos-bucket/sample/")
    ) {
      parsed.hostname = "commondatastorage.googleapis.com";
      parsed.search = "";
      parsed.hash = "";
      return parsed.toString();
    }
  } catch {
    // Preserve non-standard URLs and let the video element report load errors.
  }

  return normalized;
}

function normalizePropertyMedia(property: Property): Property {
  return {
    ...property,
    image_url: normalizeMediaUrl(property.image_url),
    video_url: normalizeVideoUrl(property.video_url),
  };
}

export const propertyApi = {
  list: async () =>
    (await request<{ data: Property[] }>("/properties/getAllProperty"))
      .data.map(normalizePropertyMedia),
  get: async (id: number) =>
    normalizePropertyMedia(
      (await request<{ data: Property }>(`/properties/getById/${id}`)).data,
    ),
  assignedToMe: async () =>
    (await request<{ data: Property[] }>("/properties/assigned-to-me"))
      .data.map(normalizePropertyMedia),
  agents: () => request<PropertyAgent[]>("/users/agents"),
  assignAgent: (propertyId: number, agentId: number | null) =>
    request<{ data: Property }>(`/properties/${propertyId}/agent`, {
      method: "PUT",
      ...jsonBody({ agent_id: agentId }),
    }).then((response) => normalizePropertyMedia(response.data)),
};
