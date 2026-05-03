import { createContext, useContext, useState, ReactNode } from "react";

export interface Appointment {
  id: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: "Confirmed" | "Completed" | "Cancelled" | "No-Show";
}

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, "id" | "status">) => void;
  cancelAppointment: (id: string) => void;
}

const AppointmentsContext = createContext<AppointmentsContextType | null>(null);

export const useAppointments = () => {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments must be used within AppointmentsProvider");
  return ctx;
};

export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const addAppointment = (apt: Omit<Appointment, "id" | "status">) => {
    setAppointments((prev) => [
      ...prev,
      { ...apt, id: crypto.randomUUID(), status: "Confirmed" },
    ]);
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" as const } : a))
    );
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment, cancelAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
};
