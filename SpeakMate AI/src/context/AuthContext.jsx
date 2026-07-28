import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const mockUser = {
  name: "Dnyaneshwar",
  email: "learner@speakmate.ai",
  streak: 7,
  dailyGoal: 20,
  role: "ADMIN",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ email, role }) => {
    const nextUser = {
      ...mockUser,
      email: email || mockUser.email,
      role: role || mockUser.role,
    };
    setUser(nextUser);
    localStorage.setItem("token", "mock-token");
    return nextUser;
  };

  const register = async ({ name, email }) => {
    const nextUser = {
      ...mockUser,
      name: name || mockUser.name,
      email: email || mockUser.email,
      streak: 0,
    };
    setUser(nextUser);
    localStorage.setItem("token", "mock-token");
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
