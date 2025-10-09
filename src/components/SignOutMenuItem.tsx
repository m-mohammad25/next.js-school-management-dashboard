"use client";

import { useClerk } from "@clerk/nextjs";
import MenuItem from "./MenuItem";
import { useRouter } from "next/navigation";

export default function SignOutMenuItem({
  label,
  icon,
  path,
}: {
  label: string;
  icon: string;
  path?: string;
}) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(() => router.push(path || "/"));
  };

  return (
    <div onClick={handleSignOut}>
      <MenuItem label={label} icon={icon} path={path} />
    </div>
  );
}
