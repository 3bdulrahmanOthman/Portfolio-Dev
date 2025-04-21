"use client"

import type React from "react"

import { type Editor as CoreEditor, Extension, type Range } from "@tiptap/core"
import type { Node as PMNode } from "@tiptap/pm/model"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view"
import { useState, useCallback, useEffect } from "react"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Search, Replace, X } from "lucide-react"

//=============================================================================
// TYPE DECLARATIONS
//=============================================================================

/**
 * Type declarations for the Search and Replace extension commands
 */
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    search: {
      /**
       * Set search term in extension
       */
      setSearchTerm: (searchTerm: string) => ReturnType
      /**
       * Set replace term in extension
       */
      setReplaceTerm: (replaceTerm: string) => ReturnType
      /**
       * Replace first instance of search result with given replace term
       */
      replace: () => ReturnType
      /**
       * Replace all instances of search result with given replace term
       */
      replaceAll: () => ReturnType
      /**
       * Select the next search result
       */
      selectNextResult: () => ReturnType
      /**
       * Select the previous search result
       */
      selectPreviousResult: () => ReturnType
      /**
       * Set case sensitivity in extension
       */
      setCaseSensitive: (caseSensitive: boolean) => ReturnType
      /**
       * Toggle regex mode
       */
      setRegexMode: (disableRegex: boolean) => ReturnType
    }
  }
}

/**
 * Interface for text nodes with position information
 */
interface TextNodeWithPosition {
  text: string
  pos: number
}

/**
 * Interface for processed search results
 */
interface ProcessedSearches {
  decorations: DecorationSet
  results: Range[]
}

/**
 * Options for the Search and Replace extension
 */
export interface SearchAndReplaceOptions {
  /** CSS class for search results */
  searchResultClass: string
  /** CSS class for the selected search result */
  selectedResultClass: string
  /** Whether to disable regex in search */
  disableRegex: boolean
  /** Smooth scrolling behavior */
  smoothScrolling: boolean
}

/**
 * Storage for the Search and Replace extension
 */
export interface SearchAndReplaceStorage {
  /** Current search term */
  searchTerm: string
  /** Current replace term */
  replaceTerm: string
  /** Array of search result ranges */
  results: Range[]
  /** Last search term (for optimization) */
  lastSearchTerm: string
  /** Index of the selected result */
  selectedResult: number
  /** Last selected result index (for optimization) */
  lastSelectedResult: number
  /** Whether search is case sensitive */
  caseSensitive: boolean
  /** Last case sensitive state (for optimization) */
  lastCaseSensitiveState: boolean
  /** Whether regex is disabled */
  disableRegex: boolean
  /** Last regex disabled state (for optimization) */
  lastDisableRegexState: boolean
}

/**
 * Props for the SearchReplaceDialog component
 */
interface SearchReplaceDialogProps {
  editor: Editor
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Props for the SearchReplaceToolbar component
 */
interface SearchReplaceToolbarProps {
  editor: Editor
  className?: string
}

/**
 * Options for the useSearchReplace hook
 */
interface UseSearchReplaceOptions {
  initialSearchTerm?: string
  initialReplaceTerm?: string
  initialCaseSensitive?: boolean
  initialRegexMode?: boolean
}

/**
 * Return type for the useSearchReplace hook
 */
interface UseSearchReplaceReturn {
  searchTerm: string
  setSearchTerm: (term: string) => void
  replaceTerm: string
  setReplaceTerm: (term: string) => void
  caseSensitive: boolean
  setCaseSensitive: (value: boolean) => void
  regexMode: boolean
  setRegexMode: (value: boolean) => void
  resultCount: number
  currentResult: number
  goToNextResult: () => void
  goToPreviousResult: () => void
  replaceCurrentResult: () => void
  replaceAllResults: () => void
  clearSearch: () => void
}

//=============================================================================
// UTILITY FUNCTIONS
//=============================================================================

/**
 * Create a regex from a search string with appropriate flags
 */
const createSearchRegex = (searchString: string, disableRegex: boolean, caseSensitive: boolean): RegExp | null => {
  if (!searchString.trim()) return null

  try {
    const escapedString = disableRegex ? searchString.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") : searchString

    return new RegExp(escapedString, caseSensitive ? "gu" : "gui")
  } catch (error) {
    console.error("Invalid regex pattern:", error)
    // Return a safe fallback that matches the literal string
    return new RegExp(searchString.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), caseSensitive ? "gu" : "gui")
  }
}

