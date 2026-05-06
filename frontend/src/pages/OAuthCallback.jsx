import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import BrandMark from "../components/BrandMark";

function OAuthCallback() {
  return (
    <div className="auth-shell flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="auth-panel w-full max-w-md p-8 text-center"
      >
        <div className="flex justify-center">
          <BrandMark compact />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900 dark:text-white">
          Finishing sign-in
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Please wait while we complete your Google authentication.
        </p>
        <div className="mt-8 text-sm text-slate-400 dark:text-slate-500">Redirecting...</div>
      </motion.div>
      <AuthenticateWithRedirectCallback signInForceRedirectUrl="/" signUpForceRedirectUrl="/" />
    </div>
  );
}

export default OAuthCallback;
