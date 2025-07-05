import type { Metadata } from "next";
import CategoryForm from "@/components/forms/category-form";

export const metadata: Metadata = {
  title: "Create Category",
  description: "Create a new portfolio category",
};

export default async function NewCategoryPage() {
  return <CategoryForm />;
}
  