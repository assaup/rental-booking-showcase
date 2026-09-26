import { bookings } from "@/shared/api/booking";
import type { Equipment } from "./mock/equipment";

export function isBookedInRange(
  item: Equipment,
  from: string,
  to: string,
): boolean {
  if (!item.bookedDates) return false;

  return item.bookedDates.some((d) => from <= d && d < to);
}

function bookedQty(itemId: string, from: string, to: string): number {
  let total = 0;
  for (const booking of bookings) {
    if (booking.from < to && from < booking.to) {
      const item = booking.items.find((b) => b.id === itemId);
      total += item?.qty ?? 0;
    }
  }
  return total;
}

export function freeQty(item: Equipment, from: string, to: string): number {
  if (isBookedInRange(item, from, to)) return 0;
  return Math.max(0, item.stock - bookedQty(item.id, from, to));
}
