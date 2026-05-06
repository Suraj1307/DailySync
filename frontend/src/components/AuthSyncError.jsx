import { useAuth } from "../hooks/useAuth";

function AuthSyncError() {
  const { authError, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-soft dark:border-rose-900/50 dark:bg-slate-900">
        <p className="text-sm uppercase tracking-[0.35em] text-rose-500">Auth Error</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
          DailySync could not finish signing you in
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          {authError || "A backend authentication sync error occurred."}
        </p>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Most commonly this means `CLERK_SECRET_KEY` is missing or invalid on the backend.
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-6 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white dark:bg-white dark:text-slate-900"
        >
          Sign out and try again
        </button>
      </div>
    </div>
  );
}

export default AuthSyncError;

