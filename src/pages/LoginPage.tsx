import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Stethoscope, Shield, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both your UWI email and password to sign in.");
      return;
    }

    const uwiEmailRegex = /^[a-zA-Z0-9._%+-]+@(uwi\.edu|mona\.uwi\.edu|mymona\.uwi\.edu)$/i;
    if (!uwiEmailRegex.test(email.trim())) {
      toast.error("Please enter a valid UWI email address (e.g. john.doe@uwi.edu).");
      return;
    }

    const success = await login(email.trim(), password, role);

    if (!success) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Login successful!");
    }
  };

  const roleIcons: Record<UserRole, React.ReactNode> = {
    patient: <Calendar className="size-5" />,
    doctor: <Stethoscope className="size-5" />,
    admin: <Shield className="size-5" />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="size-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">UWI SmartQ</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            UWI Health Centre — Smart Booking & Queue Management System
          </p>
        </div>

        {/* CARD */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Access your portal to manage appointments</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="patient" className="gap-1.5 text-xs">
                  {roleIcons.patient} Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="gap-1.5 text-xs">
                  {roleIcons.doctor} Doctor
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-1.5 text-xs">
                  {roleIcons.admin} Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">UWI Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. john.doe@uwi.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>

              <p className="text-sm text-center text-muted-foreground mt-4">
                First time user?{" "}
                <span
                  className="text-primary cursor-pointer hover:underline"
                  onClick={() => navigate("/register")}
                >
                  Create an account
                </span>
              </p>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;