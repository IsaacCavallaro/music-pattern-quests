
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

export const InteractiveSheetMusic = forwardRef<SheetMusicHandles, InteractiveSheetMusicProps>(
  ({ abcNotation, onTempoChange, initialTempo, onNoteEvent }, ref) => {
    const sheetMusicRef = useRef<HTMLDivElement>(null);
    const visualObj = useRef<abcjs.TuneObject[] | null>(null);
    const synthControl = useRef<abcjs.SynthController | null>(null);
    
    const [tempo, setTempo] = useState(initialTempo);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useImperativeHandle(ref, () => ({
      getTempo: () => {
        if (visualObj.current && visualObj.current[0] && visualObj.current[0].metaText.tempo) {
          const newTempo = parseInt(visualObj.current[0].metaText.tempo, 10);
          if (!isNaN(newTempo)) {
            return newTempo;
          }
        }
        return initialTempo;
      },
    }));
    
    // Main effect to render and initialize audio
    useEffect(() => {
      if (typeof window === 'undefined' || !sheetMusicRef.current) return;

      // Cleanup previous instances
      if (synthControl.current && synthControl.current.midi) {
        synthControl.current.midi.stop();
      }
      sheetMusicRef.current.innerHTML = '';
      setError(null);
      setIsLoading(true);

      let currentTempo = 120; // Default tempo

      // Render the sheet music
      try {
        const renderOptions = { add_classes: true, responsive: 'resize' };
        visualObj.current = abcjs.renderAbc(sheetMusicRef.current, abcNotation, renderOptions);
        
        if (visualObj.current && visualObj.current[0] && visualObj.current[0].metaText.tempo) {
          const newTempo = parseInt(visualObj.current[0].metaText.tempo, 10);
          if (!isNaN(newTempo)) {
            currentTempo = newTempo;
            if (newTempo !== tempo) {
              setTempo(newTempo);
              onTempoChange(newTempo);
            }
          }
        } else {
            // If no tempo in notation, use the initial tempo from props.
            currentTempo = initialTempo;
            if (tempo !== initialTempo) {
              setTempo(initialTempo);
              onTempoChange(initialTempo);
            }
        }

      } catch (renderError: any) {
        console.error('Error rendering ABC notation:', renderError);
        setError(renderError.message || 'An unknown error occurred during rendering.');
        setIsLoading(false);
        return;
      }

      // Initialize the audio synthesizer
      if (abcjs.synth.supportsAudio()) {
        if (!synthControl.current) {
          synthControl.current = new abcjs.synth.SynthController();
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
              if (onNoteEvent) {
                onNoteEvent(null);
              }
              const cursor = sheetMusicRef.current?.querySelector('.abcjs-cursor');
              if (cursor) {
                cursor.setAttribute('x1', '0');
                cursor.setAttribute('x2', '0');
                cursor.setAttribute('y1', '0');
                cursor.setAttribute('y2', '0');
              }
            },
            onBeat: () => {},
            onEvent: (ev: abcjs.NoteTimingEvent) => {
              if (onNoteEvent) {
                onNoteEvent(ev);
              }
              if (ev.measureStart && ev.left === null) return;
              const cursor = sheetMusicRef.current?.querySelector('.abcjs-cursor');
              if (cursor) {
                cursor.setAttribute('x1', String(ev.left));
                cursor.setAttribute('x2', String(ev.left));
                cursor.setAttribute('y1', String(ev.top));
                cursor.setAttribute('y2', String(ev.top + ev.height));
              }
            },
          };

        synthControl.current.load('#audio', cursorControl, {
          displayLoop: true,
          displayRestart: true,
          displayPlay: true,
          displayProgress: true,
          displayWarp: false, // This hides the tempo control
        });

        const midiBuffer = new abcjs.synth.CreateSynth();
        midiBuffer
          .init({
            visualObj: visualObj.current![0],
          })
          .then(() => {
            if (synthControl.current) {
              return synthControl.current.setTune(visualObj.current![0], false, { qpm: currentTempo });
            }
          })
          .then(() => {
            setIsLoading(false);
            console.log('Audio successfully loaded.');
          })
          .catch((err: any) => {
            console.warn('Audio initialization failed:', err);
            setError(
              err.message ||
                'Audio initialization failed. Could not prepare the audio synthesizer.'
            );
            setIsLoading(false);
          });
      } else {
        setError('Audio is not supported in this browser.');
        setIsLoading(false);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abcNotation]); // This effect should only re-run when the notation changes.
  
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Rendering Error</AlertTitle>
          <AlertDescription>
            <p>
              Could not display sheet music. Please check your ABC notation for
              syntax errors.
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
