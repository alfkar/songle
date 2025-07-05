// components/SongPicker.jsx
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

// Receive elapsedTime and formatTime as props
export default function SongPicker({ songs, dailySong, handleSongGuess, elapsedTime, formatTime, isRunning }) {
  const [open, setOpen] = React.useState(false)
  const [correctSong, setCorrectSong] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [showErrorAnimation, setShowErrorAnimation] = React.useState(false);
  const [result, setResult] = React.useState('');

  React.useEffect(() => {
    let timer;
    if (showErrorAnimation) {
      timer = setTimeout(() => {
        setShowErrorAnimation(false);
      }, 500); 
    }
    return () => clearTimeout(timer);
  }, [showErrorAnimation]);
  React.useEffect(() => {
    setCorrectSong(false);
    setValue("");
    setResult('');
  }, [dailySong]);
  
  const handleSongSelection = (currentValue, selectedSongName) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false); 

    const isCorrect = selectedSongName === dailySong;
    setCorrectSong(isCorrect); 
    handleSongGuess(isCorrect); 
    if(isCorrect){
      setResult(elapsedTime)
    }

    if (!isCorrect) {
      setShowErrorAnimation(true); 
    }
  };

  if (correctSong) {
    return (
      <Alert variant="default">
        <AlertTitle>{dailySong} is correct!</AlertTitle>
        <AlertDescription>
          Your time: {formatTime(result)}
        </AlertDescription>
      </Alert>
    );
  }

  const triggerClassName = cn(
    "w-105 justify-between overflow-scroll",
    showErrorAnimation && "shake-error border-red-500",
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={triggerClassName}
          disabled={!isRunning}
        >
          <span className="flex-1 min-w-0 truncate">
            {value
              ? songs.find((s) => s.name === value)?.name
              : "Select a song..."}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" side="bottom"   avoidCollisions={false} >
        <Command>
          <CommandInput placeholder="Search for a song" />
          <CommandList>
            <CommandEmpty>No song found.</CommandEmpty>
            <CommandGroup>
              {songs.map((song) => (
                <CommandItem
                  key={song.id || song.name}
                  value={song.name}
                  onSelect={(currentValue) =>
                    handleSongSelection(currentValue, song.name)
                  }
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
  );
}