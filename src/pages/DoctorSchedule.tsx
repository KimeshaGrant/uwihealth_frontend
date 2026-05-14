import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";
import { getDoctorSchedule, completeAppointment,updateStatus, updateDoctorStatus, getDoctorStatus} from "@/lib/appointmentsApi";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";


const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [doctorStatus, setDoctorStatus] = useState("Available");

  const { user } = useAuth();
  const doctorId = Number(user?.did);

  const today = new Date();
  const date =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const loadSchedule = async () => {
    try {
      const res = await getDoctorSchedule(doctorId, date);
      setSchedule(res.schedule || []);
    } catch (err) {
      console.error(err);
    }
  };

 useEffect(() => {
  loadSchedule();

  const loadStatus = async () => {
    try {
      const res = await getDoctorStatus(doctorId);
      setDoctorStatus(res.status || "Available");
    } catch (err) {
      console.error(err);
    }
  };

  loadStatus();

  const interval = setInterval(() => {
    loadSchedule();
  }, 5000);

  return () => clearInterval(interval);
}, []);

 const handleComplete = async () => {
  console.log("CLICKED COMPLETE");
  try {
    const res = await completeAppointment({
      doctorId,
      date,
    });

    console.log("COMPLETE RESPONSE:", res);

    if (res.message.includes("ERROR")) {
  //Shows friendly message
} else {
  alert("Appointment completed");
}

    loadSchedule();

  } catch (err: any) {
    console.error(err);
    alert(err.message || "Completion failed");
  }
};

const handleStatus = async (apid: number, status: string) => {
  try {
    await updateStatus({ apid, status });
    loadSchedule();
  } catch (err: any) {
    console.error(err);
  }
};

const handleDoctorStatusChange = async (status: string) => {
  try {
    await updateDoctorStatus({ doctorId, status }); // send to backend
    setDoctorStatus(status); // update UI
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground mt-1">
            View your daily appointments.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="size-4" /> Today
        </Button>
      </div>
      <div className="flex gap-2 mt-2">

  {["Available", "Busy", "Lunch", "Offline"].map((status) => (
    <Button
      key={status}
      variant={doctorStatus === status ? "default" : "outline"}
      size="sm"
      onClick={() => handleDoctorStatusChange(status)}
    >
      {status}
    </Button>
  ))}

</div>

      <Tabs defaultValue="today">

        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today's Appointments</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">

              {schedule.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  No appointments scheduled for today.
                </div>
              ) : (
                schedule.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm w-14">
                        {slot.stime}
                      </span>

                      <div>
                        <p className="font-medium text-sm">
                          {slot.patient}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {slot.duration} mins • {slot.status || "Waiting"}
                       </p>
                      </div>
                    </div>
<div className="flex items-center gap-2">

  <Badge variant="secondary">
    <Clock className="size-3 mr-1" />
    {slot.duration}
  </Badge>

  {i === 0 && (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleStatus(slot.apid, "In-Progress")}
      >
        Start
      </Button>

      <Button
        variant="default"
        size="sm"
        onClick={handleComplete}
      >
        Complete
      </Button>
    </>
  )}

</div>
                  </div>
                ))
              )}

            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default DoctorSchedule;