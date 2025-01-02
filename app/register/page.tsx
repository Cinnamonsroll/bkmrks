"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { generateGradient } from "@/app/utils/lib";
import { useSearchParams } from "next/navigation";
import { register } from "./action";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading] = useState(false);
  const [error] = useState(searchParams.get("error") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInputEnabled(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const gradientStyle = username
    ? { background: generateGradient(username) }
    : {};

  return (
    <div className="w-full h-screen bg-woodsmoke-900 flex items-center justify-center">
      <main className="flex justify-center items-center py-20 w-full">
        <div className="flex flex-col gap-2 max-w-xs w-full">
          <h1 className="text-woodsmoke-100 font-medium text-xl">Register</h1>
          <p className="text-woodsmoke-100 font-normal text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline text-woodsmoke-100 hover:text-woodsmoke-200 pointer-events-auto"
            >
              Login.
            </Link>{" "}
          </p>
          <hr className="w-full mt-2 h-px bg-woodsmoke-400 border-none" />
          <form className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <label className="inline-block">
              <span className="text-woodsmoke-100 mb-2 block text-sm">
                Email
              </span>
              <div className="relative">
                <span className="absolute -translate-y-2/4 size-5 flex justify-center items-center pointer-events-none left-2 top-2/4 text-woodsmoke-100">
                  <svg
                    width="24px"
                    height="24px"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="currentColor"
                  >
                    <path
                      d="M7 9l5 3.5L17 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M2 17V7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                </span>
                <input
                  placeholder="john@doe.com"
                  name="email"
                  type="email"
                  className="h-10 text-sm rounded-md pl-9 w-full bg-woodsmoke-900 transition-all block border border-woodsmoke-400 text-white placeholder:text-woodsmoke-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] focus:shadow-[0_0_0_2px_#707070,0_0_0_4px_#505050] disabled:cursor-not-allowed"
                  style={{
                    outline: 0,
                  }}
                  required
                  disabled={!isInputEnabled || loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>
            <label className="inline-block">
              <span className="text-woodsmoke-100 mb-2 block text-sm">
                Username
              </span>
              <div className="relative">
                <span
                  className="absolute -translate-y-2/4 size-5 flex justify-center items-center pointer-events-none left-2 top-2/4 rounded-full w-5 h-5 text-woodsmoke-100"
                  style={username ? gradientStyle : undefined}
                >
                  {!username && (
                    <svg
                      width="24px"
                      height="24px"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      color="currentColor"
                    >
                      <path
                        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 100-6 3 3 0 000 6z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  )}
                </span>
                <input
                  placeholder="John"
                  name="username"
                  type="text"
                  className="h-10 text-sm rounded-md pl-9 w-full bg-woodsmoke-900 transition-all block border border-woodsmoke-400 text-white placeholder:text-woodsmoke-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] focus:shadow-[0_0_0_2px_#707070,0_0_0_4px_#505050] disabled:cursor-not-allowed"
                  style={{
                    outline: 0,
                  }}
                  required
                  disabled={!isInputEnabled}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </label>
            <label className="inline-block">
              <span className="text-woodsmoke-100 mb-2 block text-sm">
                Password
              </span>
              <div className="relative">
                <span className="absolute -translate-y-2/4 size-5 flex justify-center items-center pointer-events-none left-2 top-2/4 text-woodsmoke-100">
                  <svg
                    width="24px"
                    height="24px"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="currentColor"
                  >
                    <path
                      d="M16 12h1.4a.6.6 0 01.6.6v6.8a.6.6 0 01-.6.6H6.6a.6.6 0 01-.6-.6v-6.8a.6.6 0 01.6-.6H8m8 0V8c0-1.333-.8-4-4-4S8 6.667 8 8v4m8 0H8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
                <input
                  placeholder="••••••••"
                  name="password"
                  type="password"
                  className="h-10 text-sm rounded-md pl-9 w-full bg-woodsmoke-900 transition-all block border border-woodsmoke-400 text-white placeholder:text-woodsmoke-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] focus:shadow-[0_0_0_2px_#707070,0_0_0_4px_#505050] disabled:cursor-not-allowed"
                  style={{
                    outline: 0,
                  }}
                  required
                  disabled={!isInputEnabled || loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </label>
            <button
              type="submit"
              className="rounded-md bg-woodsmoke-700 w-full h-10 text-white hover:bg-opacity-60 transition-all font-semibold disabled:cursor-not-allowed"
              disabled={!isInputEnabled || loading}
              formAction={register}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <hr className="w-full mt-2 h-px bg-woodsmoke-400 border-none" />
        </div>
      </main>
    </div>
  );
}
