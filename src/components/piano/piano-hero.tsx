'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Play, StopCircle } from 'lucide-react';

const notesMap = [
    { name: 'C4', freq: 261.63, isSharp: false, degree: 1 },
    { name: 'C#4', freq: 277.18, isSharp: true, degree: 1 },
    { name: 'D4', freq: 293.66, isSharp: false, degree: 2 },
    { name: 'D#4', freq: 311.13, isSharp: true, degree: 2 },
    { name: 'E4', freq: 329.63, isSharp: false, degree: 3 },
    { name: 'F4', freq: 349.23, isSharp: false, degree: 4 },
    { name: 'F#4', freq: 369.99, isSharp: true, degree: 4 },
    { name: 'G4', freq: 392.00, isSharp: false, degree: 5 },
    { name: 'G#4', freq: 415.30, isSharp: true, degree: 5 },
    { name: 'A4', freq: 440.00, isSharp: false, degree: 6 },
    { name: 'A#4', freq: 466.16, isSharp: true, degree: 6 },
    { name: 'B4', freq: 493.88, isSharp: false, degree: 7 },
    { name: 'C5', freq: 523.25, isSharp: false, degree: 1 },
    { name: 'C#5', freq: 554.37, isSharp: true, degree: 1 },
    { name: 'D5', freq: 587.33, isSharp: false, degree: 2 },
    { name: 'D#5', freq: 622.25, isSharp: true, degree: 2 },
    { name: 'E5', freq: 659.25, isSharp: false, degree: 3 },
    { name: 'F5', freq: 698.46, isSharp: false, degree: 4 },
    { name: 'F#5', freq: 739.99, isSharp: true, degree: 4 },
    { name: 'G5', freq: 783.99, isSharp: false, degree: 5 },
    { name: 'G#5', freq: 830.61, isSharp: true, degree: 5 },
    { name: 'A5', freq: 880.00, isSharp: false, degree: 6 },
    { name: 'A#5', freq: 932.33, isSharp: true, degree: 6 },
    { name: 'B5', freq: 987.77, isSharp: false, degree: 7 },
    { name: 'C6', freq: 1046.50, isSharp: false, degree: 1 },
];

const whiteKeys = notesMap.filter(n => !n.isSharp);
const blackKeys = notesMap.filter(n => n.isSharp);

const NOTE_FALL_SPEED = 100; // pixels per second

type Progression = {
    notes: string[];
    time: number;
    duration: number;
    played?: boolean;
}

interface PianoHeroProps {
    progression: Progression[];
    displayMode?: 'notes' | 'scaleDegrees';
}

