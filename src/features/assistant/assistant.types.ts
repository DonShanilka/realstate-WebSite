import type { AssistantResponse } from "../../types";

export interface AssistantTurn {
  question: string;
  response: AssistantResponse;
}

export interface AssistantState {
  turns: AssistantTurn[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
