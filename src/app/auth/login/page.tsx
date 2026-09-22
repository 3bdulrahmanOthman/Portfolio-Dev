import { Suspense } from "react";
import LoginForm from "@/components/forms/login-form";

export const metadata = {
  title: "Login",
};

export default async function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* useSearchParams() inside the form requires a Suspense boundary
            for static prerendering. */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
