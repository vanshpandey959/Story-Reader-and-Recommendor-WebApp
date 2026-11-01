import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Lock, Mail, User } from "lucide-react";
import AuthField from "./AuthField";
import { signup } from "../../store/slices/authSlice";

export default function SignupForm() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const loading = status === "loading";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(form));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-bold text-zinc-900">Create account</h1>
        <p className="mt-1 text-sm text-zinc-500">Start your own shelf in a minute.</p>
      </div>

      <AuthField label="Name" icon={User} name="name" value={form.name} onChange={onChange} autoComplete="name" />
      <AuthField label="Email" icon={Mail} type="email" name="email" value={form.email} onChange={onChange} autoComplete="email" />
      <AuthField label="Password" icon={Lock} type="password" name="password" minLength={6} value={form.password} onChange={onChange} autoComplete="new-password" />

      {error && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-900 py-2.5 text-sm font-medium text-white shadow transition hover:bg-green-200 hover:text-green-900 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign up
      </button>
    </form>
  );
}
