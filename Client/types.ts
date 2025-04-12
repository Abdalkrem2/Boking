// types.ts
export type SeatStatus = "available" | "selected" | "booked";
export type SeatType = "VIP" | "GOLD" | "STANDARD";

export interface Seat {
  id: string;
  type: SeatType;
  price: number;
  status: SeatStatus;
  row: string;
  number: number;
}

export interface SeatTypeConfig {
  name: SeatType;
  color: string;
  price: number;
  image: string;
  description?: string;
}
