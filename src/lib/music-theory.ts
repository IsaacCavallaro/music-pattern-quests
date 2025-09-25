
export type Progression = {
    notes: string[];
    time: number;
    duration: number;
};

export type SongExample = {
    song: string;
    artist: string;
    key: string;
    tempo: number;
    durationMultiplier?: number;
    rhythm?: number[][];
};

export const harmonyPatterns: {
    name: string;
    numerals: string[];
    examples: SongExample[];
}[] = [
        {
            name: 'I-V-vi-IV Progression',
            numerals: ['I', 'V', 'vi', 'IV'],
            examples: [
                { song: "Let It Be", artist: "The Beatles", key: "C", tempo: 72, rhythm: [[2], [2], [2], [2]] },
                { song: "Don't Stop Believin'", artist: "Journey", key: "E", tempo: 119, rhythm: [[0.5, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5]] },
                { song: "Someone Like You", artist: "Adele", key: "A", tempo: 67, rhythm: [[2], [2], [2], [2]] },
                { song: "Africa", artist: "Toto", key: "A", tempo: 93, rhythm: [[4], [4], [4], [4]] },
                { song: "She Will Be Loved", artist: "Maroon 5", key: "B", tempo: 102, durationMultiplier: 4 },
                { song: "With or Without You", artist: "U2", key: "D", tempo: 110 },
                { song: "Apologize", artist: "OneRepublic", key: "Eb", tempo: 118 },
            ],
        },
        {
            name: 'I-IV-V-I Progression',
            numerals: ['I', 'IV', 'V', 'I'],
            examples: [
                {
                    song: "La Bamba",
                    artist: "Ritchie Valens",
                    key: "C",
                    tempo: 150,
                    rhythm: [[1, 1], [1, 1], [2], [0]]
                },
                { song: "Twist and Shout", artist: "The Beatles", key: "D", tempo: 126 },
                { song: "Wild Thing", artist: "The Troggs", key: "A", tempo: 108, durationMultiplier: 2 },
                { song: "Good Riddance (Time of Your Life)", artist: "Green Day", key: "G", tempo: 90 },
                { song: "Louie Louie", artist: "The Kingsmen", key: "A", tempo: 120 },
            ],
        },
        {
            name: 'ii-V-I (Jazz Standard)',
            numerals: ['ii', 'V', 'I'],
            examples: [
                { song: "Autumn Leaves", artist: "Joseph Kosma", key: "G", tempo: 110 },
                { song: "Honeysuckle Rose", artist: "Fats Waller", key: "F", tempo: 130 },
                { song: "Tune Up", artist: "Miles Davis", key: "D", tempo: 160 },
                { song: "Satin Doll", artist: "Duke Ellington", key: "C", tempo: 120 },
            ],
        },
        {
            name: 'i-VI-III-VII (Minor Progression)',
            numerals: ['i', 'VI', 'III', 'VII'],
            examples: [
                { song: "Zombie", artist: "The Cranberries", key: "Em", tempo: 86 },
                { song: "Numb", artist: "Linkin Park", key: "F#m", tempo: 110 },
                { song: "Hello", artist: "Adele", key: "Fm", tempo: 79 },
            ],
        }
    ];

const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
const naturalMinorScaleIntervals = [0, 2, 3, 5, 7, 8, 10];


export const availableKeys = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'Em', 'F#m', 'Fm'];

const getNoteName = (index: number): string => {
    return noteOrder[index % 12];
}

const getNoteOctave = (noteIndex: number, rootNoteIndex: number, baseOctave: number): number => {
    return baseOctave + Math.floor(noteIndex / 12);
};


const getNoteFromParts = (name: string, octave: number): string => `${name}${octave}`;

const chordTypes = {
    'major': { intervals: [0, 4, 7], qualities: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'] },
    'minor': { intervals: [0, 3, 7], qualities: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'] },
    'diminished': { intervals: [0, 3, 6], qualities: [] },
};

function getQualityForDegree(scaleDegreeIndex: number, isMinorKey: boolean): 'major' | 'minor' | 'diminished' {
    const qualities = isMinorKey ? chordTypes.minor.qualities : chordTypes.major.qualities;
    return qualities[scaleDegreeIndex] as 'major' | 'minor' | 'diminished';
}

function buildChord(rootNoteIndex: number, quality: 'major' | 'minor' | 'diminished', baseOctave: number): string[] {
    const chordDefinitionIntervals = chordTypes[quality].intervals;

    return chordDefinitionIntervals.map(interval => {
        const noteIndex = rootNoteIndex + interval;
        const noteName = getNoteName(noteIndex);
        const octave = getNoteOctave(noteIndex, rootNoteIndex, baseOctave);
        return getNoteFromParts(noteName, octave);
    });
}

const romanNumeralToIndex: { [key: string]: number } = {
    'i': 0, 'ii': 1, 'iii': 2, 'iv': 3, 'v': 4, 'vi': 5, 'vii': 6,
    'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
};


export function generateProgressionInKey(
    numerals: string[],
    key: string,
    example?: Omit<SongExample, 'song' | 'artist'> & { song?: string }
): Progression[] {
    const isMinorKey = key.endsWith('m') || ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m'].includes(key);
    let rootKey = isMinorKey ? key.slice(0, -1) : key;

    let keyRootIndex = noteOrder.indexOf(rootKey.replace('b', '').replace('#', ''));
    if (rootKey.endsWith('b')) {
        keyRootIndex = (keyRootIndex - 1 + 12) % 12;
    } else if (rootKey.endsWith('#')) {
        keyRootIndex = (keyRootIndex + 1) % 12;
    }

    if (keyRootIndex === -1) return [];

    const scaleIntervals = isMinorKey ? naturalMinorScaleIntervals : majorScaleIntervals;
    const defaultBaseOctave = 4;

    const progression: Progression[] = [];
    let currentTime = 0;
    const quarterNoteDuration = 60 / (example?.tempo || 120);

    for (let i = 0; i < numerals.length; i++) {
        const numeral = numerals[i];

        const scaleDegreeIndex = romanNumeralToIndex[numeral.replace('°', '').toLowerCase()];
        if (scaleDegreeIndex === undefined) continue;

        const quality = getQualityForDegree(scaleDegreeIndex, isMinorKey);
        const rootNoteScaleInterval = scaleIntervals[scaleDegreeIndex];
        let rootNoteIndex = keyRootIndex + rootNoteScaleInterval;

        let baseOctave = defaultBaseOctave;
        const currentNumeral = numeral.toLowerCase();
        if (example?.song === 'Someone Like You' && key === 'A' && (currentNumeral === 'vi' || currentNumeral === 'v' || currentNumeral === 'iv')) {
            baseOctave = 3;
        }

        const chordNotes = buildChord(rootNoteIndex, quality, baseOctave);

        const beatsPerChord = 4;
        const chordRhythm = example?.rhythm?.[i] || [beatsPerChord];
        const sumRhythm = chordRhythm.reduce((a, b) => a + b, 0);

        const durationScalar = sumRhythm > 0 ? beatsPerChord / sumRhythm : 1;

        chordRhythm.forEach((beatDur) => {
            const eventDuration = beatDur * quarterNoteDuration * (example?.durationMultiplier || 1);
            if (eventDuration > 0) {
                progression.push({
                    notes: chordNotes,
                    time: currentTime,
                    duration: eventDuration - 0.01, // small gap
                });
            }
            currentTime += eventDuration;
        });
    }

    return progression;
}