export function PianoHero({ progression, displayMode = 'notes' }: PianoHeroProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [activeKeys, setActiveKeys] = useState(new Set<string>());
    const animationFrameId = useRef<number>();
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const compressorRef = useRef<DynamicsCompressorNode | null>(null);
    const startTimeRef = useRef<number>(0);
    const pianoContainerDivRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [keyPositions, setKeyPositions] = useState<Map<string, { left: number; width: number }>>(new Map());
    const [viewportHeight, setViewportHeight] = useState(384);
    const progressionRef = useRef(progression.map(p => ({ ...p, played: false })));
    const activeOscillatorsRef = useRef<Map<string, { oscillators: OscillatorNode[]; gainNode: GainNode }>>(new Map());

    const totalDuration = useMemo(() => {
        return progression.reduce((max, note) => Math.max(max, note.time + note.duration), 0);
    }, [progression]);

    const updateKeyPositions = useCallback(() => {
        if (pianoContainerDivRef.current) {
            const containerWidth = pianoContainerDivRef.current.getBoundingClientRect().width;
            const whiteKeyWidth = containerWidth / whiteKeys.length;
            const blackKeyWidth = whiteKeyWidth * 0.6;

            const newKeyPositions = new Map();

            whiteKeys.forEach((note, index) => {
                newKeyPositions.set(note.name, { left: index * whiteKeyWidth, width: whiteKeyWidth });
            });

            blackKeys.forEach(note => {
                const prevNoteIndex = whiteKeys.findIndex(n => n.freq > note.freq) - 1;
                const prevKeyPos = newKeyPositions.get(whiteKeys[prevNoteIndex].name);
                if (prevKeyPos) {
                    newKeyPositions.set(note.name, { left: prevKeyPos.left + whiteKeyWidth - (blackKeyWidth / 2), width: blackKeyWidth });
                }
            });
            setKeyPositions(newKeyPositions);
        }

        // Update viewport height based on actual rendered size
        if (viewportRef.current) {
            const height = viewportRef.current.getBoundingClientRect().height;
            setViewportHeight(height);
        }
    }, []);

    useEffect(() => {
        // Delay initial measurement to ensure modal is fully rendered
        const timer = setTimeout(() => {
            updateKeyPositions();
        }, 100);

        const handleResize = () => {
            updateKeyPositions();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [updateKeyPositions]);

    // Also update when progression changes (modal opens/closes)
    useEffect(() => {
        const timer = setTimeout(() => {
            updateKeyPositions();
        }, 150);
        return () => clearTimeout(timer);
    }, [progression, updateKeyPositions]);

    const playChord = useCallback((noteNames: string[], duration: number) => {
        const audioContext = audioContextRef.current;
        const masterGain = masterGainRef.current;
        if (!audioContext || !masterGain) return;

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const gainPerNote = 0.02;

        noteNames.forEach(noteName => {
            const noteData = notesMap.find(n => n.name === noteName);
            if (!noteData) return;

            const existing = activeOscillatorsRef.current.get(noteName);
            if (existing) {
                try {
                    existing.gainNode.gain.cancelScheduledValues(audioContext.currentTime);
                    existing.gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.02);
                    existing.oscillators.forEach(osc => osc.stop(audioContext.currentTime + 0.03));
                } catch (e) {
                    // Ignore errors
                }
                activeOscillatorsRef.current.delete(noteName);
            }

            const noteGainNode = audioContext.createGain();
            noteGainNode.connect(masterGain);

            const harmonics = [1, 2, 3, 4, 5];
            const harmonicAmplitudes = [1, 0.5, 0.3, 0.2, 0.1];
            const oscillators: OscillatorNode[] = [];

            harmonics.forEach((harmonic, index) => {
                const osc = audioContext.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(noteData.freq * harmonic, audioContext.currentTime);
                const harmonicGain = audioContext.createGain();
                harmonicGain.gain.value = harmonicAmplitudes[index] * gainPerNote;
                osc.connect(harmonicGain);
                harmonicGain.connect(noteGainNode);
                oscillators.push(osc);
            });

            noteGainNode.gain.setValueAtTime(0, audioContext.currentTime);
            noteGainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01); // Quick attack
            noteGainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + duration * 0.5); // Decay
            noteGainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + duration); // Release

            activeOscillatorsRef.current.set(noteName, { oscillators, gainNode: noteGainNode });

            oscillators.forEach(osc => {
                osc.start(audioContext.currentTime);
                osc.stop(audioContext.currentTime + duration);
            });

            oscillators[0].onended = () => {
                activeOscillatorsRef.current.delete(noteName);
            };
        });
    }, []);

    const stopAnimation = useCallback(() => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }

        activeOscillatorsRef.current.forEach(({ oscillators, gainNode }) => {
            try {
                if (audioContextRef.current) {
                    gainNode.gain.cancelScheduledValues(audioContextRef.current.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.05);
                    oscillators.forEach(osc => osc.stop(audioContextRef.current!.currentTime + 0.06));
                }
            } catch (e) {
                // Ignore errors
            }
        });
        activeOscillatorsRef.current.clear();

        setIsPlaying(false);
        setTime(0);
        setActiveKeys(new Set());
        progressionRef.current = progression.map(p => ({ ...p, played: false }));

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.suspend();
        }
    }, [progression]);

    const animate = useCallback((timestamp: number) => {
        if (!startTimeRef.current) {
            startTimeRef.current = timestamp;
        }

        const elapsedTime = (timestamp - startTimeRef.current) / 1000;
        setTime(elapsedTime);

        if (elapsedTime >= totalDuration + (viewportHeight / NOTE_FALL_SPEED)) {
            stopAnimation();
            return;
        }

        const newActiveKeys = new Set<string>();
        progressionRef.current.forEach((chord, index) => {
            const noteHitTime = chord.time + (viewportHeight / NOTE_FALL_SPEED);

            // Play sound when note hits
            if (elapsedTime >= noteHitTime && !chord.played) {
                playChord(chord.notes, chord.duration);
                progressionRef.current[index].played = true;
            }

            // Keep key active while note is playing
            if (elapsedTime >= noteHitTime && elapsedTime < noteHitTime + chord.duration) {
                chord.notes.forEach(note => newActiveKeys.add(note));
            }
        });
        setActiveKeys(newActiveKeys);

        animationFrameId.current = requestAnimationFrame(animate);
    }, [playChord, totalDuration, stopAnimation, viewportHeight]);

    const startAnimation = () => {
        if (isPlaying) return;
        if (typeof window === 'undefined') return;

        // Ensure viewport height is current before starting animation
        updateKeyPositions();

        // Small delay to ensure measurements are complete
        setTimeout(() => {
            if (!audioContextRef.current) {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

                const compressor = audioContext.createDynamicsCompressor();
                compressor.threshold.setValueAtTime(-24, audioContext.currentTime);
                compressor.knee.setValueAtTime(30, audioContext.currentTime);
                compressor.ratio.setValueAtTime(12, audioContext.currentTime);
                compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
                compressor.release.setValueAtTime(0.25, audioContext.currentTime);

                const masterGain = audioContext.createGain();
                masterGain.gain.setValueAtTime(10, audioContext.currentTime);

                compressor.connect(masterGain);
                masterGain.connect(audioContext.destination);

                audioContextRef.current = audioContext;
                masterGainRef.current = masterGain;
                compressorRef.current = compressor;
            } else if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }

            progressionRef.current = progression.map(p => ({ ...p, played: false }));
            setIsPlaying(true);
            startTimeRef.current = 0;
            animationFrameId.current = requestAnimationFrame(animate);
        }, 50);
    };


    useEffect(() => {
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            activeOscillatorsRef.current.forEach(({ oscillators }) => {
                try {
                    oscillators.forEach(osc => osc.stop());
                } catch (e) {
                    // Ignore errors
                }
            });
            activeOscillatorsRef.current.clear();

            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        }
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center gap-2 sm:gap-4 w-full max-w-full px-2 sm:px-4">
            <div ref={viewportRef} className="relative w-full h-64 sm:h-80 md:h-96 bg-background border rounded-t-lg overflow-hidden">
                {/* Falling Notes */}
                {progression.map((chord, chordIndex) =>
                    chord.notes.map((noteName, noteIndex) => {
                        const keyPos = keyPositions.get(noteName);
                        if (!keyPos) return null;

                        const noteData = notesMap.find(n => n.name === noteName);
                        if (!noteData) return null;

                        const isSharp = noteData.isSharp;
                        const height = chord.duration * NOTE_FALL_SPEED;
                        const top = (time - chord.time) * NOTE_FALL_SPEED - height;

                        if (top > viewportHeight) return null; // Note is past the viewport

                        const colors = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-indigo-400'];

                        const content = displayMode === 'scaleDegrees' ? noteData.degree : noteData.name.slice(0, -1);

                        return (
                            <div key={`${chordIndex}-${noteIndex}`}
                                className={cn("absolute rounded flex items-center justify-center font-bold text-white text-xs sm:text-sm", isSharp ? 'z-10' : 'z-0', colors[chordIndex % colors.length])}
                                style={{
                                    left: keyPos.left,
                                    width: keyPos.width,
                                    top: top,
                                    height: height,
                                }}
                            >
                                {content}
                            </div>
                        );
                    })
                )}
            </div>
            {/* Piano */}
            <div ref={pianoContainerDivRef} className="relative flex h-20 sm:h-24 md:h-32 w-full select-none rounded-b-lg border-t-0 border bg-background shadow-inner">
                {whiteKeys.map((note) => (
                    <div
                        key={note.name}
                        className={cn(
                            "flex h-full flex-1 flex-col justify-end rounded-b-md border border-muted-foreground bg-card p-1 sm:p-2 text-foreground transition-colors duration-100",
                            activeKeys.has(note.name) && "bg-red-500/50 border-red-600"
                        )}
                        style={{ width: `${100 / whiteKeys.length}%` }}
                    >
                        <span className="pointer-events-none text-xs sm:text-sm">
                            {displayMode === 'notes' && note.name.slice(0, -1)}
                        </span>
                    </div>
                ))}
                <div className="absolute top-0 left-0 right-0 flex h-2/3 w-full pointer-events-none">
                    {blackKeys.map((note) => {
                        const keyPos = keyPositions.get(note.name);
                        if (!keyPos) return null;
                        return (
                            <div
                                key={note.name}
                                className={cn(
                                    "absolute z-10 h-full rounded-b-md border border-muted-foreground bg-foreground transition-colors duration-100",
                                    activeKeys.has(note.name) && "bg-red-500 border-red-600"
                                )}
                                style={{ left: keyPos.left, width: keyPos.width }}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-2 sm:gap-4">
                <Button onClick={startAnimation} disabled={isPlaying} className="text-sm sm:text-base px-3 sm:px-4">
                    <Play className="mr-1 sm:mr-2 h-4 w-4" />
                    start
                </Button>
                <Button onClick={stopAnimation} disabled={!isPlaying} variant="destructive" className="text-sm sm:text-base px-3 sm:px-4">
                    <StopCircle className="mr-1 sm:mr-2 h-4 w-4" />
                    stop
                </Button>
            </div>
        </div>
    );
}