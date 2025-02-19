"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Prevent default redirection
    router.push("/"); // Redirect manually after sign out
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {session ? (
        <div>
          <p>Signed in as {session.user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  );
}
