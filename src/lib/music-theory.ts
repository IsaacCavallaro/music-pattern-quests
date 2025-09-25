
export type Progression = {
    notes: string[];
    time: number;
    duration: number;
};

type SongExample = {
    song: string;
    artist: string;
    key: string;
    tempo: number;
    durationMultiplier?: number;
};

type HarmonyPattern = {
    name: string;
    numerals: string[];
    examples: SongExample[];
};

export const harmonyPatterns: HarmonyPattern[] = [
    {
        name: 'I-V-vi-IV Progression',
        numerals: ['I', 'V', 'vi', 'IV'],
        examples: [
            { song: "Let It Be", artist: "The Beatles", key: "C", tempo: 72 },
            { song: "Don't Stop Believin'", artist: "Journey", key: "E", tempo: 119 },
            { song: "Someone Like You", artist: "Adele", key: "A", tempo: 67, durationMultiplier: 2 },
            { song: "Africa", artist: "Toto", key: "A", tempo: 93, durationMultiplier: 2 },
            { song: "She Will Be Loved", artist: "Maroon 5", key: "B", tempo: 102, durationMultiplier: 2 },
            { song: "With or Without You", artist: "U2", key: "D", tempo: 110 },
            { song: "Apologize", artist: "OneRepublic", key: "Eb", tempo: 118 },
        ],
    },
    {
        name: 'I-IV-V-I Progression',
        numerals: ['I', 'IV', 'V', 'I'],
        examples: [
            { song: "La Bamba", artist: "Ritchie Valens", key: "C", tempo: 150 },
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

export const availableKeys = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'Em', 'F#m', 'Fm'];

const getNoteName = (index: number): string => {
    return noteOrder[index % 12];
}

const getNoteOctave = (noteIndex: number, rootNoteIndex: number, baseOctave: number): number => {
    if ((rootNoteIndex % 12) > (noteIndex % 12)) {
        return baseOctave + 1;
    }
    return baseOctave;
}

const getNoteFromParts = (name: string, octave: number): string => `${name}${octave}`;

const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
const naturalMinorScaleIntervals = [0, 2, 3, 5, 7, 8, 10];

const chordTypes = {
    'I': { quality: 'major', intervals: [0, 4, 7] },
    'ii': { quality: 'minor', intervals: [0, 3, 7] },
    'iii': { quality: 'minor', intervals: [0, 3, 7] },
    'IV': { quality: 'major', intervals: [0, 4, 7] },
    'V': { quality: 'major', intervals: [0, 4, 7] },
    'vi': { quality: 'minor', intervals: [0, 3, 7] },
    'vii°': { quality: 'diminished', intervals: [0, 3, 6] },
    'i': { quality: 'minor', intervals: [0, 3, 7] },
    'ii°': { quality: 'diminished', intervals: [0, 3, 6] },
    'III': { quality: 'major', intervals: [0, 4, 7] },
    'iv': { quality: 'minor', intervals: [0, 3, 7] },
    'v': { quality: 'minor', intervals: [0, 3, 7] },
    'VI': { quality: 'major', intervals: [0, 4, 7] },
    'VII': { quality: 'major', intervals: [0, 4, 7] },
};

function buildChord(rootNoteIndex: number, quality: 'major' | 'minor' | 'diminished', baseOctave: number): string[] {
    let chordDefinitionIntervals: number[];

    switch (quality) {
        case 'major':
            chordDefinitionIntervals = chordTypes['I'].intervals;
            break;
        case 'minor':
            chordDefinitionIntervals = chordTypes['i'].intervals;
            break;
        case 'diminished':
            chordDefinitionIntervals = chordTypes['vii°'].intervals;
            break;
        default:
            return [];
    }

    return chordDefinitionIntervals.map(interval => {
        const noteIndex = rootNoteIndex + interval;
        const noteOctave = baseOctave + Math.floor((rootNoteIndex % 12 + interval) / 12);
        return getNoteFromParts(getNoteName(noteIndex), noteOctave);
    });
}

const romanNumeralToIndex: { [key: string]: number } = {
    'i': 0, 'ii': 1, 'iii': 2, 'iv': 3, 'v': 4, 'vi': 5, 'vii': 6,
    'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
};


export function generateProgressionInKey(
    numerals: string[],
    key: string,
    durationMultiplier: number = 1,
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
    const baseOctave = 4;

    const progression: Progression[] = [];
    let time = 0;
    const baseDuration = 1.9;

    for (const numeral of numerals) {
        const isMinorChordInMajorKey = !isMinorKey && (numeral === 'ii' || numeral === 'iii' || numeral === 'vi');
        const isMajorChordInMinorKey = isMinorKey && (numeral === 'III' || numeral === 'VI' || numeral === 'VII');

        let quality: 'major' | 'minor' | 'diminished' = 'major';
        if (numeral.endsWith('°')) {
            quality = 'diminished';
        } else if (numeral === numeral.toLowerCase()) {
            quality = 'minor';
        }

        const scaleDegreeIndex = romanNumeralToIndex[numeral.replace('°', '').toLowerCase()];
        if (scaleDegreeIndex === undefined) continue;

        const rootNoteScaleInterval = scaleIntervals[scaleDegreeIndex];
        const rootNoteIndex = keyRootIndex + rootNoteScaleInterval;

        const chordNotes = buildChord(rootNoteIndex, quality, baseOctave);
        const duration = baseDuration * durationMultiplier;

        progression.push({
            notes: chordNotes,
            time: time,
            duration: duration,
        });

        time += 2 * durationMultiplier;
    }

    return progression;
}
