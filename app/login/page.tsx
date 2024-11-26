"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions"
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await login({ email, password }); // Use the `login` action
      setLoading(false);

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      router.push("/");
    } catch (error) {
      setLoading(false);
      setMessage("Something went wrong. Please try again.");
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="auth-container w-full h-full px-5">
      {/* Logo */}
      <div className="w-[150px] pt-10 h-auto">
        <Image src="/Diatect.png" height={500} width={500} alt="Logo" />
      </div>

      {/* Header */}
      <div className="text-center mt-24">
        <h1 className="font-bold text-[24px]">Masuk Akun</h1>
        <p className="text-[14px]">Mohon diisi berdasarkan data yang sesuai</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignIn}>
        <div className="flex-col space-y-4 mt-10">
          <div className="space-y-2">
            <p className="text-start">
              <strong>Email</strong>
              <strong className="text-red-500">*</strong>
            </p>
            <div className="border-[1px] border-gray-300 p-2 rounded-[5px]">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-semibold w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-2 text-start">
            <p>
              <strong>Password</strong>
              <strong className="text-red-500">*</strong>
            </p>
            <div className="border-[1px] border-gray-300 p-2 rounded-[5px]">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-semibold w-full focus:outline-none rounded-md"
              />
            </div>
            <div className="text-right pt-2 text-[14px] text-blue-500">
              <Link href="/reset-password">Lupa Password</Link>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 w-full text-center p-4 rounded-xl text-white font-semibold"
          >
            {loading ? "Loading..." : "Masuk"}
          </button>
        </div>
      </form>

      {message && <p className="text-red-500 text-center mt-4">{message}</p>}

      <p className="text-[14px] flex space-x-1 justify-center mt-8">
        <span>Belum pernah terdaftar?</span>
        <Link href="/signup" className="text-blue-500">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
