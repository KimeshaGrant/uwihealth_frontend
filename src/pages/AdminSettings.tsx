import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AdminSettings = () => {
  const handleSave = () => toast.success("Settings saved successfully");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure global policies and system parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Appointment Policies</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Default Appointment Duration (minutes)</Label>
              <Input type="number" defaultValue={30} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Buffer Time Between Appointments (minutes)</Label>
              <Input type="number" defaultValue={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Maximum Daily Capacity Per Doctor</Label>
              <Input type="number" defaultValue={16} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Minimum Cancellation Lead Time</Label>
              <Select defaultValue="2">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Notification Settings</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Confirmations</p>
                <p className="text-xs text-muted-foreground">Send email upon booking</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">SMS Reminders</p>
                <p className="text-xs text-muted-foreground">24h before appointment</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Waitlist Promotion</p>
                <p className="text-xs text-muted-foreground">Auto-notify when slot opens</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">No-Show Alerts</p>
                <p className="text-xs text-muted-foreground">Alert admin on no-shows</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Clinic Hours</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm w-24">{day}</span>
                <div className="flex items-center gap-2">
                  <Input type="time" defaultValue="08:30" className="w-28 text-xs" />
                  <span className="text-muted-foreground text-xs">to</span>
                  <Input type="time" defaultValue="16:30" className="w-28 text-xs" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Queue Management</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Walk-in Queue Limit</Label>
              <Input type="number" defaultValue={20} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">AI Chatbot</p>
                <p className="text-xs text-muted-foreground">Enable AI assistant for patients</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Wait Time Prediction</p>
                <p className="text-xs text-muted-foreground">Show estimated wait times</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save All Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
