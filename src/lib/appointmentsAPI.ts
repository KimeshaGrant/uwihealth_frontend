import { API_BASE_URL } from "./api";

export async function registerUser(data: any) {

  const res = await fetch(`${API_BASE_URL}/appointments/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  console.log("REGISTER RAW RESPONSE:", text);

  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Server did not return valid JSON");
  }

  if (!res.ok) throw new Error(result.error || "Registration failed");

  return result;
}

export async function loginUser(data: any) {
  const res = await fetch(`${API_BASE_URL}/appointments/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error);
  return result;
}

export async function bookAppointment(data: {
  userId: number;
  doctorId: number;
  date: string;
  time: string;
  duration: string;
}) {
  const res = await fetch(`${API_BASE_URL}/appointments/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || result.message || "Booking failed");
  return result;
}

export async function getMyAppointments(userId: number) {
  const res = await fetch(`${API_BASE_URL}/appointments/my-appointments/${userId}`);
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to fetch appointments");
  }

  return result;
}

export async function cancelAppointmentApi(appointmentId: number) {
  const res = await fetch(`${API_BASE_URL}/appointments/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointmentId }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Cancellation failed");
  }

  return result;
}

export async function checkInPatient(data: {
  userId: number;
  appointmentId: number;
  doctorId: number;
  date: string;
}) {
  const res = await fetch(`${API_BASE_URL}/appointments/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Check-in failed");
  return result;
}

export async function completeAppointment(data: {
  doctorId: number;
  date: string;
}) {
  const res = await fetch(`${API_BASE_URL}/appointments/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Completion failed");
  return result;
}

export async function getQueue(doctorId: number, date: string) {
  const res = await fetch(
    `${API_BASE_URL}/appointments/queue/${doctorId}/${date}`
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to fetch queue");
  return result;
}


export async function getNowServing(doctorId: number, date: string) {
  const res = await fetch(
    `${API_BASE_URL}/appointments/now-serving/${doctorId}/${date}`
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to fetch now serving");
  return result;
}

export async function getWaitTime(doctorId: number, date: string) {
  const res = await fetch(
    `${API_BASE_URL}/appointments/waittime/${doctorId}/${date}`
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to fetch wait time");
  return result;
}