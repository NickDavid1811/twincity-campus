export type ReservationStatus = 'Activa' | 'Cancelada' | 'Completada';

export interface Reservation {
  id: string;
  title: string;
  building: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  userName: string;
  createdAt: string;
}
