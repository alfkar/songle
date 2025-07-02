"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/8bit/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/8bit/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/8bit/popover"
import { 
  Alert,
  AlertTitle,
  AlertDescription
 } from "./ui/8bit/alert"

export default function SongPicker({ songs, dailySong, handleSongGuess}) { 
  const [open, setOpen] = React.useState(false)
  const [correctSong, setCorrectSong] = React.useState(false)
  const [value, setValue] = React.useState("")
  if (correctSong) {
    return (
      <Alert variant="default">
          <AlertTitle>{dailySong} is correct!</AlertTitle>
      </Alert>
    );
  }
  return (
    <Popover className="w-full" open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-105 justify-between overflow-scroll"
        >
        <span className="flex-1 min-w-0 truncate">
          {value
            ? songs.find((s) => s.name === value)?.name
            : "Select a song..."}
        </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">         
        <Command>
          <CommandInput placeholder="Search for a song" />
          <CommandList>
            <CommandEmpty>No song found.</CommandEmpty> {/* Changed empty text */}
            <CommandGroup>
              {songs.map((song) => (
                <CommandItem
                  key={song.id} // Use a unique ID if available, otherwise song.name (if guaranteed unique)
                  value={song.name} // The value to set when selected
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    const isCorrect = song.name === dailySong;
                    setCorrectSong(isCorrect);
                    handleSongGuess(isCorrect);
                    
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === song.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {song.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}