import { request } from "../../api/client";
import type { Property } from "../../types";

export const propertyApi = {
  list: async () =>
    (await request<{ data: Property[] }>("/properties/getAllProperty")).data,
  get: async (id: number) =>
    (await request<{ data: Property }>(`/properties/getById/${id}`)).data,
};
