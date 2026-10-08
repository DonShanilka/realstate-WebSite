import { jsonBody, request } from "../../api/client";
import type { AssistantResponse } from "../../types";
export const assistantApi = { ask: (question: string) => request<AssistantResponse>("/assistant/property", { method: "POST", ...jsonBody({ question }) }) };
