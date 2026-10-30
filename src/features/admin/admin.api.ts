import { request } from "../../api/client";

export interface AdminDashboardBooking {
  id: number;
  propertyTitle: string;
  buyerName: string;
  date: string;
  status: string;
}

export interface AdminDashboardData {
  stats: {
    properties: number;
    users: number;
    agents: number;
    bookings: number;
    pending_bookings: number;
    unread_messages: number;
  };
  analytics: { month: string; bookings: number }[];
  recent_bookings: AdminDashboardBooking[];
}

export const adminApi = {
  dashboard: () => request<AdminDashboardData>("/admin/dashboard"),
};
