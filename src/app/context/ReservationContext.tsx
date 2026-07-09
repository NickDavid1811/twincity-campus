import { createContext, useContext, useMemo, useState } from 'react';
import type { Reservation, ReservationStatus } from '../types/reservation';

const initialReservations: Reservation[] = [
  {
    id: 'RES-1001',
    title: 'Reunión de equipo',
    building: 'Edificio A',
    room: 'Sala de Reuniones 1',
    date: '2026-07-09',
    startTime: '10:00',
    endTime: '11:00',
    status: 'Activa',
    userName: 'Juan Pérez',
    createdAt: '2026-07-08T09:00:00.000Z',
  },
  {
    id: 'RES-1002',
    title: 'Taller de Innovación',
    building: 'Edificio B',
    room: 'Laboratorio 2',
    date: '2026-07-09',
    startTime: '14:00',
    endTime: '16:00',
    status: 'Activa',
    userName: 'María García',
    createdAt: '2026-07-08T10:30:00.000Z',
  },
];

interface ReservationContextValue {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'> & { status?: ReservationStatus }) => void;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  deleteReservation: (id: string) => void;
}

const ReservationContext = createContext<ReservationContextValue | undefined>(undefined);

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);

  const value = useMemo<ReservationContextValue>(() => ({
    reservations,
    addReservation: (reservation) => {
      setReservations((current) => [
        {
          ...reservation,
          id: `RES-${Date.now()}`,
          status: reservation.status ?? 'Activa',
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
    },
    updateReservationStatus: (id, status) => {
      setReservations((current) =>
        current.map((res) => (res.id === id ? { ...res, status } : res)),
      );
    },
    deleteReservation: (id) => {
      setReservations((current) => current.filter((res) => res.id !== id));
    },
  }), [reservations]);

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>;
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations debe usarse dentro de ReservationProvider');
  }
  return context;
}
