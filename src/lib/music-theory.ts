
export type Progression = {
    notes: string[];
    time: number;
    duration: number;
};

type SongExample = {
    song: string;
    artist: string;
    key: string;
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
            { song: "Let It Be", artist: "The Beatles", key: "C" },
            { song: "Don't Stop Believin'", artist: "Journey", key: "E" },
            { song: "Someone Like You", artist: "Adele", key: "A" },
            { song: "Africa", artist: "Toto", key: "A" },
            { song: "She Will Be Loved", artist: "Maroon 5", key: "C#m" },
            { song: "With or Without You", artist: "U2", key: "D" },
            { song: "Apologize", artist: "OneRepublic", key: "Eb" },
        ],
    },
    {
        name: 'I-IV-V-I Progression',
        numerals: ['I', 'IV', 'V', 'I'],
        examples: [
            { song: "La Bamba", artist: "Ritchie Valens", key: "C" },
            { song: "Twist and Shout", artist: "The Beatles", key: "D" },
            { song: "Wild Thing", artist: "The Troggs", key: "A" },
            { song: "Good Riddance (Time of Your Life)", artist: "Green Day", key: "G" },
            { song: "Louie Louie", artist: "The Kingsmen", key: "A" },
        ],
    },
    {
        name: 'ii-V-I (Jazz Standard)',
        numerals: ['ii', 'V', 'I'],
        examples: [
            { song: "Autumn Leaves", artist: "Joseph Kosma", key: "G" },
            { song: "Honeysuckle Rose", artist: "Fats Waller", key: "F" },
            { song: "Tune Up", artist: "Miles Davis", key: "D" },
            { song: "Satin Doll", artist: "Duke Ellington", key: "C" },
        ],
    },
    {
        name: 'i-VI-III-VII (Minor Progression)',
        numerals: ['i', 'VI', 'III', 'VII'],
        examples: [
            { song: "Zombie", artist: "The Cranberries", key: "Em" },
            { song: "Numb", artist: "Linkin Park", key: "F#m" },
            { song: "Hello", artist: "Adele", key: "Fm" },
        ],
    }
];

const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const availableKeys = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B'];

const getNoteName = (index: number): string => {
    return noteOrder[index % 12];
}

const getNoteOctave = (noteIndex: number, baseOctave: number): number => {
    return baseOctave + Math.floor(noteIndex / 12);
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
    const chordDefinition = quality === 'major'
        ? chordTypes['I']
        : quality === 'minor'
            ? chordTypes['i']
            : chordTypes['vii°'];

    return chordDefinition.intervals.map(interval => {
        const noteIndex = rootNoteIndex + interval;
        const noteOctave = getNoteOctave(noteIndex, baseOctave);
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
): Progression[] {
    const quality = numerals[0] === numerals[0].toUpperCase() ? 'major' : 'minor';

    let keyRootIndex = noteOrder.indexOf(key);
    if (key.endsWith('b')) {
        const flatKeyIndex = (noteOrder.indexOf(key.slice(0, 1)) - 1 + 12) % 12;
        keyRootIndex = flatKeyIndex;
    }

    if (keyRootIndex === -1) return [];

    const scaleIntervals = quality === 'major' ? majorScaleIntervals : naturalMinorScaleIntervals;
    const baseOctave = 4;

    const progression: Progression[] = [];
    let time = 0;
    const duration = 1.9;

    for (const numeral of numerals) {
        const chordType = chordTypes[numeral as keyof typeof chordTypes];
        if (!chordType) continue;

        const scaleDegreeIndex = romanNumeralToIndex[numeral.toLowerCase()];
        if (scaleDegreeIndex === undefined) continue;

        const rootNoteScaleInterval = scaleIntervals[scaleDegreeIndex];
        const rootNoteIndex = keyRootIndex + rootNoteScaleInterval;

        const chordNotes = buildChord(rootNoteIndex, chordType.quality, baseOctave);

        progression.push({
            notes: chordNotes,
            time: time,
            duration: duration,
        });

        time += 2;
    }

    return progression;
}


