export interface Message { id: number; sender_id: number; receiver_id: number; property_id?: number | null; message: string; created_at?: string }
export interface MessagesState { conversations: Record<number, Message[]>; status: "idle" | "loading" | "succeeded" | "failed"; error: string | null }
