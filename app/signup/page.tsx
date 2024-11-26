"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { signUp } from "./actions";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    setLoading(true);
    try {
      const result = await signUp(formData);
      setLoading(false);

      if (result?.error) {
        setMessage(result.error);
        return;
      }

      // Redirect to homepage after successful signup
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      setMessage(error.message || "Signup failed.");
    }
  };

  return (
    <div className="auth-container w-full h-full px-5">
      {/* Logo */}
      <div className="w-[150px] pt-10 h-auto">
        <Image src="/diatect.png" height={500} width={500} alt="Logo" />
      </div>

      {/* Header */}
      <div className="text-center mt-24">
        <h1 className="font-bold text-[24px]">Buat Akun</h1>
        <p className="text-[14px]">Isi form untuk membuat akun baru</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp}>
        <div className="flex-col space-y-4 mt-10">
          {/* Username */}
          <div className="space-y-2">
            <p className="text-start">
              <strong>Username</strong>
              <strong className="text-alt_red">*</strong>
            </p>
            <div className="border-[1px] border-light_grey p-2 rounded-lg">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                required
                className="font-semibold w-full"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <p className="text-start">
              <strong>Email</strong>
              <strong className="text-alt_red">*</strong>
            </p>
            <div className="border-[1px] border-light_grey p-2 rounded-lg">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
                className="font-semibold w-full"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <p className="text-start">
              <strong>Password</strong>
              <strong className="text-alt_red">*</strong>
            </p>
            <div className="border-[1px] border-light_grey p-2 rounded-lg">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                required
                className="font-semibold w-full"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <p className="text-start">
              <strong>Confirm Password</strong>
              <strong className="text-alt_red">*</strong>
            </p>
            <div className="border-[1px] border-light_grey p-2 rounded-lg">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.trim())}
                required
                className="font-semibold w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-main_blue text-center p-4 rounded-lg text-white font-semibold mt-10">
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {message && <p className="text-red-500 text-center mt-4">{message}</p>}

      {/* Footer */}
      <p className="text-[14px] flex space-x-1 justify-center mt-8">
        <span>Sudah punya akun?</span>
        <a href="/login" className="text-main_blue">
          Masuk sekarang
        </a>
      </p>
    </div>
  );
}
