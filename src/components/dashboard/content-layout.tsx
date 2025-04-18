import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";
import { ScrollArea } from "../ui/scroll-area";

interface MainLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  headersNumber?: 1 | 2;
}

export default function AppContentLayout({
  children,
  header,
  headersNumber = 2,
}: MainLayoutProps) {
  const height = {
    1: "h-[calc(100svh-40px)] lg:h-[calc(100svh-56px)]",
    2: "h-[calc(100svh-80px)] lg:h-[calc(100svh-96px)]",
  };
  return (
    <div className="h-svh overflow-hidden lg:p-2 w-full">
      <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full">
        <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
          <SidebarTrigger />
          {header}
        </div>
        <ScrollArea
          className={cn(
            "w-full",
            height[headersNumber as keyof typeof height]
          )}
        >
          {children}
        </ScrollArea>
      </div>
    </div>
  );
}
