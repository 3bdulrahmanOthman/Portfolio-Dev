"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeftIcon, ArrowRightIcon, X, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { type SearchAndReplaceStorage } from "../extensions/search-and-replace";
import { Badge } from "@/components/ui/badge";
import { PopoverClose } from "@radix-ui/react-popover";
import { ToolbarButton } from "../_components/toolbar-button";
import { Editor } from "@tiptap/react";

interface SearchAndReplaceToolbarProps {
  editor: Editor | null;
}

export function SearchAndReplaceToolbar({ editor }: SearchAndReplaceToolbarProps) {
  const [open, setOpen] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

  const results = editor?.storage?.searchAndReplace
    .results as SearchAndReplaceStorage["results"];
  const selectedResult = editor?.storage?.searchAndReplace
    .selectedResult as SearchAndReplaceStorage["selectedResult"];

  const replace = useCallback(() => editor?.chain().replace().run(), [editor]);
  const replaceAll = useCallback(
    () => editor?.chain().replaceAll().run(),
    [editor]
  );
  const selectNext = useCallback(
    () => editor?.chain().selectNextResult().run(),
    [editor]
  );
  const selectPrevious = useCallback(
    () => editor?.chain().selectPreviousResult().run(),
    [editor]
  );

  useEffect(() => {
    editor?.chain().setSearchTerm(searchText).run();
  }, [searchText, editor]);

  useEffect(() => {
    editor?.chain().setReplaceTerm(replaceText).run();
  }, [replaceText, editor]);

  useEffect(() => {
    editor?.chain().setCaseSensitive(isCaseSensitive).run();
  }, [isCaseSensitive, editor]);

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);

      if (!isOpen) {
        setSearchText("");
        setReplaceText("");
        setIsReplacing(false);
      }
    },
    [setSearchText, setReplaceText, setIsReplacing]
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger disabled={!editor} asChild>
        <ToolbarButton
          Icon={Repeat}
          tooltip="Search & Replace"
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="relative flex w-[400px] px-3 py-2.5"
      >
        {!isReplacing ? (
          <SearchToolbarView
            searchText={searchText}
            setSearchText={setSearchText}
            resultsCount={results?.length}
            selectedResult={selectedResult}
            onNext={selectNext}
            onPrev={selectPrevious}
            onSwitchToReplace={() => setIsReplacing(true)}
          />
        ) : (
          <ReplaceToolbarView
            searchText={searchText}
            setSearchText={setSearchText}
            replaceText={replaceText}
            setReplaceText={setReplaceText}
            resultsCount={results?.length}
            selectedResult={selectedResult}
            isCaseSensitive={isCaseSensitive}
            setIsCaseSensitive={setIsCaseSensitive}
            onBack={() => setIsReplacing(false)}
            onReplace={replace}
            onReplaceAll={replaceAll}
            onNext={selectNext}
            onPrev={selectPrevious}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

type ToolbarViewProps = {
  searchText: string;
  setSearchText: (val: string) => void;
  selectedResult: number;
  resultsCount: number;
};

function SearchToolbarView({
  searchText,
  setSearchText,
  selectedResult,
  resultsCount,
  onNext,
  onPrev,
  onSwitchToReplace,
}: ToolbarViewProps & {
  onNext: () => void;
  onPrev: () => void;
  onSwitchToReplace: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Input
        value={searchText}
        className="h-7 w-48"
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search..."
      />
      <Badge variant="outline">
        {resultsCount > 0 ? `${selectedResult + 1}/${resultsCount}` : "0/0"}
      </Badge>
      <Button onClick={onPrev} size="icon" variant="ghost" className="size-7">
        <ArrowLeftIcon className="size-4" />
      </Button>
      <Button onClick={onNext} size="icon" variant="ghost" className="size-7">
        <ArrowRightIcon className="size-4" />
      </Button>
      <Separator orientation="vertical" className="h-7 mx-0.5" />
      <Button
        onClick={onSwitchToReplace}
        size="icon"
        variant="ghost"
        className="size-7"
      >
        <Repeat className="size-4" />
      </Button>
      <PopoverClose className="cursor-pointer" asChild>
        <Button variant={"ghost"} size={"icon"} className="size-7">
          <X />
        </Button>
      </PopoverClose>
    </div>
  );
}

function ReplaceToolbarView({
  searchText,
  setSearchText,
  replaceText,
  setReplaceText,
  selectedResult,
  resultsCount,
  isCaseSensitive,
  setIsCaseSensitive,
  onBack,
  onReplace,
  onReplaceAll,
  onNext,
  onPrev,
}: ToolbarViewProps & {
  replaceText: string;
  setReplaceText: (val: string) => void;
  isCaseSensitive: boolean;
  setIsCaseSensitive: (val: boolean) => void;
  onBack: () => void;
  onReplace: () => void;
  onReplaceAll: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="relative w-full">
      <PopoverClose className="absolute right-0 top-0 cursor-pointer" asChild>
        <Button variant={"ghost"} size={"icon"} className="size-7">
          <X />
        </Button>
      </PopoverClose>
      <div className="flex items-center gap-3">
        <Button
          onClick={onBack}
          size="icon"
          className="size-7 rounded-full"
          variant="ghost"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <h2 className="text-sm font-medium">Search and replace</h2>
      </div>

      <div className="my-2 space-y-3">
        <div>
          <Label className="mb-1 text-xs text-gray-11">Search</Label>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
          />
          <Badge variant={"outline"} className="mt-1.5">
            {resultsCount > 0 ? `${selectedResult + 1}/${resultsCount}` : "0/0"}
          </Badge>
        </div>

        <div>
          <Label className="mb-1 text-xs text-gray-11">Replace with</Label>
          <Input
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isCaseSensitive}
            onCheckedChange={(checked: boolean) => setIsCaseSensitive(checked)}
            id="match_case"
          />
          <Label htmlFor="match_case" className="text-sm font-medium">
            Match case
          </Label>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div className="flex gap-2">
          <Button
            onClick={onPrev}
            size="icon"
            className="h-7 w-7"
            variant="secondary"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <Button
            onClick={onNext}
            size="icon"
            className="h-7 w-7"
            variant="secondary"
          >
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onReplaceAll}
            size="sm"
            className="h-7 px-3 text-xs"
            variant="secondary"
          >
            Replace All
          </Button>
          <Button onClick={onReplace} size="sm" className="h-7 px-3 text-xs">
            Replace
          </Button>
        </div>
      </div>
    </div>
  );
}
