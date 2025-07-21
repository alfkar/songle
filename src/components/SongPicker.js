// components/SongPicker.jsx
"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/8bit/button" // Ensure this is your custom 8bit button
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
export default function SongPicker({ songs, dailySong, handleSongGuess, elapsedTime, formatTime, isRunning, resetKey }) {
  const [open, setOpen] = React.useState(false)
  const [correctSong, setCorrectSong] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [showErrorAnimation, setShowErrorAnimation] = React.useState(false);
  const [result, setResult] = React.useState('');
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const textRef = React.useRef(null);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
            console.log(containerRef.current)
            console.log(containerRef.current.parentElement.clientWidth)
            console.log(textRef.current.scrollWidth)
        if(textRef.current.scrollWidth > containerRef.current.parentElement.clientWidth){
          setIsOverflowing(false)
          setIsOverflowing(true)
        }
        else{
          setIsOverflowing(false)
        }
      }
    };

    // Defer the check to ensure accurate measurements after render
    const timeoutId = setTimeout(checkOverflow, 0);
    return () => clearTimeout(timeoutId);
  }, [value]);

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
    setOpen(false);
    setCorrectSong(false);
    setValue("");
    setShowErrorAnimation(false);
    setResult('');
    setIsOverflowing(false);
  }, [dailySong, resetKey]);
  
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={!isRunning}
          isError={showErrorAnimation}
          className="w-full justify-between"
        >
          <span ref={containerRef} className="flex-1 whitespace-nowrap overflow-hidden min-w-0">
            <span ref={textRef} className={cn("inline-block max-w-full", isOverflowing && "marquee")}>
              {value
                ? songs.find((s) => s.name === value)?.name
                : "Select a song..."}
            </span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" side="bottom"  avoidCollisions={false} >
        <Command>
          <CommandInput placeholder="Search for a song" />
          <CommandList className="max-h-60 overflow-y-auto ">
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
