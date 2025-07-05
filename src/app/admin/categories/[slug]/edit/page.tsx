import { getCategoryBySlug } from "@/actions/categories";
import CategoryForm from "@/components/forms/category-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Category",
  description: "Edit portfolio category",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const category = await getCategoryBySlug((await params).slug);

  if (!category) {
    notFound();
  }

  return <CategoryForm initialData={category} />;
}
