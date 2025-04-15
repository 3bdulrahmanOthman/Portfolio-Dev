import FallbackPage from "@/components/fallback-page"

export const metadata = {
  title: "404",
};

export default function NotFound() {
  return (
    <FallbackPage
      title="404"
      description="Oops, the page you&apos;re looking for doesn&apos;t exist."
      backButtonHref="/"
      backButtonLabel="Return to Home"
    />
  )
}