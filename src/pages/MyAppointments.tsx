import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, X } from "lucide-react";
import { toast } from "sonner";
import {
  getMyAppointments,
  cancelAppointmentApi,
  checkInPatient,
} from "@/lib/appointmentsApi";
import {
  notifyCancel,
  notifyCheckIn,
  notifyError,
} from "@/lib/notifications";

interface Appointment {
  apid: number;
  id: number;
  did: number;
  sdate: string;
  stime: string;
  duration: string;
  is_canceled: boolean;
}

const statusColors: Record<string, string> = {
  Confirmed: "bg-primary/10 text-primary",
  Completed: "bg-accent/10 text-accent",
  Cancelled: "bg-destructive/10 text-destructive",
  "No-Show": "bg-warning/10 text-warning",
};

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const loadAppointments = async () => {
    if (!user) return;

    try {
      const data = await getMyAppointments(Number(user.id));
      setAppointments(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const upcoming = appointments.filter((a) => !a.is_canceled);
  const past = appointments.filter((a) => a.is_canceled);

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedId(null);
  };

  const handleCancel = async () => {
    if (!selectedId) return;

    const apt = appointments.find(a => a.apid === selectedId);
    if (!apt) return;

    try {
      await cancelAppointmentApi({
        appointmentId: selectedId,
        doctorId: apt.did,
        date: apt.sdate
      });

      setAppointments(prev =>
        prev.map(a =>
          a.apid === selectedId
            ? { ...a, is_canceled: true }
            : a
        )
      );

      notifyCancel();

    } catch (err: any) {
      notifyError(err.message || "Cancellation failed");
    }

    closeDialog();
  };

  const handleCheckIn = async (apt: Appointment) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      await checkInPatient({
        userId: Number(user.id),
        appointmentId: apt.apid,
        doctorId: apt.did,
        date: apt.sdate.split("T")[0],
      });

      notifyCheckIn();
      
    } catch (err: any) {
      notifyError(err.message || "Check-in failed");
    }
  };

  const AppointmentCard = ({ apt }: { apt: Appointment }) => {
    const formattedDate = new Date(apt.sdate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const formattedTime = apt.stime;

    const status = apt.is_canceled ? "Cancelled" : "Confirmed";

    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="text-center px-3 py-2 bg-card rounded-lg border border-border min-w-[70px]">
            <p className="text-sm font-semibold font-mono">{formattedDate}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Doctor {apt.did}</p>
          </div>

          <div>
            <p className="font-medium text-sm">Appointment</p>
            <p className="text-xs text-muted-foreground">
              Doctor ID: {apt.did} · {formattedTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={statusColors[status]} variant="secondary">
            {status}
          </Badge>

          {!apt.is_canceled && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCheckIn(apt)}
              >
                Check In
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  setSelectedId(apt.apid);
                  setShowDialog(true);
                }}
              >
                <X className="size-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Appointments</h1>
        <p className="text-muted-foreground mt-1">View and manage your bookings.</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-1.5">
            <Calendar className="size-3.5" /> Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <Clock className="size-3.5" /> History ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              {loading ? (
                <p className="text-center text-muted-foreground py-8 text-sm">Loading...</p>
              ) : upcoming.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No upcoming appointments. Book one to get started!
                </p>
              ) : (
                upcoming.map((apt) => <AppointmentCard key={apt.apid} apt={apt} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              {loading ? (
                <p className="text-center text-muted-foreground py-8 text-sm">Loading...</p>
              ) : past.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No past appointments yet.
                </p>
              ) : (
                past.map((apt) => <AppointmentCard key={apt.apid} apt={apt} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg text-center space-y-4">
            <p>Are you sure you want to cancel this appointment?</p>

            <div className="flex justify-center gap-4">
              <button onClick={handleCancel} className="bg-green-500 text-white px-4 py-2 rounded">Yes</button>
              <button onClick={closeDialog} className="bg-red-500 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;