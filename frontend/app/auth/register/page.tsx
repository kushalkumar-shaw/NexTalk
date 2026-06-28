import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
      <div className="mt-6 text-center text-sm">
        <span className="text-sidebar-muted">Already have an account? </span>
        <Link href="/auth/login" className="font-semibold text-brand hover:underline">
          Log in
        </Link>
      </div>
    </>
  );
}
