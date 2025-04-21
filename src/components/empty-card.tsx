import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn, RenderIcon } from "@/lib/utils";
import { Icons } from "./icons";

interface EmptyCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: keyof typeof Icons;
}

export function EmptyCard({
  title,
  description,
  icon = "image",
  action,
  className,
  ...props
}: EmptyCardProps) {
  return (
    <Card
      className={cn(
        "relative flex select-none flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-16 outline-none transition-colors hover:bg-accent/30 focus-visible:border-ring/50 data-[disabled]:pointer-events-none",
        className
      )}
      {...props}
    >
      <div className="mr-4 shrink-0 rounded-full border border-dashed p-4">
        <RenderIcon icon={icon} />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </div>
      {action ? action : null}
    </Card>
  );
}
