'use client';

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import abcjs from 'abcjs';
import 'abcjs/abcjs-audio.css';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

export type AbcNoteEvent = abcjs.NoteTimingEvent;

interface InteractiveSheetMusicProps {
  abcNotation: string;
  onTempoChange: (newTempo: number) => void;
  initialTempo: number;
  onNoteEvent?: (event: AbcNoteEvent | null) => void;
}

export interface SheetMusicHandles {
  getTempo: () => number;
}

// Get the base path for production
const getBasePath = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.includes('/music-pattern-quests') ? '/music-pattern-quests' : '';
  }
  return process.env.NODE_ENV === 'production' ? '/music-pattern-quests' : '';
};

export const InteractiveSheetMusic = forwardRef<SheetMusicHandles, InteractiveSheetMusicProps>(
  ({ abcNotation, onTempoChange, initialTempo, onNoteEvent }, ref) => {
    const sheetMusicRef = useRef<HTMLDivElement>(null);
    const visualObj = useRef<abcjs.TuneObject[] | null>(null);
    const synthControl = useRef<any>(null); // still `any` since abcjs types are incomplete

    const [tempo, setTempo] = useState(initialTempo);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useImperativeHandle(ref, () => ({
      getTempo: () => {
        if (!visualObj.current || visualObj.current.length === 0) return initialTempo;

        const tempoValue = visualObj.current[0].metaText?.tempo;
        if (typeof tempoValue === 'string') {
          const parsed = parseInt(tempoValue, 10);
          if (!isNaN(parsed)) return parsed;
        } else if (typeof tempoValue === 'object' && tempoValue?.bpm) {
          return tempoValue.bpm;
        }
        return initialTempo;
      },
    }));

    useEffect(() => {
      if (typeof window === 'undefined' || !sheetMusicRef.current) return;

      // Configure abcjs for GitHub Pages deployment
      const basePath = getBasePath();

      // Set the audio context and synthesis options
      if ((abcjs as any).synth.setAudioContext) {
        try {
          (abcjs as any).synth.setAudioContext({
            audioPath: `${basePath}/`,
            soundfontUrl: `${basePath}/`
          });
        } catch (configError) {
          console.warn('Could not configure abcjs audio path:', configError);
        }
      }

      // Cleanup previous synth
      if (synthControl.current?.midi) {
        synthControl.current.midi.stop();
      }

      sheetMusicRef.current.innerHTML = '';
      setError(null);
      setIsLoading(true);

      let currentTempo = initialTempo;

      try {
        const renderOptions = { add_classes: true, responsive: 'resize' as const };
        visualObj.current = abcjs.renderAbc(sheetMusicRef.current, abcNotation, renderOptions);

        if (visualObj.current && visualObj.current[0]) {
          const tempoValue = visualObj.current[0].metaText?.tempo;
          if (typeof tempoValue === 'string') {
            const parsed = parseInt(tempoValue, 10);
            if (!isNaN(parsed)) {
              currentTempo = parsed;
            }
          } else if (typeof tempoValue === 'object' && tempoValue?.bpm) {
            currentTempo = tempoValue.bpm;
          }
        }

        if (currentTempo !== tempo) {
          setTempo(currentTempo);
          onTempoChange(currentTempo);
        }
      } catch (renderError: any) {
        console.error('Error rendering ABC notation:', renderError);
        setError(renderError.message || 'An unknown error occurred during rendering.');
        setIsLoading(false);
        return;
      }

      // Initialize audio synth with enhanced error handling
      if (abcjs.synth.supportsAudio()) {
        if (!synthControl.current) {
          synthControl.current = new (abcjs as any).synth.SynthController();
        }

        const cursorControl = {
          onStart: () => {
            const svg = sheetMusicRef.current?.querySelector('svg');
            if (svg) {
              const cursor = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              cursor.setAttribute('class', 'abcjs-cursor');
              svg.appendChild(cursor);
            }
          },
          onFinished: () => {
            onNoteEvent?.(null);
            const cursor = sheetMusicRef.current?.querySelector('.abcjs-cursor');
            if (cursor) {
              cursor.setAttribute('x1', '0');
              cursor.setAttribute('x2', '0');
              cursor.setAttribute('y1', '0');
              cursor.setAttribute('y2', '0');
            }
          },
          onBeat: () => { },
          onEvent: (ev: abcjs.NoteTimingEvent) => {
            onNoteEvent?.(ev);
            if (ev.measureStart && ev.left === null) return;

            const cursor = sheetMusicRef.current?.querySelector('.abcjs-cursor');
            if (cursor) {
              const left = ev.left ?? 0;
              const top = ev.top ?? 0;
              const height = ev.height ?? 0;
              cursor.setAttribute('x1', String(left));
              cursor.setAttribute('x2', String(left));
              cursor.setAttribute('y1', String(top));
              cursor.setAttribute('y2', String(top + height));
            }
          },
        };

        synthControl.current.load('#audio', cursorControl, {
          displayLoop: true,
          displayRestart: true,
          displayPlay: true,
          displayProgress: true,
          displayWarp: false,
        });

        const midiBuffer = new (abcjs as any).synth.CreateSynth();

        // Enhanced audio initialization with better error handling
        midiBuffer
          .init({
            visualObj: visualObj.current![0],
            options: {
              audioPath: `${basePath}/`,
            }
          })
          .then(() => {
            if (synthControl.current && visualObj.current) {
              return (synthControl.current as any).setTune(
                visualObj.current[0] as any,
                false,
                { qpm: currentTempo }
              );
            }
          })
          .then(() => {
            setIsLoading(false);
            console.log('Audio successfully loaded.');
          })
          .catch((err: any) => {
            console.warn('Audio initialization failed:', err);
            // Try fallback initialization without custom paths
            midiBuffer
              .init({ visualObj: visualObj.current![0] })
              .then(() => {
                if (synthControl.current && visualObj.current) {
                  return (synthControl.current as any).setTune(
                    visualObj.current[0] as any,
                    false,
                    { qpm: currentTempo }
                  );
                }
              })
              .then(() => {
                setIsLoading(false);
                console.log('Audio loaded with fallback method.');
              })
              .catch((fallbackErr: any) => {
                console.error('Fallback audio initialization also failed:', fallbackErr);
                setError('Audio initialization failed. Music notation will display but audio playback is unavailable.');
                setIsLoading(false);
              });
          });
      } else {
        setError('Audio is not supported in this browser.');
        setIsLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abcNotation]);

    if (error && !error.includes('Audio initialization failed. Music notation will display')) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Rendering Error</AlertTitle>
          <AlertDescription>
            <p>
              Could not display sheet music. Please check your ABC notation for syntax errors.
            </p>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-xs bg-destructive-foreground/10 p-2 rounded-md">
              {error}
            </pre>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        {error && error.includes('Audio initialization failed. Music notation will display') && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Audio Unavailable</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        {isLoading && (
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing audio...
          </div>
        )}
        <div className="flex items-center justify-between">
          <div id="audio" className="flex-grow" />
        </div>
        <div className="p-4 border rounded-lg bg-card overflow-x-auto shadow-inner">
          <div ref={sheetMusicRef} />
        </div>
        <style jsx global>{`
          .abcjs-highlight {
            fill: hsl(var(--primary));
          }
          .abcjs-cursor {
            stroke: hsl(var(--primary));
            stroke-width: 2px;
            stroke-opacity: 0.7;
            fill: none;
          }
          #audio {
            margin-top: 1rem;
            padding: 1rem;
            border: 1px solid hsl(var(--border));
            border-radius: var(--radius);
          }
          #audio .abcjs-midi-loop {
            display: none;
          }
        `}</style>
      </div>
    );
  }
);

InteractiveSheetMusic.displayName = 'InteractiveSheetMusic';