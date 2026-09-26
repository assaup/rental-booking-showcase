import { type Booking } from "@/shared/api/booking";

export interface BookingRecord extends Booking {
  userId: string;
}

export const bookings: BookingRecord[] = [];