/**
 * Process search results and create decorations
 */
function processSearchResults(
  doc: PMNode,
  searchTerm: RegExp | null,
  selectedResultIndex: number,
  searchResultClass: string,
  selectedResultClass: string,
): ProcessedSearches {
  const decorations: Decoration[] = []
  const results: Range[] = []

  if (!searchTerm) {
    return { decorations: DecorationSet.empty, results: [] }
  }

  // Collect all text nodes with their positions
  const textNodesWithPosition: TextNodeWithPosition[] = []
  doc.descendants((node, pos) => {
    if (node.isText) {
      textNodesWithPosition.push({ text: node.text || "", pos })
    }
  })

  // Find all matches in text nodes
  for (const { text, pos } of textNodesWithPosition) {
    try {
      const matches = Array.from(text.matchAll(searchTerm)).filter(([matchText]) => matchText.trim())

      for (const match of matches) {
        if (match.index !== undefined) {
          results.push({
            from: pos + match.index,
            to: pos + match.index + match[0].length,
          })
        }
      }
    } catch (error) {
      console.error("Error processing search matches:", error)
    }
  }

  // Create decorations for each result
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (!result) continue

    const { from, to } = result
    decorations.push(
      Decoration.inline(from, to, {
        class: selectedResultIndex === i ? selectedResultClass : searchResultClass,
      }),
    )
  }

  return {
    decorations: DecorationSet.create(doc, decorations),
    results,
  }
}

/**
 * Replace a single search result
 */
const replaceSingleResult = (
  replaceTerm: string,
  results: Range[],
  resultIndex: number,
  {
    state,
    dispatch,
  }: {
    state: import("@tiptap/pm/state").EditorState
    dispatch: ((tr: import("@tiptap/pm/state").Transaction) => void) | undefined
  },
): boolean => {
  const result = results[resultIndex]

  if (!result) {
    return false
  }

  const { from, to } = result

  if (dispatch) {
    dispatch(state.tr.insertText(replaceTerm, from, to))
    return true
  }

  return false
}

/**
 * Calculate the offset for the next result after a replacement
 */
const calculateNextResultOffset = (
  replaceTerm: string,
  index: number,
  lastOffset: number,
  results: Range[],
): [number, Range[]] | null => {
  const nextIndex = index + 1

  if (!results[nextIndex]) {
    return null
  }

  const currentResult = results[index]
  if (!currentResult) {
    return null
  }

  const { from: currentFrom, to: currentTo } = currentResult
  const offset = currentTo - currentFrom - replaceTerm.length + lastOffset

  const { from, to } = results[nextIndex]

  results[nextIndex] = {
    to: to - offset,
    from: from - offset,
  }

  return [offset, results]
}

/**
 * Replace all search results
 */
const replaceAllResults = (
  replaceTerm: string,
  results: Range[],
  {
    tr,
    dispatch,
  }: {
    tr: import("@tiptap/pm/state").Transaction
    dispatch: ((tr: import("@tiptap/pm/state").Transaction) => void) | undefined
  },
): boolean => {
  if (!results.length) {
    return false
  }

  let offset = 0

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (!result) continue

    const { from, to } = result
    tr.insertText(replaceTerm, from, to)

    const rebaseResponse = calculateNextResultOffset(replaceTerm, i, offset, results)
    if (rebaseResponse) {
      offset = rebaseResponse[0]
    }
  }

  if (dispatch) {
    dispatch(tr)
  }
  return true
}

/**
 * Scroll to a specific position in the editor
 */
const scrollToPosition = (view: EditorView, position: number, smooth: boolean): void => {
  try {
    const domPos = view.domAtPos(position)
    if (domPos && domPos.node && domPos.node.nodeType === Node.ELEMENT_NODE) {
      // Cast to HTMLElement to access scrollIntoView
      ;(domPos.node as HTMLElement).scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "center",
      })
    }
  } catch (error) {
    console.error("Error scrolling to position:", error)
  }
}

/**
 * Select the next search result
 */
