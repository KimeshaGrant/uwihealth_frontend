import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Users } from "lucide-react";
import { getQueue, getNowServing, getWaitTime } from "@/lib/appointmentsApi";

interface QueueEntry {
  queue_position: number;
  patientName: string;
  appointmentTime: string;
  estimatedWait: number;
}

const statusColors: Record<string, string> = {
  Serving: "bg-accent/10 text-accent",
  "Checked In": "bg-primary/10 text-primary",
  Waiting: "bg-muted text-muted-foreground",
};

const LiveQueue = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [nowServing, setNowServing] = useState<any>(null);
  const [waitTime, setWaitTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState("");

  // hardcode for now, later you can make these dynamic
  const doctorId = 1;
  const date = "2026-04-10";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadQueueData = async () => {
    try {
      setError("");

      const queueRes = await getQueue(doctorId, date);
      const nowServingRes = await getNowServing(doctorId, date);
      const waitTimeRes = await getWaitTime(doctorId, date);

      setQueue(queueRes.queue || []);
      setNowServing(nowServingRes.nowServing || null);
      setWaitTime(waitTimeRes.estimatedWaitTime || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load queue");
    }
  };

  useEffect(() => {
    loadQueueData();

    const interval = setInterval(() => {
      loadQueueData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const waiting = queue.filter((q) => q.queue_position !== nowServing?.queue_position);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Live Queue</h1>
          <p className="text-muted-foreground mt-1">Real-time clinic queue status</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">System Time</p>
          <p className="font-mono text-lg tabular-nums">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4 text-red-500">{error}</CardContent>
        </Card>
      )}

      {/* Now Serving */}
      {nowServing && (
        <Card className="border-accent/30 bg-accent/[0.03]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Now Serving
                </p>
                <p className="text-3xl font-bold text-accent">
                  {nowServing.patientName}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <div className="size-2 rounded-full bg-accent animate-pulse" />
                  Queue Position {nowServing.queue_position}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  <span className="font-mono">{waiting.length}</span> in queue
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Queue Length</p>
            <p className="text-2xl font-semibold font-mono mt-1">{queue.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Wait</p>
            <p className="text-2xl font-semibold font-mono mt-1">
              {waitTime}
              <span className="text-sm text-muted-foreground">m</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Now Serving</p>
            <p className="text-sm font-semibold mt-1">
              {nowServing ? nowServing.patientName : "None"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queue list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-4 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <div className="col-span-2">Position</div>
              <div className="col-span-4">{user?.role !== "patient" ? "Patient" : "Queue"}</div>
              <div className="col-span-3">Appointment Time</div>
              <div className="col-span-3 text-right">Estimated Wait</div>
            </div>

            {queue.length === 0 ? (
              <div className="px-3 py-4 text-sm text-muted-foreground">
                No patients in queue
              </div>
            ) : (
              queue.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 px-3 py-3 rounded-lg bg-surface hover:bg-muted/50 transition-colors items-center"
                >
                  <div className="col-span-2 font-mono font-medium">#{entry.queue_position}</div>
                  <div className="col-span-4 text-sm text-muted-foreground">
                    {entry.patientName}
                  </div>
                  <div className="col-span-3 text-sm text-muted-foreground">
                    {entry.appointmentTime}
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <Badge className={statusColors["Waiting"]} variant="secondary">
                      {entry.estimatedWait} min
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveQueue;