import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useSignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, User2 } from "lucide-react";
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

function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!isLoaded) return;

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Password and confirm password must match.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await signUp.create({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        emailAddress: form.email.trim(),
        password: form.password
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      });

      setPendingVerification(true);
    } catch (error) {
      setErrorMessage(
        getClerkErrorMessage(
          error,
          "Email/password sign-up is not available yet. Enable Password in Clerk and try again."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerification = async (event) => {
    event.preventDefault();

    if (!isLoaded) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim()
      });

      if (result.status !== "complete") {
        setErrorMessage("Verification is still pending. Please check the email code and try again.");
        return;
      }

      await setActive({ session: result.createdSessionId });
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(getClerkErrorMessage(error, "Email verification failed."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!isLoaded) return;

    setGoogleLoading(true);
    setErrorMessage("");

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
    } catch (error) {
      setGoogleLoading(false);
      setErrorMessage(getClerkErrorMessage(error, "Google sign-up could not be started."));
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
                Create account
              </h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400">
                Start with email and password, then verify your inbox once.
              </p>
            </div>

            <div className="mt-8 rounded-[24px] bg-white/60 p-5 shadow-soft dark:bg-white/[0.03]">
              {!pendingVerification ? (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
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

                  <form className="space-y-5" onSubmit={handleSignup}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <User2 size={15} className="text-slate-400" />
                          First name
                        </span>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          autoComplete="given-name"
                          required
                          className="field-input"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <User2 size={15} className="text-slate-400" />
                          Last name
                        </span>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          autoComplete="family-name"
                          required
                          className="field-input"
                        />
                      </label>
                    </div>

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

                    <div className="grid gap-5 sm:grid-cols-2">
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
                          autoComplete="new-password"
                          required
                          className="field-input"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <ShieldCheck size={15} className="text-slate-400" />
                          Confirm password
                        </span>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          autoComplete="new-password"
                          required
                          className="field-input"
                        />
                      </label>
                    </div>

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
                      <span>{submitting ? "Creating account..." : "Create account"}</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <form className="space-y-5" onSubmit={handleVerification}>
                  <div className="rounded-2xl border border-brand-200 bg-brand-50/70 px-4 py-3 text-sm text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
                    We sent a verification code to {form.email}. Enter it below to finish creating your account.
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Email verification code
                    </span>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(event) => setVerificationCode(event.target.value)}
                      inputMode="numeric"
                      autoComplete="one-time-code"
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
                    disabled={!isLoaded || submitting}
                    className="primary-button w-full justify-between bg-gradient-to-r from-slate-950 to-slate-800 dark:from-white dark:to-slate-200"
                  >
                    <span>{submitting ? "Verifying..." : "Verify email"}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link className="font-medium text-brand-500 hover:text-brand-600" to="/login">
                  Sign in here
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

export default Signup;
