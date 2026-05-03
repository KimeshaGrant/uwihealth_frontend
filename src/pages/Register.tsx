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
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser({ fname, lname, email, password });

      toast.success("Account created! You can now log in");
      navigate("/login");

    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
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

      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create Account</h2>
        
        <input placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} />
        <input placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        
        <br />

        <button onClick={handleRegister} className="bg-blue-500 text-white p-2 rounded mt-8 hover:bg-gray-500">Create Account</button>

      </div>
      
    </div>
  );
};

export default Register;

