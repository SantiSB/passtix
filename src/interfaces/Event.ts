export interface Event {
  id: string;
  name: string;
  date: string;                  
  location: string;
  producerId: string;
  promoters: string[];           
  createdAt: Date;
  updatedAt: Date;
}