const selectNextSearchResult = (editor: CoreEditor, smoothScrolling: boolean): void => {
  const { results, selectedResult } = editor.storage.searchAndReplace as SearchAndReplaceStorage

  if (!results.length) {
    return
  }

  // Update the selected result index (wrap around if at the end)
  if (selectedResult >= results.length - 1) {
    editor.storage.searchAndReplace.selectedResult = 0
  } else {
    editor.storage.searchAndReplace.selectedResult += 1
  }

  const result = results[editor.storage.searchAndReplace.selectedResult]
  if (!result) return

  // Scroll to the selected result
  if (editor.view) {
    scrollToPosition(editor.view, result.from, smoothScrolling)
  }
}

/**
 * Select the previous search result
 */
const selectPreviousSearchResult = (editor: CoreEditor, smoothScrolling: boolean): void => {
  const { results, selectedResult } = editor.storage.searchAndReplace as SearchAndReplaceStorage

  if (!results.length) {
    return
  }

  // Update the selected result index (wrap around if at the beginning)
  if (selectedResult <= 0) {
    editor.storage.searchAndReplace.selectedResult = results.length - 1
  } else {
    editor.storage.searchAndReplace.selectedResult -= 1
  }

  const result = results[editor.storage.searchAndReplace.selectedResult]
  if (!result) return

  // Scroll to the selected result
  if (editor.view) {
    scrollToPosition(editor.view, result.from, smoothScrolling)
  }
}

//=============================================================================
// TIPTAP EXTENSION
//=============================================================================

// Plugin key for the Search and Replace plugin
export const searchAndReplacePluginKey = new PluginKey("searchAndReplacePlugin")

/**
 * Search and Replace extension for TipTap
 */
export const SearchAndReplace = Extension.create<SearchAndReplaceOptions, SearchAndReplaceStorage>({
  name: "searchAndReplace",

  addOptions() {
    return {
      searchResultClass: "bg-yellow-200",
      selectedResultClass: "bg-yellow-500",
      disableRegex: true,
      smoothScrolling: true,
    }
  },

  addStorage() {
    return {
      searchTerm: "",
      replaceTerm: "",
      results: [],
      lastSearchTerm: "",
      selectedResult: 0,
      lastSelectedResult: 0,
      caseSensitive: false,
      lastCaseSensitiveState: false,
      disableRegex: true,
      lastDisableRegexState: true,
    }
  },

  addCommands() {
    return {
      setSearchTerm:
        (searchTerm: string) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.searchTerm = searchTerm
          return true
        },

      setReplaceTerm:
        (replaceTerm: string) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.replaceTerm = replaceTerm
          return true
        },

      replace:
        () =>
        ({ editor, state, dispatch }) => {
          const { replaceTerm, results, selectedResult } = editor.storage.searchAndReplace
          return replaceSingleResult(replaceTerm, results, selectedResult, { state, dispatch })
        },

      replaceAll:
        () =>
        ({ editor, tr, dispatch }) => {
          const { replaceTerm, results } = editor.storage.searchAndReplace
          return replaceAllResults(replaceTerm, results, { tr, dispatch })
        },

      selectNextResult:
        () =>
        ({ editor }) => {
          selectNextSearchResult(editor, this.options.smoothScrolling)
          return true
        },

      selectPreviousResult:
        () =>
        ({ editor }) => {
          selectPreviousSearchResult(editor, this.options.smoothScrolling)
          return true
        },

      setCaseSensitive:
        (caseSensitive: boolean) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.caseSensitive = caseSensitive
          return true
        },

      setRegexMode:
        (disableRegex: boolean) =>
        ({ editor }) => {
          editor.storage.searchAndReplace.disableRegex = disableRegex
          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const editor = this.editor
    const { searchResultClass, selectedResultClass } = this.options

    // Helper functions to update storage
    const updateLastSearchTerm = (term: string) => {
      editor.storage.searchAndReplace.lastSearchTerm = term
    }

    const updateLastSelectedResult = (index: number) => {
      editor.storage.searchAndReplace.lastSelectedResult = index
    }

    const updateLastCaseSensitiveState = (state: boolean) => {
      editor.storage.searchAndReplace.lastCaseSensitiveState = state
    }

    const updateLastDisableRegexState = (state: boolean) => {
      editor.storage.searchAndReplace.lastDisableRegexState = state
    }

    return [
      new Plugin({
        key: searchAndReplacePluginKey,
        state: {
          init: () => DecorationSet.empty,
          apply({ doc, docChanged }, oldState) {
            const {
              searchTerm,
              selectedResult,
              lastSearchTerm,
              lastSelectedResult,
              caseSensitive,
              lastCaseSensitiveState,
              disableRegex,
              lastDisableRegexState,
            } = editor.storage.searchAndReplace as SearchAndReplaceStorage

            // Skip processing if nothing has changed
            if (
              !docChanged &&
              lastSearchTerm === searchTerm &&
              selectedResult === lastSelectedResult &&
              lastCaseSensitiveState === caseSensitive &&
              lastDisableRegexState === disableRegex
            ) {
              return oldState
            }

            // Update last states
            updateLastSearchTerm(searchTerm)
            updateLastSelectedResult(selectedResult)
            updateLastCaseSensitiveState(caseSensitive)
            updateLastDisableRegexState(disableRegex)

            // Clear results if search term is empty
            if (!searchTerm.trim()) {
              editor.storage.searchAndReplace.selectedResult = 0
              editor.storage.searchAndReplace.results = []
              return DecorationSet.empty
            }

            // Create regex and process search results
            const searchRegex = createSearchRegex(searchTerm, disableRegex, caseSensitive)
            const { decorations, results } = processSearchResults(
              doc,
              searchRegex,
              selectedResult,
              searchResultClass,
              selectedResultClass,
            )

            // Update results in storage
            editor.storage.searchAndReplace.results = results

            // Adjust selected result if it's out of bounds
            if (selectedResult >= results.length) {
              editor.storage.searchAndReplace.selectedResult = results.length > 0 ? 0 : 0
            }

            return decorations
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
        },
      }),
    ]
  },
})

