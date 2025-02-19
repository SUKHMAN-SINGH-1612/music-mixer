"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Music } from "lucide-react";
import LoginForm from "./components/login-form";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect to dashboard if user is already logged in
  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side - Branding */}
        <div className="bg-indigo-600 text-white p-8 md:w-1/2 flex flex-col justify-center items-center">
          <Music className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Music Mixer</h1>
          <p className="text-indigo-200 text-center">
            Join the community and create amazing playlists together!
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Welcome Back!</h2>
          <LoginForm />

          {/* Sign-Up Link */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <button
              onClick={() => signIn("google")}
              className="text-indigo-600 hover:underline"
            >
              Sign up with Google
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
