
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(normalizedEmail, password);

      const destination = location.state?.from?.pathname || "/";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#F7F5F1]">
      {/* Left branding section */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#29251F] p-12 text-white lg:flex">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#A66A43]/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A66A43] text-lg font-semibold">
              C
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-wide">
                Copper OS
              </h1>
              <p className="text-xs text-white/50">
                The Copper Studio
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#C58B64]">
            Business Operations Platform
          </p>

          <h2 className="text-5xl font-semibold leading-tight">
            Everything connected.
            <span className="mt-2 block text-[#C58B64]">
              Every detail in control.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-base leading-7 text-white/60">
            A unified workspace to manage leads, clients, projects
            and business operations at The Copper Studio.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} The Copper Studio. All rights reserved.
        </p>
      </section>

      {/* Login section */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A66A43] text-lg font-semibold text-white">
                C
              </div>

              <div>
                <h1 className="text-xl font-semibold text-[#29251F]">
                  Copper OS
                </h1>
                <p className="text-xs text-[#888078]">
                  The Copper Studio
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFE5DC] text-[#A66A43]">
              <ShieldCheck size={24} />
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-[#29251F]">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-[#827B73]">
              Sign in to access your Copper OS workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#49443E]"
              >
                Work email
              </label>

              <div className="flex items-center rounded-xl border border-[#E5E0D9] bg-white px-4 transition focus-within:border-[#A66A43] focus-within:ring-2 focus-within:ring-[#A66A43]/10">
                <Mail size={18} className="text-[#A49B91]" />

                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-[#29251F] outline-none placeholder:text-[#B2AAA1]"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#49443E]"
              >
                Password
              </label>

              <div className="flex items-center rounded-xl border border-[#E5E0D9] bg-white px-4 transition focus-within:border-[#A66A43] focus-within:ring-2 focus-within:ring-[#A66A43]/10">
                <LockKeyhole size={18} className="text-[#A49B91]" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-[#29251F] outline-none placeholder:text-[#B2AAA1]"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="text-[#91877D] transition hover:text-[#A66A43]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-[#A66A43] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8F5835] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to Copper OS"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-5 text-[#A0988F]">
            Protected workspace. Access is available to authorized
            Copper Studio team members only.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
