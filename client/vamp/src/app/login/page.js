"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { BackgroundBeams } from "../components/ui/background-beams"; // Adjust the import path accordingly

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

const GlowingDivider = () => {
  return (
    <div className="relative my-6">
      <div className="flex items-center justify-center">
        <div className="relative w-full border-t-2 border-gray-400"></div>
      </div>
    </div>
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await axios.post(
  //       `${baseUrl}/backend/authentication/login`,
  //       {
  //         email,
  //         password,
  //       },
  //     );
  //     if (response.status === 200) {
  //       const token = response.data.token;
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("refreshToken", response.data.refresh_token);
  //       router.push("/");
  //     } else {
  //       alert(response.data.error);
  //     }
  //   } catch (error) {
  //     toast.error((error as any).response.data.message);
  //     console.error("Login error:", (error as any).response);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async (e) => {};

  return (
    <div className="relative flex h-screen w-full flex-col bg-neutral-950 text-black dark:bg-gray-900">
      {/* Background Beams */}

      {/* Login Card */}
      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center">
        <div className="relative mx-auto w-full max-w-md border border-neutral-700 bg-neutral-900 p-8 shadow-input md:rounded-xl">
          <BottomGradient />
          <h3 className="relative z-10 bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text text-center font-sans text-lg  font-bold text-transparent md:text-3xl">
            Welcome Back
          </h3>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-300">
            Please login to continue.
          </p>

          <form className="my-8" onSubmit={handleLogin}>
            <LabelInputContainer className="my-4 ">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="relative my-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg width="24" height="24" fill="currentColor">
                    <path d="M0 12C0 9.54 0.64 8.71 1.91 7.06 4.46 3.75 8.73 0 15 0s10.54 3.75 13.09 7.06C29.36 8.71 30 9.54 30 12s-.64 3.29-1.91 4.94C25.54 20.25 21.27 24 15 24S4.46 20.25 1.91 16.94C0.64 15.29 0 14.46 0 12Zm15-5.625c-3.11 0-5.625 2.51-5.625 5.625 0 3.11 2.51 5.625 5.625 5.625 3.11 0 5.625-2.51 5.625-5.625 0-3.11-2.51-5.625-5.625-5.625Z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="currentColor">
                    <path d="M12 6c-3.18 0-5.76 2.52-5.76 5.63 0 3.11 2.58 5.63 5.76 5.63 3.18 0 5.76-2.52 5.76-5.63C17.76 8.52 15.18 6 12 6Z" />
                    <path d="M21.77 2.23c.3-.3.79-.3 1.08 0s.3.79 0 1.08L2.23 21.77c-.3.3-.79.3-1.08 0-.3-.3-.3-.79 0-1.08L21.77 2.23Z" />
                  </svg>
                )}
              </div>
            </LabelInputContainer>

            <button
              type="submit"
              disabled={loading}
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            >
              {loading ? "Logging in..." : "Login"}
              <BottomGradient />
            </button>

           
          </form>

          <GlowingDivider />

          <div className="flex items-center justify-center">
            <span className="text-neutral-400">Don't have an account?</span>
            <Link href="/register" className="ml-2 text-[#F1670B]">
              Create Account
            </Link>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default Login;
