import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { bookAppointment } from "@/lib/appointmentsApi";
import { useAuth } from "@/contexts/AuthContext";

const doctors = [
  { id: "1", name: "Dr. B. M. Anglin-Brown", specialty: "Clinical Director", available: true },
  { id: "2", name: "Dr. A. Standard-Goldson", specialty: "General Practice", available: true },
  { id: "3", name: "Dr. J. Anthony", specialty: "General Practice", available: true },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
];

const visitTypes: Record<string, string> = {
  general: "General Consultation",
  followup: "Follow-up Visit",
  mental: "Mental Health",
};

const BookAppointment = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>();
  const [doctor, setDoctor] = useState("");
  const [slot, setSlot] = useState("");
  const [visitType, setVisitType] = useState("");
  const [reason, setReason] = useState("");
  const [booked, setBooked] = useState(false);

 
  const convertTo24Hour = (time: string) => {
    const [t, modifier] = time.split(" ");
    let [hours, minutes] = t.split(":");
    let h = parseInt(hours);

    if (modifier === "PM" && h !== 12) h += 12;
    if (modifier === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${minutes}:00`;
  };

  const handleBook = async () => {
    if (!date || !doctor || !slot) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!user) {
       toast.error("You must be logged in to book an appointment");
       return;
    }
    
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const time24 = convertTo24Hour(slot);

    const result = await bookAppointment({
    userId: Number(user.id),
    doctorId: Number(doctor),
    date: formattedDate,
    time: time24,
    duration: "00:20:00",
    });

      setBooked(true);
      toast.success(result.message);

    } catch (err: any) {
      toast.error(err.message || "Booking failed");
    }
  };

  if (booked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle2 className="mx-auto mb-4 text-green-500" size={40} />
            <h2 className="text-xl font-semibold">Appointment Confirmed</h2>
            <p className="text-sm mt-2">Your appointment was successfully booked.</p>

            <Button
              className="mt-6"
              onClick={() => {
                setBooked(false);
                setDate(undefined);
                setDoctor("");
                setSlot("");
                setVisitType("");
                setReason("");
              }}
            >
              Book Another
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Book Appointment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Doctor */}
        <Card>
          <CardHeader>
            <CardTitle>Select Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            {doctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setDoctor(doc.id)}
                className={`p-3 border rounded mb-2 cursor-pointer ${
                  doctor === doc.id ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <p>{doc.name}</p>
                <Badge>{doc.specialty}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Date */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </CardContent>
        </Card>

        {/* Time + Submit */}
        <Card>
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((t) => (
                <button
                  key={t}
                  onClick={() => setSlot(t)}
                  className={`p-2 border rounded ${
                    slot === t ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <Label>Visit Type</Label>
              <Select value={visitType} onValueChange={setVisitType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="mental">Mental Health</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label>Notes</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <Button className="w-full mt-4" onClick={handleBook}>
              <Clock className="mr-2" /> Confirm Booking
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default BookAppointment;