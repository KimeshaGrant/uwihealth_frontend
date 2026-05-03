import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Clock, User, BarChart3, Settings, LogOut, Stethoscope, Users, LayoutDashboard, MessageSquare } from "lucide-react";
import { ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const patientNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="size-4" /> },
    { label: "Book Appointment", href: "/book", icon: <Calendar className="size-4" /> },
    { label: "My Appointments", href: "/appointments", icon: <Clock className="size-4" /> },
    { label: "Live Queue", href: "/queue", icon: <Users className="size-4" /> },
    { label: "AI Assistant", href: "/chat", icon: <MessageSquare className="size-4" /> },
  ];

  const doctorNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="size-4" /> },
    { label: "My Schedule", href: "/schedule", icon: <Calendar className="size-4" /> },
    { label: "Live Queue", href: "/queue", icon: <Users className="size-4" /> },
    { label: "Patients", href: "/patients", icon: <User className="size-4" /> },
  ];

  const adminNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="size-4" /> },
    { label: "Analytics", href: "/analytics", icon: <BarChart3 className="size-4" /> },
    { label: "Queue Monitor", href: "/queue", icon: <Users className="size-4" /> },
    { label: "Doctors", href: "/doctors", icon: <Stethoscope className="size-4" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="size-4" /> },
  ];

  const navItems = user?.role === "doctor" ? doctorNav : user?.role === "admin" ? adminNav : patientNav;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="size-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-tight">Systems876</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">UWI Health Centre</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center">
              <User className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={logout}>
            <LogOut className="size-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
