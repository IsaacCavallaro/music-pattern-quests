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
    const visualObj = useRef<abcjs.TuneObject[] | null>(null);
    const synthControl = useRef<any>(null);

    const [tempo, setTempo] = useState(initialTempo);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

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
            if (!isNaN(parsed)) currentTempo = parsed;
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

      if (abcjs.synth.supportsAudio()) {
        if (!synthControl.current) {
          synthControl.current = new (abcjs as any).synth.SynthController();
        }

        const cursorControl = {
          onStart: () => { },
          onFinished: () => {
            onNoteEvent?.(null);
            setIsPlaying(false);
          },
          onBeat: () => { },
          onEvent: (ev: abcjs.NoteTimingEvent) => onNoteEvent?.(ev),
        };

        synthControl.current.load('#audio', cursorControl, {
          displayLoop: true,
          displayRestart: true,
          displayPlay: true,   // still render the abcjs button (we’ll hide it with CSS)
          displayProgress: true,
          displayWarp: false,
        });

        const midiBuffer = new (abcjs as any).synth.CreateSynth();

        midiBuffer
          .init({ visualObj: visualObj.current![0], options: { audioPath: `${basePath}/` } })
          .then(() => {
            if (synthControl.current && visualObj.current) {
              return synthControl.current.setTune(visualObj.current[0], false, { qpm: currentTempo });
            }
          })
          .then(() => setIsLoading(false))
          .catch((err: any) => {
            console.error('Audio init failed:', err);
            setError('Audio initialization failed. Music notation will display but audio playback is unavailable.');
            setIsLoading(false);
          });
      } else {
        setError('Audio is not supported in this browser.');
        setIsLoading(false);
      }
    }, [abcNotation]);

    // 🔑 Custom Play/Stop button handler
    const togglePlay = async () => {
      try {
        // Ensure audio context is unlocked on mobile
        if ((abcjs.synth as any).AudioContextManager) {
          await (abcjs.synth as any).AudioContextManager.resumeAudioContext();
        }

        // Find abcjs’s hidden play button
        const playBtn = document.querySelector<HTMLButtonElement>('#audio .abcjs-midi-start');
        if (!playBtn) return;

        playBtn.click();
        setIsPlaying((prev) => !prev);
      } catch (err) {
        console.error('Error toggling playback:', err);
      }
    };

    if (error && !error.includes('Audio initialization failed. Music notation will display')) {
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
        {error && error.includes('Audio initialization failed. Music notation will display') && (
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

        {/* 🔑 Custom Play/Stop Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="px-4 py-2 rounded-lg bg-primary text-white flex items-center gap-2 shadow-md"
          >
            {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div id="audio" className="flex-grow" />
        </div>
        <div className="p-4 border rounded-lg bg-card overflow-x-auto shadow-inner">
          <div ref={sheetMusicRef} />
        </div>

        <style jsx global>{`
          .abcjs-highlight { fill: hsl(var(--primary)); }
          .abcjs-cursor { stroke: hsl(var(--primary)); stroke-width: 2px; stroke-opacity: 0.7; fill: none; }
          #audio { margin-top: 1rem; padding: 1rem; border: 1px solid hsl(var(--border)); border-radius: var(--radius); }
          #audio .abcjs-midi-loop { display: none; }
          #audio .abcjs-midi-start { display: none !important; } /* Hide abcjs play button */
        `}</style>
      </div>
    );
  }
);

InteractiveSheetMusic.displayName = 'InteractiveSheetMusic';
