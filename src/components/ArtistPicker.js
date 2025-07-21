// components/ArtistPicker.jsx (or SongPicker.jsx if you prefer to keep the filename)
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


export default function ArtistPicker({ songs, dailyArtists, handleArtistGuess, elapsedTime, formatTime, isRunning, resetKey }) {
  const [open, setOpen] = React.useState(false)
  const [correctArtist, setCorrectArtist] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [showErrorAnimation, setShowErrorAnimation] = React.useState(false);
  const [result, setResult] = React.useState('');
  const [guessedArtist, setGuessedArtist] = React.useState('')

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
    setCorrectArtist(false);
    setValue("");
    setShowErrorAnimation(false);
    setResult('');
    setGuessedArtist('');
  }, [dailyArtists, resetKey]);
  
  const allArtists = React.useMemo(() => {
    const artistNames = new Set();
    songs.forEach(song => {
      if (Array.isArray(song.artists)) {
        song.artists.forEach(artist => {
          if (artist && typeof artist.name === 'string') {
            artistNames.add(artist.name);
          }
        });
      }
    });
    const uniqueNamesArray = Array.from(artistNames);
    return uniqueNamesArray.sort((a, b) => a.localeCompare(b));
  }, [songs]); 

  const isDailyArtist = (guessedArtist, artists) => {
    let exists = false;
   artists.forEach((artist) => {
    if (guessedArtist == artist.name){
      exists = true;
    }
    })
    return exists
  }

  const handleArtistSelection = (currentValue, selectedArtistName) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false); 
    const isCorrect = isDailyArtist(selectedArtistName, dailyArtists) 
    setCorrectArtist(isCorrect);
    handleArtistGuess(isCorrect);
    if(isCorrect){
      setGuessedArtist(selectedArtistName)
      setResult(elapsedTime) 
    }

    if (!isCorrect) {
      setShowErrorAnimation(true);
    }
  };

  if (correctArtist) {
    return (
      <Alert variant="default">
        <AlertTitle>{guessedArtist} is correct!</AlertTitle>
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
              ? allArtists.find((artistName) => artistName === value) 
              : "Select an artist..."}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" side="bottom" avoidCollisions={false} >
        <Command>
          <CommandInput placeholder="Search for an artist" />
          <CommandList>
            <CommandEmpty>No artist found.</CommandEmpty> 
            <CommandGroup>
              {allArtists.map((artistName) => (
                <CommandItem
                  key={artistName} 
                  value={artistName} 
                  onSelect={(currentValue) =>
                    handleArtistSelection(currentValue, artistName) 
                  }
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === artistName ? "opacity-100" : "opacity-0" 
                    )}
                  />
                  {artistName} 
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}