export interface Event {
  id: string;
  name: string;
  date: Date;                  
  location: string;
  producerId: string;
  promoters: string[];           
  createdAt: Date;
  updatedAt: Date;
}
