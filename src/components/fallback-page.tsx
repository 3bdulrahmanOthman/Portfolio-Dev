"use client";

import Link from "next/link";
import { Button } from "./ui/button";

interface FallbackPageProps {
  title: string;
  description: string;
  backButtonHref: string;
  backButtonLabel: string;
}

const FallbackPage = ({
  title,
  description,
  backButtonHref,
  backButtonLabel,
}: FallbackPageProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-16 animate-bounce rounded-full bg-primary opacity-10" />
        <h1 className="relative z-10 text-7xl font-bold text-primary sm:text-8xl">
          {title}
        </h1>
      </div>
      <p className="mt-4 text-lg text-muted-foreground">
        {description}
      </p>
      <Button asChild className="w-full sm:w-auto mt-6">
        <Link href={backButtonHref}>{backButtonLabel}</Link>
      </Button>
    </div>
  );
};

export default FallbackPage;
