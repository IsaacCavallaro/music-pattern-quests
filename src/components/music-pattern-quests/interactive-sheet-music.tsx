'use client';

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import abcjs from 'abcjs';
import 'abcjs/abcjs-audio.css';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, Loader2, Play, Square } from 'lucide-react';

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

const getBasePath = () => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.includes('/music-pattern-quests') ? '/music-pattern-quests' : '';
  }
  return process.env.NODE_ENV === 'production' ? '/music-pattern-quests' : '';
};

export const InteractiveSheetMusic = forwardRef<SheetMusicHandles, InteractiveSheetMusicProps>(
  ({ abcNotation, onTempoChange, initialTempo, onNoteEvent }, ref) => {
    const sheetMusicRef = useRef<HTMLDivElement>(null);
    const sheetMusicContainerRef = useRef<HTMLDivElement>(null);
    const visualObj = useRef<abcjs.TuneObject[] | null>(null);
    const synthControl = useRef<any>(null);
    const midiBufferRef = useRef<any>(null);
    const audioContextResumed = useRef(false);

    const [tempo, setTempo] = useState(initialTempo);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
      getTempo: () => {
        if (visualObj.current && visualObj.current[0] && visualObj.current[0].metaText?.tempo) {
          const tempoValue = visualObj.current[0].metaText.tempo;
          if (typeof tempoValue === 'string') {
            const newTempo = parseInt(tempoValue, 10);
            if (!isNaN(newTempo)) {
              return newTempo;
            }
          } else if (typeof tempoValue === 'object' && tempoValue?.bpm) {
            return tempoValue.bpm;
          }
        }
        return initialTempo;
      },
    }));

    // Patched resumeAudioContext: directly resume abcjs’s context
    const resumeAudioContext = async (): Promise<boolean> => {
      try {
        if (typeof window === 'undefined') return false;

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return false;

        if (!(abcjs.synth as any).activeAudioContext) {
          (abcjs.synth as any).setAudioContext(new AudioContext());
        }

        const ctx = (abcjs.synth as any).activeAudioContext as AudioContext;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        audioContextResumed.current = true;
        return true;
      } catch (error) {
        console.error('Error resuming abcjs AudioContext:', error);
        return false;
      }
    };

    const setupScrollingCursor = () => {
      const svg = sheetMusicRef.current?.querySelector('svg');
      if (svg) {
        const cursor = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        cursor.setAttribute('class', 'abcjs-cursor');
        svg.appendChild(cursor);
      }
    };

    const scrollToCursor = (left: number | undefined, top: number | undefined, height: number | undefined) => {
      if (!sheetMusicContainerRef.current) return;
      const safeTop = top ?? 0;
      const safeHeight = height ?? 20;
      const container = sheetMusicContainerRef.current;
      const cursorMiddleY = safeTop + safeHeight / 2;
      const targetScrollTop = cursorMiddleY - container.clientHeight / 2 + container.scrollTop;
      container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
    };

    useEffect(() => {
      if (typeof window === 'undefined' || !sheetMusicRef.current) return;

      const basePath = getBasePath();

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

        if (visualObj.current?.[0]) {
          const tempoValue = visualObj.current[0].metaText?.tempo;
          if (typeof tempoValue === 'string') {
            const parsed = parseInt(tempoValue, 10);
            if (!isNaN(parsed)) {
              currentTempo = parsed;
              if (parsed !== tempo) {
                setTempo(parsed);
                onTempoChange(parsed);
              }
            }
          } else if (typeof tempoValue === 'object' && tempoValue?.bpm) {
            currentTempo = tempoValue.bpm;
            if (tempoValue.bpm !== tempo) {
              setTempo(tempoValue.bpm);
              onTempoChange(tempoValue.bpm);
            }
          } else {
            currentTempo = initialTempo;
            if (tempo !== initialTempo) {
              setTempo(initialTempo);
              onTempoChange(initialTempo);
            }
          }
        }
      } catch (renderError: any) {
        console.error('Error rendering ABC notation:', renderError);
        setError(renderError.message || 'An unknown error occurred during rendering.');
        setIsLoading(false);
        return;
      }

      if (abcjs.synth.supportsAudio()) {
        if (!synthControl.current) {
          synthControl.current = new (abcjs as any).synth.SynthController();
        }

        const cursorControl = {
          onStart: () => {
            setupScrollingCursor();
            setIsPlaying(true);
          },
          onFinished: () => {
            onNoteEvent?.(null);
            setIsPlaying(false);
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
              const height = ev.height ?? 20;
              cursor.setAttribute('x1', String(left));
              cursor.setAttribute('x2', String(left));
              cursor.setAttribute('y1', String(top));
              cursor.setAttribute('y2', String(top + height));
              scrollToCursor(ev.left, ev.top, ev.height);
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
        midiBufferRef.current = midiBuffer;

        midiBuffer
          .init({ visualObj: visualObj.current![0] })
          .then(() => {
            if (synthControl.current && visualObj.current) {
              return synthControl.current.setTune(visualObj.current[0], false, { qpm: currentTempo });
            }
          })
          .then(() => {
            setIsLoading(false);
            console.log('Audio successfully loaded.');
          })
          .catch((err: any) => {
            console.warn('Audio initialization failed:', err);
            setError(err.message || 'Audio initialization failed. Could not prepare the audio synthesizer.');
            setIsLoading(false);
          });
      } else {
        setError('Audio is not supported in this browser.');
        setIsLoading(false);
      }
    }, [abcNotation, initialTempo, onTempoChange, onNoteEvent, tempo]);

    // Updated togglePlay: resumes abcjs context on tap
    const togglePlay = async () => {
      try {
        if (!audioContextResumed.current) {
          await resumeAudioContext();
        }

        if (!synthControl.current) {
          console.error('Synth controller not initialized');
          return;
        }

        if (!isPlaying && sheetMusicContainerRef.current) {
          sheetMusicContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const playButton = document.querySelector('#audio .abcjs-midi-start') as HTMLButtonElement;
        if (playButton) {
          playButton.click();
        }
      } catch (err) {
        console.error('Error toggling playback:', err);
        setError('Playback error: ' + (err as Error).message);
      }
    };

    // Pre-warm context on first tap/click
    useEffect(() => {
      const handleFirstInteraction = () => {
        if (!audioContextResumed.current) {
          resumeAudioContext().then(success => {
            if (success) {
              console.log('Audio context pre-warmed on interaction');
            }
          });
        }
      };
      document.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
      document.addEventListener('click', handleFirstInteraction, { once: true });
      return () => {
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('click', handleFirstInteraction);
      };
    }, []);

    if (error && !error.includes('Audio initialization failed')) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Rendering Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        {error && error.includes('Audio initialization failed') && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Audio Unavailable</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isLoading && (
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing audio...
          </div>
        )}

        {/* Custom Play/Stop Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="px-4 py-2 rounded-lg bg-primary text-white flex items-center gap-2 shadow-md hover:bg-primary/90 transition-colors"
            type="button"
            aria-label={isPlaying ? 'Stop playback' : 'Start playback'}
          >
            {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div id="audio" className="flex-grow" />
        </div>

        <div
          ref={sheetMusicContainerRef}
          className="p-4 border rounded-lg bg-card overflow-auto shadow-inner max-h-[600px]"
        >
          <div ref={sheetMusicRef} />
        </div>

        <style jsx global>{`
          .abcjs-highlight {
            fill: hsl(var(--primary));
          }
          .abcjs-cursor {
            stroke: hsl(var(--primary));
            stroke-width: 3px;
            stroke-opacity: 0.8;
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
          #audio .abcjs-midi-start {
            display: none !important;
          }
        `}</style>
      </div>
    );
  }
);

InteractiveSheetMusic.displayName = 'InteractiveSheetMusic';
