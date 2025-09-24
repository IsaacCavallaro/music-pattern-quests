'use client';

import { useState, useRef, useEffect } from 'react';
import { InteractiveSheetMusic, type SheetMusicHandles } from './interactive-sheet-music';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exampleBeats, defaultNotation } from '@/lib/example-beats';

export function MusicPatternQuestsWorkspace() {
  const [abcNotation, setAbcNotation] = useState<string>(defaultNotation);
  const [tempo, setTempo] = useState(120);
  const sheetMusicRef = useRef<SheetMusicHandles>(null);

  useEffect(() => {
    // A simple regex to find the Q: line for tempo
    const tempoMatch = abcNotation.match(/Q:\s*(?:1\/4\s*=)?\s*(\d+)/);
    if (tempoMatch && tempoMatch[1]) {
      const newTempo = parseInt(tempoMatch[1], 10);
      if (!isNaN(newTempo)) {
        setTempo(newTempo);
      }
    } else {
      setTempo(120); // Default tempo
    }
  }, [abcNotation]);

  const handleNotationChange = (newNotation: string) => {
    setAbcNotation(newNotation);
  };

  const handleExampleChange = (notation: string) => {
    setAbcNotation(notation);
  };

  const handleTempoChange = (newTempo: number) => {
    setTempo(newTempo);

    let newAbc = abcNotation;
    const qLineRegex = /Q:.*(\r\n|\n|\r)?/g;

    if (abcNotation.match(qLineRegex)) {
      newAbc = newAbc.replace(qLineRegex, `Q:1\/4=${newTempo}\n`);
    } else {
      const kLineRegex = /K:.*(\r\n|\n|\r)?/;
      if (abcNotation.match(kLineRegex)) {
        newAbc = newAbc.replace(kLineRegex, `$&Q:1\/4=${newTempo}\n`);
      } else {
        newAbc = newAbc + `\nQ:1\/4=${newTempo}\n`;
      }
    }

    if (newAbc !== abcNotation) {
      setAbcNotation(newAbc);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 grid grid-cols-1 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleExampleChange}>
            <SelectTrigger className="w-full md:w-1/3">
              <SelectValue placeholder="select a beat..." />
            </SelectTrigger>
            <SelectContent>
              {exampleBeats.map((beat) => (
                <SelectItem key={beat.name} value={beat.notation}>
                  {beat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">abc notation editor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              value={abcNotation}
              onChange={(e) => handleNotationChange(e.target.value)}
              rows={25}
              className="w-full p-2 border rounded-md font-code text-sm bg-card"
              placeholder="Enter ABC notation here..."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">notation &amp; playback</CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveSheetMusic
              ref={sheetMusicRef}
              key={abcNotation}
              abcNotation={abcNotation}
              initialTempo={tempo}
              onTempoChange={handleTempoChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
