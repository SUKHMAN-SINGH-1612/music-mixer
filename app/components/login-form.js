"use client";

import { signIn } from "next-auth/react";

export default function LoginForm() {
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.15 0 5.74 1.08 7.88 2.86l5.88-5.88C33.92 3.68 29.34 2 24 2 14.64 2 6.66 7.8 3.34 15.5l7.16 5.56C12.12 14.7 17.58 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.14 24.5c0-1.4-.12-2.8-.34-4.15H24v8.2h12.65c-.58 3-2.2 5.5-4.65 7.2l7.2 5.58c4.2-3.88 6.94-9.58 6.94-16.83z"
          />
          <path
            fill="#4A90E2"
            d="M11.5 28.86c-1.5-2.68-2.34-5.78-2.34-9.12s.84-6.44 2.34-9.12l-7.16-5.56C1.96 10.16 0 16.74 0 24s1.96 13.84 5.34 18.94l7.16-5.56z"
          />
          <path
            fill="#FBBC05"
            d="M24 48c6.46 0 11.92-2.16 15.92-5.86l-7.2-5.58c-2.14 1.46-4.84 2.36-8.08 2.36-6.42 0-11.88-5.2-13.5-12.06l-7.16 5.56C6.66 40.2 14.64 46 24 46z"
          />
        </svg>
        Sign in with Google
      </button>
    </div>
  );
}
