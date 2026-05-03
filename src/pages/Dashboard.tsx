import { useAuth } from "@/contexts/AuthContext";
import { useAppointments } from "@/contexts/AppointmentsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, TrendingUp, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const upcoming = appointments.filter((a) => a.status === "Confirmed");
  const nextApt = upcoming[0];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Good morning, {user?.name?.split(" ")[0]}.
        </h1>
        <p className="text-muted-foreground mt-1">Here's your health centre overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Upcoming</p>
                <p className="text-3xl font-semibold font-mono mt-1">{upcoming.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Appointments booked</p>
              </div>
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Queue Position</p>
                <p className="text-3xl font-semibold font-mono mt-1">—</p>
                <p className="text-xs text-muted-foreground mt-1">Not in queue</p>
              </div>
              <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="size-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Avg Wait</p>
                <p className="text-3xl font-semibold font-mono mt-1">18<span className="text-lg text-muted-foreground">m</span></p>
                <p className="text-xs text-muted-foreground mt-1">Current estimate</p>
              </div>
              <div className="size-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="size-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {nextApt ? (
        <Card className="border-primary/20 bg-primary/[0.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="size-4 text-primary" /> Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="text-center px-4 py-3 bg-primary/10 rounded-xl">
                  <p className="text-2xl font-semibold font-mono text-primary">{nextApt.date.split(" ")[1]?.replace(",", "")}</p>
                  <p className="text-[10px] uppercase tracking-wider text-primary font-medium">{nextApt.date.split(" ")[0]}</p>
                </div>
                <div>
                  <p className="font-medium">{nextApt.type}</p>
                  <p className="text-sm text-muted-foreground">{nextApt.doctor} · {nextApt.time}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">Confirmed</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/appointments">View Details <ArrowRight className="size-3 ml-1" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-sm mb-4">No upcoming appointments.</p>
            <Button asChild>
              <Link to="/book">Book an Appointment</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="group hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link to="/book" className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-1">Book an Appointment</h3>
                <p className="text-sm text-muted-foreground">Browse available doctors and time slots</p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link to="/queue" className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-1">View Live Queue</h3>
                <p className="text-sm text-muted-foreground">Check real-time wait times and positions</p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const todayAppointments = [
    { id: 1, patient: "Patient A", time: "09:00 AM", type: "General Consult", status: "Completed" },
    { id: 2, patient: "Patient B", time: "09:30 AM", type: "Follow-up", status: "In Progress" },
    { id: 3, patient: "Patient C", time: "10:00 AM", type: "General Consult", status: "Checked In" },
    { id: 4, patient: "Patient D", time: "10:30 AM", type: "Respiratory", status: "Waiting" },
    { id: 5, patient: "Patient E", time: "11:00 AM", type: "General Consult", status: "Scheduled" },
  ];

  const statusColor: Record<string, string> = {
    Completed: "bg-muted text-muted-foreground",
    "In Progress": "bg-primary/10 text-primary",
    "Checked In": "bg-accent/10 text-accent",
    Waiting: "bg-warning/10 text-warning",
    Scheduled: "bg-secondary text-secondary-foreground",
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {user?.name}.</h1>
        <p className="text-muted-foreground mt-1">You have 8 appointments scheduled today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Today</p>
          <p className="text-3xl font-semibold font-mono mt-1">8</p>
          <p className="text-xs text-muted-foreground mt-1">Appointments</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Completed</p>
          <p className="text-3xl font-semibold font-mono mt-1 text-accent">1</p>
          <p className="text-xs text-muted-foreground mt-1">So far today</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">In Queue</p>
          <p className="text-3xl font-semibold font-mono mt-1 text-primary">4</p>
          <p className="text-xs text-muted-foreground mt-1">Patients waiting</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Avg Wait</p>
          <p className="text-3xl font-semibold font-mono mt-1">12<span className="text-lg text-muted-foreground">m</span></p>
          <p className="text-xs text-muted-foreground mt-1">Current average</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-muted-foreground w-20">{apt.time}</span>
                  <div>
                    <p className="font-medium text-sm">{apt.patient}</p>
                    <p className="text-xs text-muted-foreground">{apt.type}</p>
                  </div>
                </div>
                <Badge className={statusColor[apt.status]} variant="secondary">{apt.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System overview and operational metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total Today</p>
          <p className="text-3xl font-semibold font-mono mt-1">42</p>
          <p className="text-xs text-muted-foreground mt-1">Appointments</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">No-Shows</p>
          <p className="text-3xl font-semibold font-mono mt-1 text-destructive">3</p>
          <p className="text-xs text-muted-foreground mt-1">7.1% rate</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Capacity</p>
          <p className="text-3xl font-semibold font-mono mt-1">78<span className="text-lg text-muted-foreground">%</span></p>
          <p className="text-xs text-muted-foreground mt-1">Utilization</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Trend</p>
            <TrendingUp className="size-3 text-accent" />
          </div>
          <p className="text-3xl font-semibold font-mono mt-1 text-accent">+12%</p>
          <p className="text-xs text-muted-foreground mt-1">vs last week</p>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Active Doctors</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Dr. B. M. Anglin-Brown", "Dr. A. Standard-Goldson", "Dr. J. Anthony", "Dr. F. Lahee"].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-accent animate-pulse-dot" />
                    <span className="text-sm font-medium">{doc}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">4 in queue</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">System Status</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Booking Engine", status: "Operational" },
                { label: "Queue Management", status: "Operational" },
                { label: "Notifications", status: "Operational" },
                { label: "AI Chatbot", status: "Operational" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-surface">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-accent" />
                    <span className="text-xs text-accent">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  if (user?.role === "doctor") return <DoctorDashboard />;
  if (user?.role === "admin") return <AdminDashboard />;
  return <PatientDashboard />;
};

export default Dashboard;
