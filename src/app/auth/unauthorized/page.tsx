import FallbackPage from "@/components/fallback-page"

export const metadata = {
  title: "Unauthorized | Access Denied",
};

export default function Unauthorized() {
  return (
    <FallbackPage
      title="Unauthorized"
      description="You don't have permission to view this page."
      backButtonHref="/"
      backButtonLabel="Return to Home"
    />
  )
}
