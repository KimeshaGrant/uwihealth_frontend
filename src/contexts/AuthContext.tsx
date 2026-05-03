import { createContext, useContext, useState, ReactNode } from "react";
import { loginUser } from "@/lib/appointmentsApi";

export type UserRole = "patient" | "doctor" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

const login = async (
  email: string,
  password: string,
  role: UserRole
): Promise<boolean> => {
  try {
    const result = await loginUser({ email, password });

    setUser({
      id: String(result.id),
      name: `${result.fname} ${result.lname}`,
      email: result.email,
      role,
    });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
