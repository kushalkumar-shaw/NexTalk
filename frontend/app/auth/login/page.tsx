import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <div className="mt-6 text-center text-sm">
        <span className="text-sidebar-muted">Need an account? </span>
        <Link href="/auth/register" className="font-semibold text-brand hover:underline">
          Register
        </Link>
      </div>
    </>
  );
}
