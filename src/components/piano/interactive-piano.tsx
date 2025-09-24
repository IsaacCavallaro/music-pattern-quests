

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Music, Play, StopCircle } from 'lucide-react';

type Note = {
  name: string;
  freq: number;
  isSharp: boolean;
};

const notes: Note[] = [
    { name: 'C4', freq: 261.63, isSharp: false },
    { name: 'C#4', freq: 277.18, isSharp: true },
    { name: 'D4', freq: 293.66, isSharp: false },
    { name: 'D#4', freq: 311.13, isSharp: true },
    { name: 'E4', freq: 329.63, isSharp: false },
    { name: 'F4', freq: 349.23, isSharp: false },
    { name: 'F#4', freq: 369.99, isSharp: true },
    { name: 'G4', freq: 392.00, isSharp: false },
    { name: 'G#4', freq: 415.30, isSharp: true },
    { name: 'A4', freq: 440.00, isSharp: false },
    { name: 'A#4', freq: 466.16, isSharp: true },
    { name: 'B4', freq: 493.88, isSharp: false },
    { name: 'C5', freq: 523.25, isSharp: false },
    { name: 'D5', freq: 587.33, isSharp: false },
  ];

type MelodyNote = {
    noteNames: (string | null)[];
    duration: number;
}

interface InteractivePianoProps {
    melody: MelodyNote[];
}


export function InteractivePiano({ melody }: InteractivePianoProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      // Clear all timeouts when the component unmounts
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const playNote = (frequency: number, duration: number) => {
    if (typeof window === 'undefined') return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + (duration / 1000));

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + (duration / 1000));
  };

  const startMelody = () => {
    if (isPlaying) return;
    setIsPlaying(true);

    let currentTime = 0;
    melody.forEach((melodyNote, index) => {
      const timeout = setTimeout(() => {
        const currentActiveNotes = new Set<string>();
        melodyNote.noteNames.forEach(noteName => {
            if (noteName) {
                const noteData = notes.find(n => n.name === noteName);
                if (noteData) {
                    playNote(noteData.freq, melodyNote.duration);
                    currentActiveNotes.add(noteData.name);
                }
            }
        });
        setActiveNotes(currentActiveNotes);

        const offTimeout = setTimeout(() => {
            setActiveNotes(new Set());
        }, melodyNote.duration - 50);
        timeoutsRef.current.push(offTimeout);

        if (index === melody.length - 1) {
            const lastTimeout = setTimeout(() => {
                setIsPlaying(false);
            }, melodyNote.duration);
            timeoutsRef.current.push(lastTimeout);
        }
      }, currentTime);
      timeoutsRef.current.push(timeout);
      currentTime += melodyNote.duration;
    });
  };

  const stopMelody = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsPlaying(false);
    setActiveNotes(new Set());
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
      });
    }
  };


  const whiteKeys = notes.filter(note => !note.isSharp);
  const blackKeys = notes.filter(note => note.isSharp);

  return (
    <div className="relative flex flex-col items-center justify-center gap-4">
        <div
            className={cn(
                "relative flex h-48 w-full select-none rounded-lg border bg-background p-4 shadow-inner"
            )}
        >
            {whiteKeys.map((note) => (
                <div
                key={note.name}
                className={cn(
                    "flex h-full flex-1 flex-col justify-end rounded-b-md border-2 border-muted-foreground bg-card p-2 text-foreground transition-colors duration-100",
                    activeNotes.has(note.name) && "bg-red-500/50 border-red-600"
                )}
                >
                <span className="pointer-events-none">{note.name.slice(0, -1)}</span>
                </div>
            ))}
            <div className="absolute top-4 left-0 right-0 mx-4 flex h-2/3 w-full pointer-events-none">
                {blackKeys.map((note) => {
                    let leftPosition = '0%';
                    if (note.name === 'C#4') leftPosition = '9.375%';
                    if (note.name === 'D#4') leftPosition = '21.875%';
                    if (note.name === 'F#4') leftPosition = '46.875%';
                    if (note.name === 'G#4') leftPosition = '59.375%';
                    if (note.name === 'A#4') leftPosition = '71.875%';

                    return (
                        <div
                            key={note.name}
                            className={cn(
                                "absolute z-10 h-full w-[6.25%] rounded-b-md border-2 border-muted-foreground bg-foreground transition-colors duration-100",
                                activeNotes.has(note.name) && "bg-red-500 border-red-600"
                            )}
                            style={{ left: leftPosition }}
                        />
                    );
                })}
            </div>
        </div>
        <div className="flex gap-4">
          <Button onClick={startMelody} disabled={isPlaying}>
            <Play className="mr-2"/>
            start
          </Button>
          <Button onClick={stopMelody} disabled={!isPlaying} variant="destructive">
            <StopCircle className="mr-2"/>
            stop
          </Button>
        </div>
    </div>
  );
}
