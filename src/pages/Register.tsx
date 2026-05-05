import { useState } from "react";
import { registerUser } from "@/lib/appointmentsApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Activity, Stethoscope, Shield, Calendar } from "lucide-react";

const Register = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
  const navigate = useNavigate();

const handleRegister = async () => {
  const cleanEmail = email.trim().toLowerCase();
  if (!fname.trim() || !lname.trim() || !cleanEmail || !password.trim()) {
    toast.error("All fields are required");
    return;
  }

  //email validation 
  const uwiEmailRegex = /^[a-zA-Z0-9._%+-]+@(uwi\.edu|mona\.uwi\.edu|mymona\.uwi\.edu)$/i;

  if (!uwiEmailRegex.test(cleanEmail)) {
    toast.error("Please use a valid UWI Mona email (e.g. john@mona.uwi.edu)");
    return;
  }

  //password rules
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.]).{6,}$/;

  if (!passwordRegex.test(password)) {
    toast.error(
      "Password must be at least 6 characters and include a letter, a number, and a symbol"
    );
    return;
  }

  try {
    await registerUser({
      fname,
      lname,
      email: cleanEmail,
      password,
      role,
    });

    toast.success("Account created!");
    navigate("/login");

  } catch (err: any) {
    console.error("ERROR:", err);
    toast.error(err.message || "Registration failed");
  }
};

return (
  <div style={{ position: "relative", zIndex: 1000 }}>
    <div className="p-6 max-w-md mx-auto space-y-4">
      
      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="size-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">UWI SmartQ</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          UWI Health Centre — Registration
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create Account</h2>

        <input
          placeholder="First Name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
        />

        <input
          placeholder="Last Name"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="space-y-2">
  <p className="text-sm font-medium">Select Role</p>

  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => setRole("patient")}
      className={`px-3 py-1 rounded ${
        role === "patient" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      Patient
    </button>

    <button
      type="button"
      onClick={() => setRole("doctor")}
      className={`px-3 py-1 rounded ${
        role === "doctor" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      Doctor
    </button>

    <button
      type="button"
      onClick={() => setRole("admin")}
      className={`px-3 py-1 rounded ${
        role === "admin" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      Admin
    </button>
  </div>
</div>

        <br />

      <button
  type="button"
  onClick={handleRegister}
  className="bg-blue-500 text-white p-2 rounded mt-8 hover:bg-gray-500"
>
  Create Account
</button>

<p className="text-sm text-center mt-4">
  Already have an account?{" "}
  <span
    className="text-blue-500 cursor-pointer underline"
    onClick={() => navigate("/login")}
  >
    Login
  </span>
</p>

      </div>
    </div>
  </div>
);
};

export default Register;

