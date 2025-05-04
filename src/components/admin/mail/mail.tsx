"use client";

import * as React from "react";
import { Search } from "lucide-react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailDisplay } from "./mail-display";
import { MailList } from "./mail-list";
import { type Mail } from "./data";
import { useMail } from "./use-mail";
import { Input } from "@/components/ui/input";
import AppContentLayout from "../content-layout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MailProps {
  mails: Mail[];
  defaultLayout: number[] | undefined;
}

export function Mail({ mails, defaultLayout = [32, 48] }: MailProps) {
  const [mail] = useMail();

  return (
    <TooltipProvider delayDuration={0}>
      <Tabs defaultValue="all">
        <AppContentLayout
          header={
            <React.Fragment>
              <SidebarTrigger className="mr-4" />
              <h1 className="font-bold">Inbox</h1>

              <form className="ml-auto mr-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1.5 size-4 text-muted-foreground" />
                  <Input placeholder="Search" className="h-7 pl-8" />
                </div>
              </form>

              <Separator orientation="vertical" className="mr-4"/>

              <TabsList className="h-7 rounded-md">
                <TabsTrigger value="all">All mail</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>
            </React.Fragment>
          }
        >
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
              document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
                sizes
              )}`;
            }}
            className="h-full"
          >
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className="py-4">
              <TabsContent value="all" className="m-0">
                  <MailList items={mails} />
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <MailList items={mails.filter((item) => !item.read)} />
              </TabsContent>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
              <MailDisplay
                mail={mails.find((item) => item.id === mail.selected) || null}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </AppContentLayout>
      </Tabs>
    </TooltipProvider>
  );
}
