import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip } from "recharts";

const appointmentData = [
  { day: "Mon", appointments: 38, noShows: 3 },
  { day: "Tue", appointments: 42, noShows: 2 },
  { day: "Wed", appointments: 35, noShows: 5 },
  { day: "Thu", appointments: 40, noShows: 1 },
  { day: "Fri", appointments: 30, noShows: 4 },
];

const waitTimeData = [
  { hour: "8AM", avgWait: 5 },
  { hour: "9AM", avgWait: 12 },
  { hour: "10AM", avgWait: 22 },
  { hour: "11AM", avgWait: 18 },
  { hour: "12PM", avgWait: 8 },
  { hour: "1PM", avgWait: 15 },
  { hour: "2PM", avgWait: 25 },
  { hour: "3PM", avgWait: 20 },
  { hour: "4PM", avgWait: 10 },
];

const visitTypes = [
  { name: "General Consult", value: 45 },
  { name: "Follow-up", value: 20 },
  { name: "Mental Health", value: 15 },
  { name: "Respiratory", value: 12 },
  { name: "Other", value: 8 },
];

const COLORS = ["hsl(210, 90%, 50%)", "hsl(160, 60%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(220, 10%, 70%)"];

const Analytics = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Operational insights and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments per day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} />
                <Tooltip />
                <Bar dataKey="appointments" fill="hsl(210, 90%, 50%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="noShows" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Wait time trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average Wait Time (minutes)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={waitTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="hour" className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} />
                <Tooltip />
                <Line type="monotone" dataKey="avgWait" stroke="hsl(160, 60%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Visit types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visit Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={visitTypes} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {visitTypes.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-3 justify-center">
              {visitTypes.map((type, i) => (
                <div key={type.name} className="flex items-center gap-2 text-xs">
                  <div className="size-2 rounded-full" style={{ background: COLORS[i] }} />
                  {type.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Total Appointments This Week", value: "185" },
              { label: "No-Show Rate", value: "8.1%" },
              { label: "Average Wait Time", value: "15 min" },
              { label: "Peak Hour", value: "10:00 AM" },
              { label: "Busiest Day", value: "Tuesday" },
              { label: "Clinic Utilization", value: "78%" },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <span className="font-medium font-mono text-sm">{metric.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
