import { LoginForm } from "@/components/freeinUse/login-form";



export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-1 md:p-4">
      <div className="w-full lg:max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
