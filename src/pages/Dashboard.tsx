import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getQueue, getWaitTime, getNowServing, getMyAppointments, getDoctorSchedule, getDoctors } from "@/lib/appointmentsApi";

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [inQueue, setInQueue] = useState(0);
  const [avgWait, setAvgWait] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
  const [activeDoctors, setActiveDoctors] = useState(0);

  const doctorId = Number(user?.did);

  const today = new Date();
  const date =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const loadDashboardData = async () => {
    try {
      // Stops admin from using doctor logic
      if (isAdmin) return;

      // PATIENT VIEW
      if (user?.role === "patient") {
        const myAppts = await getMyAppointments(Number(user.id));
        const completedCount = myAppts.filter((a) => a.status === "completed").length;
        setCompleted(completedCount);
        setAppointmentsToday(myAppts.length || 0);

        const queueRes = await getQueue(doctorId, date);
        setInQueue(queueRes.queue?.length || 0);

        const waitRes = await getWaitTime(doctorId, date);
        setAvgWait(waitRes.estimatedWaitTime || 0);

        return;
      }

      // DOCTOR VIEW
      const queueRes = await getQueue(doctorId, date);
      const waitRes = await getWaitTime(doctorId, date);
      const nowServingRes = await getNowServing(doctorId, date);
      const scheduleRes = await getDoctorSchedule(doctorId, date);
      setSchedule(scheduleRes.schedule || []);

      setInQueue(queueRes.queue?.length || 0);
      setAvgWait(waitRes.estimatedWaitTime || 0);

      const currentPos = nowServingRes.nowServing?.queue_position || 0;
      setCompleted(currentPos > 0 ? currentPos - 1 : 0);

      setAppointmentsToday(
        (queueRes.queue?.length || 0) +
        (currentPos - 1 > 0 ? currentPos - 1 : 0)
      );

    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ADMIN DATA LOADER (SEPARATE)
  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      const doctors = await getDoctors();

      let totalQueue = 0;
      let totalWait = 0;
      let totalPatientsCount = 0;
      let activeDocCount = 0;

      for (const doc of doctors) {
        if (doc) {
          activeDocCount++;

          const queueRes = await getQueue(doc.id, date);
          const queue = queueRes.queue || [];

          totalQueue += queue.length;
          totalPatientsCount += queue.length;

          queue.forEach((q: any) => {
            totalWait += q.estimatedWait || 0;
          });
        }
      }

      const avg =
        totalPatientsCount > 0
          ? Math.round(totalWait / totalPatientsCount)
          : 0;

      setTotalPatients(totalPatientsCount);
      setQueueCount(totalQueue);
      setAvgWait(avg);
      setActiveDoctors(activeDocCount);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {user?.name || "User"}.
        </h1>
        <p className="text-muted-foreground mt-1">
          Here is your real-time dashboard overview.
        </p>
      </div>

      {/* 🔥 ADMIN VIEW */}
      {isAdmin ? (
        <div className="grid grid-cols-4 gap-4">

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase">Patients Today</p>
              <p className="text-2xl font-semibold">{totalPatients}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase">In Queue</p>
              <p className="text-2xl font-semibold text-blue-600">{queueCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase">Avg Wait (AI)</p>
              <p className="text-2xl font-semibold">{avgWait}m</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase">Active Doctors</p>
              <p className="text-2xl font-semibold">{activeDoctors}</p>
            </CardContent>
          </Card>

        </div>
      ) : (

        <div className="grid grid-cols-4 gap-4">

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase">Today</p>
              <p className="text-2xl font-semibold">{appointmentsToday}</p>
              <p className="text-sm text-muted-foreground">Appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase">Completed</p>
              <p className="text-2xl font-semibold text-green-600">{completed}</p>
              <p className="text-sm text-muted-foreground">So far today</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase">In Queue</p>
              <p className="text-2xl font-semibold text-blue-600">{inQueue}</p>
              <p className="text-sm text-muted-foreground">Patients waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase">Avg Wait</p>
              <p className="text-2xl font-semibold">
                {avgWait}
                <span className="text-sm text-muted-foreground">m</span>
              </p>
              <p className="text-sm text-muted-foreground">Current average</p>
            </CardContent>
          </Card>

        </div>
      )}

      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-semibold">Today's Appointments</p>

          {schedule.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No appointments today
            </p>
          ) : (
            schedule.map((slot, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-2 rounded bg-surface"
              >
                <span>{slot.patient}</span>
                <span className="text-xs text-muted-foreground">
                  {slot.stime}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;