import type { Equipment } from "@/server/mock/equipment";
import { throwApiError } from "./error";

const BASE_URL = "http://localhost:3000";

export interface EquipmentListItem extends Equipment {
  free: number;
}

export interface EquipmentListResponse {
  items: EquipmentListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getEquipmentList(
  query: URLSearchParams,
): Promise<EquipmentListResponse> {
  const res = await fetch(`${BASE_URL}/api/equipment?${query}`, {
    cache: "no-store",
  });
  if (!res.ok) await throwApiError(res);
  return res.json();
}

export async function getEquipmentById(
  id: string,
  from?: string,
  to?: string,
): Promise<EquipmentListItem | null> {

  const query = new URLSearchParams();

  if (from && to) {
    query.set('from', from)
    query.set('to', to)
  }
  const suffix = query.toString() ? `?${query}` : "";
  const res = await fetch(`${BASE_URL}/api/equipment/${encodeURIComponent(id)}${suffix}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) await throwApiError(res);

  return res.json();
}
