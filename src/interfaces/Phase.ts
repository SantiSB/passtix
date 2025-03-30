export interface Phase {
  id: string;
  name: string;
  eventId: string;
  price: number;
  order: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
