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

// IMPORTANT: Assume 'songs' prop is an array of song objects,
// where each song has an 'artists' array, and each artist has a 'name'.
// Example:
// {
//   id: 'song1',
//   name: 'Song Title 1',
//   artists: [
//     { id: 'artistA', name: 'Artist A' },
//     { id: 'artistB', name: 'Artist B' }
//   ]
// },
// {
//   id: 'song2',
//   name: 'Song Title 2',
//   artists: [
//     { id: 'artistA', name: 'Artist A' }, // Artist A appears in multiple songs
//     { id: 'artistC', name: 'Artist C' }
//   ]
// }


// Receive elapsedTime and formatTime as props
// 'dailyArtists' will now be the name of the correct artist to guess
export default function ArtistPicker({ songs, dailyArtists, handleArtistGuess, elapsedTime, formatTime, isRunning }) {
  const [open, setOpen] = React.useState(false)
  const [correctArtist, setCorrectArtist] = React.useState(false)
  const [value, setValue] = React.useState("") // 'value' stores the name of the selected artist
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

  // 1. Derive unique artists from the 'songs' prop
  const allArtists = React.useMemo(() => {
    const artistNames = new Set();
    songs.forEach(song => {
      // Ensure song.artists exists and is an array
      if (Array.isArray(song.artists)) {
        song.artists.forEach(artist => {
          if (artist && typeof artist.name === 'string') {
            artistNames.add(artist.name);
          }
        });
      }
    });
    const uniqueNamesArray = Array.from(artistNames);
    return uniqueNamesArray.sort((a, b) => a.localeCompare(b)); // Sort alphabetically
  }, [songs]); // Recalculate only if 'songs' prop changes

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

  // Displays success alert if the artist is correct
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
    "w-105 justify-between overflow-scroll", // 'w-105' might be intended as 'w-[105px]' or 'w-[26.25rem]' for Tailwind.
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
          disabled={!isRunning} // Disables button if game is not running
        >
          <span className="flex-1 min-w-0 truncate">
            {/* Displays selected artist name or "Select an artist..." */}
            {value
              ? allArtists.find((artistName) => artistName === value) // Check if the selected value is one of the unique artists
              : "Select an artist..."}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" side="bottom" avoidCollisions={false} >
        <Command>
          <CommandInput placeholder="Search for an artist" /> {/* Changed placeholder */}
          <CommandList>
            <CommandEmpty>No artist found.</CommandEmpty> {/* Changed empty message */}
            <CommandGroup>
              {allArtists.map((artistName) => ( // Iterate over unique artist names
                <CommandItem
                  key={artistName} // Use the unique artist name as the key
                  value={artistName} // CommandItem value is the artist name
                  onSelect={(currentValue) =>
                    handleArtistSelection(currentValue, artistName) // Pass CommandItem's value and the artist name
                  }
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === artistName ? "opacity-100" : "opacity-0" // Checks if current artist is selected
                    )}
                  />
                  {artistName} {/* Displays the artist name */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}