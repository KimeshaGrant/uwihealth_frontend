import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";

const schedule = {
  monday: [
    { time: "09:00", patient: "Danielle Tulloch", type: "General Consult", duration: 30 },
    { time: "09:30", patient: "Andre Traill", type: "Follow-up", duration: 30 },
    { time: "10:00", patient: "Kimesha Grant", type: "General Consult", duration: 30 },
    { time: "10:30", patient: "—", type: "Buffer", duration: 15 },
    { time: "11:00", patient: "Marissa O'Meally", type: "Respiratory", duration: 30 },
    { time: "11:30", patient: "John Smith", type: "General Consult", duration: 30 },
  ],
  tuesday: [
    { time: "09:00", patient: "Jane Doe", type: "Mental Health", duration: 45 },
    { time: "10:00", patient: "Mike Brown", type: "General Consult", duration: 30 },
    { time: "10:30", patient: "Sarah Lee", type: "Follow-up", duration: 30 },
  ],
};

const DoctorSchedule = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground mt-1">View your daily and weekly appointments.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="size-4" /> Week of Apr 14
        </Button>
      </div>

      <Tabs defaultValue="monday">
        <TabsList>
          <TabsTrigger value="monday">Monday</TabsTrigger>
          <TabsTrigger value="tuesday">Tuesday</TabsTrigger>
          <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
          <TabsTrigger value="thursday">Thursday</TabsTrigger>
          <TabsTrigger value="friday">Friday</TabsTrigger>
        </TabsList>

        {Object.entries(schedule).map(([day, slots]) => (
          <TabsContent key={day} value={day} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base capitalize">{day}'s Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {slots.map((slot, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      slot.type === "Buffer" ? "bg-muted/30 border border-dashed border-border" : "bg-surface hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-muted-foreground w-14">{slot.time}</span>
                      <div>
                        <p className="font-medium text-sm">{slot.patient}</p>
                        <p className="text-xs text-muted-foreground">{slot.type} · {slot.duration}min</p>
                      </div>
                    </div>
                    {slot.type !== "Buffer" && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="size-3 mr-1" /> {slot.duration}m
                        </Badge>
                        <Button variant="outline" size="sm" className="text-xs">
                          View
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        {["wednesday", "thursday", "friday"].map((day) => (
          <TabsContent key={day} value={day} className="mt-4">
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground text-sm">
                No appointments scheduled for {day}.
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DoctorSchedule;
