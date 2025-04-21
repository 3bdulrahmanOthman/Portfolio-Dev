import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const embedSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
  altText: z.string().optional(),
});


const EmbedImageForm = ({ onSubmitImage }: { onSubmitImage: (url: string, altText?: string) => void }) => {
  const form = useForm<z.infer<typeof embedSchema>>({
    resolver: zodResolver(embedSchema),
    defaultValues: {
      url: "",
      altText: "",
    },
  });

  const onSubmit = (values: z.infer<typeof embedSchema>) => {
    onSubmitImage(values.url, values.altText);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter image URL..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="altText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alt Text</FormLabel>
              <FormControl>
                <Input placeholder="Alt text (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={!form.formState.isDirty}>
          Add Image
        </Button>
      </form>
    </Form>
  );
};

export default EmbedImageForm;