//=============================================================================
// REACT HOOK
//=============================================================================

/**
 * Hook for managing search and replace functionality in a TipTap editor
 */
export function useSearchReplace(editor: Editor | null, options: UseSearchReplaceOptions = {}): UseSearchReplaceReturn {
  const {
    initialSearchTerm = "",
    initialReplaceTerm = "",
    initialCaseSensitive = false,
    initialRegexMode = false,
  } = options

  const [searchTerm, setSearchTermState] = useState(initialSearchTerm)
  const [replaceTerm, setReplaceTermState] = useState(initialReplaceTerm)
  const [caseSensitive, setCaseSensitiveState] = useState(initialCaseSensitive)
  const [regexMode, setRegexModeState] = useState(initialRegexMode)
  const [resultCount, setResultCount] = useState(0)
  const [currentResult, setCurrentResult] = useState(0)

  // Update editor when search parameters change
  useEffect(() => {
    if (!editor) return

    editor.commands.setSearchTerm(searchTerm)
    editor.commands.setReplaceTerm(replaceTerm)
    editor.commands.setCaseSensitive(caseSensitive)
    editor.commands.setRegexMode(!regexMode)
  }, [editor, searchTerm, replaceTerm, caseSensitive, regexMode])

  // Update result stats from editor storage
  useEffect(() => {
    if (!editor) return

    const updateResultStats = () => {
      const storage = editor.storage.searchAndReplace
      if (storage) {
        setResultCount(storage.results.length)
        setCurrentResult(storage.results.length > 0 ? storage.selectedResult + 1 : 0)
      }
    }

    // Initial update
    updateResultStats()

    return () => { editor.on("update", updateResultStats) }
  }, [editor])

  // Set search term and update editor
  const setSearchTerm = useCallback(
    (term: string) => {
      setSearchTermState(term)
      editor?.commands.setSearchTerm(term)
    },
    [editor],
  )

  // Set replace term and update editor
  const setReplaceTerm = useCallback(
    (term: string) => {
      setReplaceTermState(term)
      editor?.commands.setReplaceTerm(term)
    },
    [editor],
  )

  // Set case sensitivity and update editor
  const setCaseSensitive = useCallback(
    (value: boolean) => {
      setCaseSensitiveState(value)
      editor?.commands.setCaseSensitive(value)
    },
    [editor],
  )

  // Set regex mode and update editor
  const setRegexMode = useCallback(
    (value: boolean) => {
      setRegexModeState(value)
      editor?.commands.setRegexMode(!value)
    },
    [editor],
  )

  // Go to next result
  const goToNextResult = useCallback(() => {
    editor?.commands.selectNextResult()
  }, [editor])

  // Go to previous result
  const goToPreviousResult = useCallback(() => {
    editor?.commands.selectPreviousResult()
  }, [editor])

  // Replace current result
  const replaceCurrentResult = useCallback(() => {
    if (editor) {
      editor.commands.replace()
      // After replacing, select the next result
      setTimeout(() => editor.commands.selectNextResult(), 0)
    }
  }, [editor])

  // Replace all results
  const replaceAllResults = useCallback(() => {
    editor?.commands.replaceAll()
  }, [editor])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTermState("")
    editor?.commands.setSearchTerm("")
  }, [editor])

  return {
    searchTerm,
    setSearchTerm,
    replaceTerm,
    setReplaceTerm,
    caseSensitive,
    setCaseSensitive,
    regexMode,
    setRegexMode,
    resultCount,
    currentResult,
    goToNextResult,
    goToPreviousResult,
    replaceCurrentResult,
    replaceAllResults,
    clearSearch,
  }
}

