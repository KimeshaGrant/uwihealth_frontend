import { useEffect, useState } from "react";
import { getDoctors } from "@/lib/appointmentsApi";

const Doctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await getDoctors();
      console.log("DOCTORS:", data);
      setDoctors(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Doctors</h1>

      {doctors.length === 0 ? (
        <p>No doctors available</p>
      ) : (
        doctors.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-lg bg-white shadow hover:shadow-md transition"
          >
            <p className="font-medium">Dr. {doc.name}</p>
            <p className="text-sm text-muted-foreground">
              {doc.speciality}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Doctors;