import { useEffect, useState } from "react";
export function useAuth() {
  const [user, setUser] = useState<{ role: "gerente" | "supervisor" | "funcionario" } | null>(null);

  useEffect(() => {
    setUser({ role: "gerente" }); 
  }, []);

  return { user };
}
