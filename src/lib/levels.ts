
export interface DrumLevel {
  level: number;
  title: string;
  description: string;
  instructions: string;
  review: string;
  notation: string; // The correct, reference notation
  hint?: string;
  answer?: string;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  levels: DrumLevel[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  quests: Quest[];
}

export const categories: Category[] = [
  {
    id: 'rhythm',
    title: 'rhythm',
    description: 'learn the fundamentals of rhythmic drumming and notation.',
    quests: [
      {
        id: 1,
        title: 'quest 1: rhythmic foundations',
        description: 'master the fundamental beats that form the backbone of modern music.',
        levels: [
          {
            level: 1,
            title: 'the basic rock beat',
            description: "let's combine the kick and snare to create one of the most common beats in music.",
            instructions: "welcome to your first beat. there is a lot going on in the notation below but don't worry, we will get to learning it all soon enough. let's start with the basics first. in the notation below,  we have the building blocks to a rock beat with the bass drum and the snare drum. can you tell what beats the bass drum fall on and what beats the snare drum fall on?",
            review: "so far we've looked at the snare drum and the bass drum played in a 'stomp clap' kind of fashion. if you stomp your feet and clap your hands in time with the notation & playback, you are reading the music correctly.",
            notation: `X:1
T:the basic rock beat
%%barnumbers 1
%%stretchlast 1
%%percmap F  bass-drum-1
%%percmap c  acoustic-snare
Q:1/4=100
M:4/4
L:1/8
K:C perc
V:ALL stem=down
"_1"[F]2 "_2"[c]2 "_3"[F]2 "_4"[c]2 | "_1"[F]2 "_2"[c]2 "_3"[F]2 "_4"[c]2 |`,
            hint: "look at the numbers underneath the notation.",
            answer: "the bass drum is on beats 1 and 3, and the snare drum is on beats 2 and 4."
          },
          {
            level: 2,
            title: 'adding the hi hats',
            description: "now, let's add the hi-hat to the basic rock beat you learned in level 1 to create a full groove.",
            instructions: "now let's add a steady hi-hat pattern on top of the kick and snare pattern from the previous level. can you notice anything different about the hi hat patterns from the bass drum and snare drum?",
            review: "Nice! Now we're cooking with gas! The hi-hats are like the engine that keeps the beat chugging along. They're the busy bee of the drum kit, ticking away twice as fast as the kick and snare. This is the secret sauce that turns a simple pattern into a real groove!",
            notation: `X:1
T:adding the hi hats
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap F  bass-drum-1
%%percmap c  acoustic-snare
%%percmap g  closed-hi-hat x
Q:1/4=100
M:4/4
L:1/16
K:C perc
V:ALL stem=up
"_1"[g2F2]"_+"g2"_2"[c2g2]"_+"g2 "_3"[g2F2]"_+"g2"_4"[c2g2]"_+"g2 | "_1"[g2F2]"_+"g2"_2"[c2g2]"_+"g2 "_3"[g2F2]"_+"g2"_4"[c2g2]"_+"g2 |`,
            hint: "count how many times each drum part is played in each measure.",
            answer: "the hi-hat is played twice as often as the kick and snare. and yes, it is meant to be an 'x' as that is how we can quickly tell it is a cymbal and not a drum in drum notation"
          },
          {
            level: 3,
            title: 'speed it up',
            description: "the exact same beat can feel totally different when you change the tempo. let's see what happens when we speed up the beat from level 2.",
            instructions: "this is the same beat you learned in the previous level. however, we've increased the tempo from 100 bpm to 117 bpm. listen closely. does it sound familiar? this is the same beat as the opening to a popular song. can you figure it out?",
            review: "Whoa, feel that energy shift? A little speed turns our practice beat into a dance floor classic! It's amazing how tempo is like a mood dial for music. You just learned the heartbeat of one of the biggest pop songs ever. Now you can't unhear it, can you?",
            notation: `X:1
T:classic rock anthem
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap F  bass-drum-1
%%percmap c  acoustic-snare
%%percmap g  closed-hi-hat x
Q:1/4=117
M:4/4
L:1/16
K:C perc
V:ALL stem=up
"_1"[g2F2]"_+"g2"_2"[c2g2]"_+"g2 "_3"[g2F2]"_+"g2"_4"[c2g2]"_+"g2 | "_1"[g2F2]"_+"g2"_2"[c2g2]"_+"g2 "_3"[g2F2]"_+"g2"_4"[c2g2]"_+"g2 |`,
            hint: "this artist was known as the 'king of pop'.",
            answer: "michael jackson's 'billie jean'!"
          },
          {
            level: 4,
            title: 'slow it down',
            description: "now let's slow it down. the same beat can create a heavy, powerful rock feel at a lower tempo.",
            instructions: "this is the same beat from the previous levels, but now we've dropped the tempo to 93 bpm. notice how this gives it a heavy, driving feel. can you guess the song?",
            review: "Boom. Now that's a different kind of power. Slowing it down makes every hit feel like a heavyweight champion landing a punch. This tempo turns our groovy pattern into a head-banging rock anthem. Pure, unstoppable swagger!",
            notation: `X:1
T:classic rock anthem
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap F  bass-drum-1
%%percmap c  acoustic-snare
%%percmap g  closed-hi-hat x
Q:1/4=93
M:4/4
L:1/16
K:C perc
V:ALL stem=up
"_1"[g2F2]"_+"g2"_2"[c2g2]"_+"g2 "_3"[g2F2]"_+"g2"_4"[c2g2]"_+"g2 | "_1"[g2F2]"_+"g2"_2"[c2g2]"_+"g2 "_3"[g2F2]"_+"g2"_4"[c2g2]"_+"g2 |`,
            hint: "this band's name is also a term for two types of electrical current.",
            answer: "ac/dc's 'back in black'!"
          },
          {
            level: 5,
            title: 'we will rock you',
            description: "learn the iconic, simple, and powerful beat from queen's legendary anthem.",
            instructions: "this beat is one of the most recognizable in rock history. it's a simple but powerful pattern of two bass drum hits followed by a snare hit, creating the famous 'stomp-stomp-clap' feel. notice that this notation only uses the bass drum ('f') and the snare drum ('c'). the rests are just as important as the notes!",
            review: "STOMP. STOMP. CLAP! You've just unlocked one of the most powerful beats in rock history. The genius is in the space - the silence between the hits is what makes it so massive. Now you're ready to rock any stadium in the world!",
            notation: `X:1
T:we will rock you
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap F  bass-drum-1
%%percmap c  acoustic-snare
Q:1/4=82
M:4/4
L:1/16
K:C perc
V:ALL stem=up
"_1"[F2]"_+"[F2] "_2"[c4] "_3"[F2]"_+"[F2] "_4"[c4] | "_1"[F2]"_+"[F2] "_2"[c4] "_3"[F2]"_+"[F2] "_4"[c4]`,
          },
          {
            level: 6,
            title: 'blinding lights',
            description: "learn the driving, retro beat from the weeknd's 'blinding lights.'",
            instructions: "see if you can notice any new patterns in the notation?",
            hint: "look at what is at the end of the notation and near the beginning.",
            answer: "we introduced repeats to the notation. notice at the end of the notation we have :| and near the beginning we have |: this means we will repeat the pattern between |: and :|",
            review: "Welcome to the 80s! This driving beat shows how a simple pattern can create an entire vibe. And look at you, reading repeat signs like a pro! This is how we keep the party going all night long without writing a million measures.",
            notation: `X:1
T:blinding lights
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap F  bass-drum-1
%%percmap c  acoustic-snare
Q:1/4=171
M:4/4
L:1/16
K:C perc
V:ALL stem=up
|:"_1"F4 "_2"[c4] "_3"F4 "_4"c4 | "_1"F4 "_2"[c4] "_3"[F2]"_+"[F2] "_4"[c4] :|`,
          },
        ],
      },
    ],
  },
  {
    id: 'melody',
    title: 'melody',
    description: 'explore the world of melodic patterns and songwriting.',
    quests: [
      {
        id: 1,
        title: 'quest 1: melody foundations',
        description: 'learn the building blocks of melodies and how to create your own tunes.',
        levels: [
          {
            level: 1,
            title: 'a classic melody',
            description: "learn the iconic melody of a classic children's song.",
            instructions: "welcome to your first melody. there is a lot to cover when lookinng at the notation but we will get to all of that in due time. for now, can you figure out what song this is?",
            review: "",
            notation: `X:3
T:a classic melody
M:4/4
L:1/4
Q:1/4=120
K:C
"_C"C "_C"C "_G"G "_G"G | "_A"A "_A"A "_G"G2 | "_F"F "_F"F "_E"E "_E"E | "_D"D "_D"D "_C"C2 |
"_G"G "_G"G "_F"F "_F"F | "_E"E "_E"E "_D"D2 | "_G"G "_G"G "_F"F "_F"F | "_E"E "_E"E "_D"D2 |
"_C"C "_C"C "_G"G "_G"G | "_A"A "_A"A "_G"G2 | "_F"F "_F"F "_E"E "_E"E | "_D"D "_D"D "_C"C2 |`,
            hint: "this song is about a celestial body.",
            answer: "twinkle, twinkle, little star"
          },
          {
            level: 2,
            title: 'scale degrees',
            description: "learn to see melodies in terms of numbers (scale degrees).",
            instructions: `the scale degrees relative to c major are:

c = 1 (tonic)
d = 2 (supertonic)
e = 3 (mediant)
f = 4 (subdominant)
g = 5 (dominant)
a = 6 (submediant)

this numbering system shows each note's position within the c major scale, which is particularly useful for understanding the harmonic structure and for transposing to other keys.`,
            review: "",
            notation: `X:3
T:twinkle, twinkle, little star
M:4/4
L:1/4
Q:1/4=120
K:C
"_1"C "_1"C "_5"G "_5"G | "_6"A "_6"A "_5"G2 | "_4"F "_4"F "_3"E "_3"E | "_2"D "_2"D "_1"C2 |
"_5"G "_5"G "_4"F "_4"F | "_3"E "_3"E "_2"D2 | "_5"G "_5"G "_4"F "_4"F | "_3"E "_3"E "_2"D2 |
"_1"C "_1"C "_5"G "_5"G | "_6"A "_6"A "_5"G2 | "_4"F "_4"F "_3"E "_3"E | "_2"D "_2"D "_1"C2 |`
          }
        ],
      }
    ],
  },
  {
    id: 'harmony',
    title: 'harmony',
    description: 'understand how chords and progressions create musical depth.',
    quests: [
      {
        id: 1,
        title: 'quest 1: harmony foundations',
        description: 'learn the fundamentals of how chords work together to create harmony.',
        levels: [
          {
            level: 1,
            title: 'A simple progressiion (i-iv-v-i) - root position',
            description: 'learn the most common and important chord progression in all of western music.',
            instructions: "this is the i-iv-v-i (one-four-five-one) progression in the key of c major. there is a lot going on in there but we will go through it step by step in each level. in the notation we have 4 chords (in this case they are triads). the first chord is 'C Major' and is made up of 3 notes (c,e,g). The second chord is 'F major' and it is made up of 3 notes  (f,a,c). Can you figure out the notes from the next 2 chords?",
            review: "",
            notation: `X:4
T:the first progression (i-iv-v-i) - root position
M:4/4
L:1/4
K:C
V:1
"_C Major" [CEG]4 | "_F Major" [FAc]4 | "_G Major" [GBd]4 | "_C Major" [CEG]4 |`,
            hint: "in music we use these notes in the alphabet - a,b,c,d,e,f,g. there are some other cool things we can do with those notes but for now just remeber, there is no h, i, j etc. also, pay attention to the lines and spaces on the notation and see if you can see a pattern",
            answer: "the third chord is g major (g, b, d) and the fourth chord is c major (c, e, g)."
          },
          {
            level: 2,
            title: 'A simple progressiion (i-iv-v-i) - 1st inversion',
            description: 'learn the i-iv-v-i progression with chords in their first inversion.',
            instructions: "this is the same i-iv-v-i progression, but now the chords are in '1st inversion'. we are using the exact same notes but we have done something different to one of them. can you tell what has changed in the notation?",
            review: "",
            notation: `X:4
T:the first progression (i-iv-v-i) - 1st inversion
M:4/4
L:1/4
K:C
V:1
"_e g c" [EGc]4 | "_a c f" [Acf]4 | "_b d g" [Bdg]4 | "_e g c" [EGc]4 |`,
            hint: "look at the order of the notes in each chord.",
            answer: "we have shifted the first note from each chord to be the last note. for example, the c major chord (c-e-g) is now e-g-c. this is called a '1st inversion'."
          },
          {
            level: 3,
            title: 'A simple progressiion (i-iv-v-i) - 2nd inversion',
            description: 'learn the i-iv-v-i progression with chords in their second inversion.',
            instructions: "this is the same i-iv-v-i progression, but now the chords are in '2nd inversion'. this means the fifth of the chord is now the lowest note. this type of inversion can create a powerful, open sound and is often used to create a different kind of harmonic movement.",
            review: "",
            notation: `X:4
T:the first progression (i-iv-v-i) - 2nd inversion
M:4/4
L:1/4
K:C
V:1
"_g c e" [Gce]4 | "_c f a" [cfa]4 | "_d g b" [dgb]4 | "_g c e" [Gce]4 |`
          }
        ],
      }
    ],
  },
];