//=============================================================================
// UI COMPONENTS
//=============================================================================

/**
 * Dialog component for search and replace
 */
export function SearchReplaceDialog({
  editor,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: SearchReplaceDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [replaceTerm, setReplaceTerm] = useState("")
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [disableRegex, setDisableRegex] = useState(true)
  const [open, setOpen] = useState(false)
  const [resultCount, setResultCount] = useState(0)
  const [currentResult, setCurrentResult] = useState(0)

  // Handle controlled/uncontrolled state
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : open
  const onOpenChange = isControlled ? setControlledOpen : setOpen

  // Update editor state when search term changes
  useEffect(() => {
    if (!editor) return

    editor.commands.setSearchTerm(searchTerm)
    editor.commands.setCaseSensitive(caseSensitive)
    editor.commands.setRegexMode(disableRegex)
    editor.commands.setReplaceTerm(replaceTerm)
  }, [editor, searchTerm, caseSensitive, disableRegex, replaceTerm])

  // Update result count from editor storage
  useEffect(() => {
    if (!editor) return

    const updateResultInfo = () => {
      const storage = editor.storage.searchAndReplace
      if (storage) {
        setResultCount(storage.results.length)
        setCurrentResult(storage.results.length > 0 ? storage.selectedResult + 1 : 0)
      }
    }

    // Initial update
    updateResultInfo()

    return () => { editor.on("update", updateResultInfo) }
  }, [editor])

  // Handle search term change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  // Handle replace term change
  const handleReplaceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReplaceTerm(e.target.value)
  }, [])

  // Handle case sensitivity toggle
  const handleCaseSensitiveChange = useCallback((checked: boolean) => {
    setCaseSensitive(checked)
  }, [])

  // Handle regex mode toggle
  const handleRegexModeChange = useCallback((checked: boolean) => {
    setDisableRegex(!checked)
  }, [])

  // Navigation and replace actions
  const handlePrevious = useCallback(() => {
    editor.commands.selectPreviousResult()
  }, [editor])

  const handleNext = useCallback(() => {
    editor.commands.selectNextResult()
  }, [editor])

  const handleReplace = useCallback(() => {
    editor.commands.replace()
    // After replacing, select the next result
    setTimeout(() => editor.commands.selectNextResult(), 0)
  }, [editor])

  const handleReplaceAll = useCallback(() => {
    editor.commands.replaceAll()
  }, [editor])

  const handleClear = useCallback(() => {
    setSearchTerm("")
    setReplaceTerm("")
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default browser search
      if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
      }

      // Navigation shortcuts
      if (e.key === "Enter") {
        if (e.shiftKey) {
          handlePrevious()
        } else {
          handleNext()
        }
        e.preventDefault()
      }

      // Replace shortcuts
      if (e.key === "r" && (e.ctrlKey || e.metaKey)) {
        if (e.shiftKey) {
          handleReplaceAll()
        } else {
          handleReplace()
        }
        e.preventDefault()
      }

      // Close dialog on Escape
      if (e.key === "Escape" && onOpenChange) {
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleNext, handlePrevious, handleReplace, handleReplaceAll, onOpenChange])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search and Replace</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Search field */}
          <div className="grid gap-2">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 size-7"
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>

            {/* Result count */}
            {searchTerm && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={resultCount > 0 ? "default" : "destructive"} className="text-xs">
                    {resultCount} {resultCount === 1 ? "match" : "matches"}
                  </Badge>
                  {resultCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {currentResult} of {resultCount}
                    </span>
                  )}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={handlePrevious}
                    disabled={resultCount === 0}
                    aria-label="Previous match"
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={handleNext}
                    disabled={resultCount === 0}
                    aria-label="Next match"
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Replace field */}
          <div className="grid gap-2">
            <Label htmlFor="replace" className="sr-only">
              Replace
            </Label>
            <div className="relative">
              <Replace className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="replace"
                placeholder="Replace with..."
                className="pl-8"
                value={replaceTerm}
                onChange={handleReplaceChange}
              />
            </div>

            {/* Replace buttons */}
            {searchTerm && (
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={handleReplace} disabled={resultCount === 0}>
                  Replace
                </Button>
                <Button variant="secondary" size="sm" onClick={handleReplaceAll} disabled={resultCount === 0}>
                  Replace All
                </Button>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="case-sensitive" checked={caseSensitive} onCheckedChange={handleCaseSensitiveChange} />
              <Label htmlFor="case-sensitive" className="text-sm">
                Case sensitive
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="regex-mode" checked={!disableRegex} onCheckedChange={handleRegexModeChange} />
              <Label htmlFor="regex-mode" className="text-sm">
                Regex mode
              </Label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Toolbar component for search and replace
 */
export function SearchReplaceToolbar({ editor, className = "" }: SearchReplaceToolbarProps) {
  const {
    searchTerm,
    setSearchTerm,
    replaceTerm,
    setReplaceTerm,
    caseSensitive,
    setCaseSensitive,
    regexMode,
    setRegexMode,
    resultCount,
    currentResult,
    goToNextResult,
    goToPreviousResult,
    replaceCurrentResult,
    replaceAllResults,
    clearSearch,
  } = useSearchReplace(editor)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    },
    [setSearchTerm],
  )

  const handleReplaceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setReplaceTerm(e.target.value)
    },
    [setReplaceTerm],
  )

  return (
    <div className={`flex flex-col gap-2 p-2 border rounded-md bg-background ${className}`}>
      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 h-9" value={searchTerm} onChange={handleSearchChange} />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 size-7"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={goToPreviousResult}
          disabled={resultCount === 0}
          aria-label="Previous match"
        >
          <ArrowUp className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={goToNextResult}
          disabled={resultCount === 0}
          aria-label="Next match"
        >
          <ArrowDown className="size-4" />
        </Button>

        {searchTerm && resultCount > 0 && (
          <Badge variant="secondary" className="h-9 px-2">
            {currentResult} of {resultCount}
          </Badge>
        )}
      </div>

      {/* Replace row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Replace className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Replace with..."
            className="pl-8 h-9"
            value={replaceTerm}
            onChange={handleReplaceChange}
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="h-9"
          onClick={replaceCurrentResult}
          disabled={resultCount === 0}
        >
          Replace
        </Button>

        <Button variant="secondary" size="sm" className="h-9" onClick={replaceAllResults} disabled={resultCount === 0}>
          Replace All
        </Button>
      </div>

      {/* Options row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="case-sensitive-toolbar" checked={caseSensitive} onCheckedChange={setCaseSensitive} />
          <Label htmlFor="case-sensitive-toolbar" className="text-sm">
            Case sensitive
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="regex-mode-toolbar" checked={regexMode} onCheckedChange={setRegexMode} />
          <Label htmlFor="regex-mode-toolbar" className="text-sm">
            Regex mode
          </Label>
        </div>

        {searchTerm && resultCount === 0 && (
          <Badge variant="destructive" className="ml-auto">
            No matches
          </Badge>
        )}
      </div>
    </div>
  )
}

//=============================================================================
// DEFAULT EXPORT
//=============================================================================

export default SearchAndReplace
