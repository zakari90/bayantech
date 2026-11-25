// import { LoginForm } from "@/components/centermanagementcomponents/login-form";

import { AuthProvider } from "@/freelib/context/freeauthContext";

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-svh w-full items-center justify-center p-1 md:p-4">
        <div className="w-full lg:max-w-sm">
          <LoginForm/>
        </div>
      </div>
    </AuthProvider>
  );
}
