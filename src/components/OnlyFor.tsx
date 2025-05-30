import { mockUser } from "@/lib/user";

export default function OnlyFor({
  roleAllowed,
  children,
}: {
  roleAllowed: string[];
  children: React.ReactNode;
}) {
  const { role } = mockUser;
  return roleAllowed.includes(role) ? <>{children}</> : <p>Acesso negado.</p>;
}