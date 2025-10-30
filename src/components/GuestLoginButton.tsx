"use client";

import { useSignIn } from "@clerk/nextjs";

export default function GuestLoginButton() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const handleGuestLogin = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: "guest",
        password: "guestP@ss12345",
      });
      console.log("HEY!");
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        console.log("Unexpected sign-in flow:", result);
      }
    } catch (err: any) {
      console.error("Guest login failed:", err.errors || err);
    }
  };

  return <button onClick={handleGuestLogin}>Continue as Guest</button>;
}
