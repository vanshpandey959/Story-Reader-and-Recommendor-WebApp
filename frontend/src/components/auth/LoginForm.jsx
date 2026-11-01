import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Lock, Mail } from "lucide-react";
import AuthField from "./AuthField";
import { login } from "../../store/slices/authSlice";
import { DEMO_USER } from "../../api/authApi";
import { USE_MOCK } from "../../api/client";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const loading = status === "loading";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-bold text-zinc-900">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-500">Pick up the story where you left it.</p>
      </div>

      <AuthField label="Email" icon={Mail} type="email" name="email" value={form.email} onChange={onChange} autoComplete="email" />
      <AuthField label="Password" icon={Lock} type="password" name="password" value={form.password} onChange={onChange} autoComplete="current-password" />

      {error && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-900 py-2.5 text-sm font-medium text-white shadow transition hover:bg-green-200 hover:text-green-900 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Log in
      </button>

      {USE_MOCK && (
        <p className="text-center text-xs text-zinc-400">
          Demo: {DEMO_USER.email} / {DEMO_USER.password}
        </p>
      )}
    </form>
  );
}
