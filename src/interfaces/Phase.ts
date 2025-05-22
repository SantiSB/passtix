export interface Phase {
  id: string;
  name: string;
  eventId: string;
  price: number;
  order: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  maxEntryTime?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
