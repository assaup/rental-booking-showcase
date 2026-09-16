import type { Equipment } from "@/server/mock/equipment";

const BASE_URL = 'http://localhost:3000'

export interface EquipmentListResponse {
    items: Equipment[],
    total: number,
    page: number,
    limit: number,
    totalPages: number
}

export async function getEquipmentList(
    query:URLSearchParams
): Promise<EquipmentListResponse> {
    const res = await fetch(`${BASE_URL}/api/equipment?${query}`, {
    cache: "no-store",
  })
    if (!res.ok){
        throw new Error(`Ошибка API: ${res.status}`)
    }
  return res.json()
}

export async function getEquipmentById(id: string): Promise<Equipment | null> {
  const res = await fetch(`${BASE_URL}/api/equipment/${id}`, { cache: "no-store" });

  if (res.status === 404) return null

  if (!res.ok){
    throw new Error(`Ошибка API: ${res.status}`)
  }

  return res.json()
}