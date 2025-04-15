import FallbackPage from "@/components/fallback-page";

export const metadata = {
  title: "Unauthorized | Error",
};

export default function AuthError() {
  return (
    <FallbackPage
      title="Unauthorized"
      description="Oops! Something went wrong!, Authentication with your auth provider failed!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    />
  );
}
