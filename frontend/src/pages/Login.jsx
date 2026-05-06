import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useSignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowRight, Command, LockKeyhole, Mail } from "lucide-react";
import BrandMark from "../components/BrandMark";
import { useAuth } from "../hooks/useAuth";

function getClerkErrorMessage(error, fallback) {
  const message =
    error?.errors?.[0]?.longMessage ||
    error?.errors?.[0]?.message ||
    error?.message ||
    fallback;

  return message;
}

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoaded) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const result = await signIn.create({
        identifier: form.email.trim(),
        password: form.password
      });

      if (result.status !== "complete") {
        setErrorMessage("DailySync needs an additional sign-in step. Please try again.");
        return;
      }

      await setActive({ session: result.createdSessionId });
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(
        getClerkErrorMessage(
          error,
          "Email/password sign-in is not available yet. Enable Password in Clerk and try again."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    setGoogleLoading(true);
    setErrorMessage("");

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
    } catch (error) {
      setGoogleLoading(false);
      setErrorMessage(getClerkErrorMessage(error, "Google sign-in could not be started."));
    }
  };

  return (
    <>
      <SignedOut>
        <div className="auth-shell flex min-h-screen items-center justify-center px-4 py-10 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="auth-panel w-full max-w-xl p-6 md:p-8"
          >
            <BrandMark />

            <div className="mt-7">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Sign in
              </h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400">
                Use your email and password, or continue with Google.
              </p>
            </div>

            <div className="mt-8 rounded-[24px] bg-white/60 p-5 shadow-soft dark:bg-white/[0.03]">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!isLoaded || googleLoading || submitting}
                className="secondary-button w-full gap-3"
              >
                <span className="text-lg font-semibold">G</span>
                {googleLoading ? "Redirecting to Google..." : "Continue with Google"}
              </button>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                <span className="text-sm text-slate-500 dark:text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <Mail size={15} className="text-slate-400" />
                    Email address
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    className="field-input"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <LockKeyhole size={15} className="text-slate-400" />
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="field-input"
                  />
                </label>

                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                    {errorMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={!isLoaded || submitting || googleLoading}
                  className="primary-button w-full justify-between bg-gradient-to-r from-slate-950 to-slate-800 dark:from-white dark:to-slate-200"
                >
                  <span>{submitting ? "Signing in..." : "Sign in"}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between gap-3 rounded-[18px] bg-white/55 px-4 py-3 text-sm text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
                <span>Secure session protection via Clerk</span>
                <span className="inline-flex items-center gap-1 rounded-[10px] bg-white/65 px-2 py-1 text-[11px] dark:bg-white/[0.04]">
                  <Command size={12} />
                  Trusted
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link className="font-medium text-brand-500 hover:text-brand-600" to="/signup">
                  Create one here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </SignedOut>
      <SignedIn>{isAuthenticated ? <Navigate to="/" replace /> : null}</SignedIn>
    </>
  );
}

export default Login;
