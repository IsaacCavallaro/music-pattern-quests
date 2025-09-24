export interface ExampleBeat {
    name: string;
    notation: string;
}

export const defaultNotation = `X:1
T: Simple Funk
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap D  pedal-hi-hat x
%%percmap F  bass-drum-1
%%percmap E  acoustic-bass-drum
%%percmap G  low-floor-tom
%%percmap A  high-floor-tom
%%percmap B  low-tom
%%percmap ^B tambourine   triangle
%%percmap c  acoustic-snare
%%percmap _c electric-snare
%%percmap ^c low-wood-block   triangle
%%percmap =c side-stick x
%%percmap d  low-tom
%%percmap =d  low-mid-tom harmonic
%%percmap ^d hi-wood-block    triangle
%%percmap e  hi-mid-tom
%%percmap ^e cowbell      triangle
%%percmap f  high-tom
%%percmap ^f ride-cymbal-1
%%percmap =f ride-bell harmonic
%%percmap g  closed-hi-hat x
%%percmap ^g open-hi-hat x
%%percmap a  crash-cymbal-1  x
%%percmap ^a open-triangle     triangle
Q:1/4=100
L:1/16
K:C perc
V:ALL stem=up
[g2F2]g2[c2g2]g2 [g2F2]g2[c2g2]g2`;

export const exampleBeats: ExampleBeat[] = [
    {
        name: 'simple funk',
        notation: defaultNotation,
    },
    {
        name: 'Rock Beat 1 - open hi hats',
        notation: `X:1
T: Rock Beat 1 - open hi hats
%%barnumbers 1
%%stretchlast 1
%%percmap D  pedal-hi-hat 44
%%percmap F  bass-drum-1 36
%%percmap E  acoustic-bass-drum 35
%%percmap G  low-floor-tom 41
%%percmap A  high-floor-tom 43
%%percmap B  low-tom 45
%%percmap ^B tambourine 54
%%percmap c  acoustic-snare 38
%%percmap _c electric-snare 40
%%percmap ^c low-wood-block 77
%%percmap =c side-stick 37
%%percmap d  low-tom 45
%%percmap =d  low-mid-tom 47
%%percmap ^d hi-wood-block 76
%%percmap e  hi-mid-tom 48
%%percmap ^e cowbell 56
%%percmap f  high-tom 50
%%percmap ^f ride-cymbal-1 51
%%percmap =f ride-bell 53
%%percmap g  closed-hi-hat 42
%%percmap ^g open-hi-hat 46
%%percmap a  crash-cymbal-1 49
%%percmap ^a open-triangle 81
L:1/16
Q:1/4=120
K:C perc
V:ALL stem=up
"^o"[^gF]4 "^o"[^gc]4 "^o"[^gF]4 "^o"[^gc]4  | "^o"[^gF]4 "^o"[^gc]4 "^o"[^gF]4 "^o"[^gc]4  |`
    },
    {
        name: 'simple funk (open hat ending)',
        notation: `X:1
T: Simple Funk (open hat ending)
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap D  pedal-hi-hat x
%%percmap F  bass-drum-1
%%percmap E  acoustic-bass-drum
%%percmap G  low-floor-tom
%%percmap A  high-floor-tom
%%percmap B  low-tom
%%percmap ^B tambourine   triangle
%%percmap c  acoustic-snare
%%percmap _c electric-snare
%%percmap ^c low-wood-block   triangle
%%percmap =c side-stick x
%%percmap d  low-tom
%%percmap =d  low-mid-tom harmonic
%%percmap ^d hi-wood-block    triangle
%%percmap e  hi-mid-tom
%%percmap ^e cowbell      triangle
%%percmap f  high-tom
%%percmap ^f ride-cymbal-1
%%percmap =f ride-bell harmonic
%%percmap g  closed-hi-hat x
%%percmap ^g open-hi-hat x
%%percmap a  crash-cymbal-1  x
%%percmap ^a open-triangle     triangle
Q:1/4=100
L:1/16
K:C perc
V:ALL stem=up
[g2F2]g2[c2g2]g2 [g2F2]g2[c2g2]"^o"^g2`
    },
    {
        name: '4 on the floor',
        notation: `X:1
T: 4 on the floor
%%barnumbers 1
%%stretchlast 1
%%percmap D  pedal-hi-hat x
%%percmap F  bass-drum-1
%%percmap E  acoustic-bass-drum
%%percmap G  low-floor-tom
%%percmap A  high-floor-tom
%%percmap B  low-tom
%%percmap ^B tambourine   triangle
%%percmap c  acoustic-snare
%%percmap _c electric-snare
%%percmap ^c low-wood-block   triangle
%%percmap =c side-stick x
%%percmap d  low-tom
%%percmap =d  low-mid-tom harmonic
%%percmap ^d hi-wood-block    triangle
%%percmap e  hi-mid-tom
%%percmap ^e cowbell      triangle
%%percmap f  high-tom
%%percmap ^f ride-cymbal-1
%%percmap =f ride-bell harmonic
%%percmap g  closed-hi-hat x
%%percmap ^g open-hi-hat x
%%percmap a  crash-cymbal-1  x
%%percmap ^a open-triangle     triangle
L:1/16
Q:1/4=120
K:C perc
V:ALL stem=up
[gF]4 [Fgc]4 [gF]4 [Fgc]4  | [gF]4 [Fgc]4 [gF]4 [Fgc]4  |`
    },
    {
        name: 'half-time shuffle',
        notation: `X:1
T:Half-Time Shuffle
%%barnumbers 1
%%stretchlast 1
%%percmap D  pedal-hi-hat x
%%percmap F  bass-drum-1
%%percmap E  acoustic-bass-drum
%%percmap G  low-floor-tom
%%percmap A  high-floor-tom
%%percmap B  low-tom
%%percmap ^B tambourine   triangle
%%percmap c  acoustic-snare
%%percmap _c electric-snare
%%percmap ^c low-wood-block   triangle
%%percmap =c side-stick x
%%percmap d  low-tom
%%percmap =d  low-mid-tom harmonic
%%percmap ^d hi-wood-block    triangle
%%percmap e  hi-mid-tom
%%percmap ^e cowbell      triangle
%%percmap f  high-tom
%%percmap ^f ride-cymbal-1
%%percmap =f ride-bell harmonic
%%percmap g  closed-hi-hat x
%%percmap ^g open-hi-hat x
%%percmap a  crash-cymbal-1  x
%%percmap ^a open-triangle     triangle
L:1/16
Q:1/4=120
K:C perc
V:ALL stem=up
"^swing"[gF]2g [g]2g [gc]2g [g]2g |
[gF]2g [g]2g [gc]2g [g]2g |`
    },
    {
        name: 'disco',
        notation: `X:1
T: Disco
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap D  pedal-hi-hat x
%%percmap F  bass-drum-1
%%percmap E  acoustic-bass-drum
%%percmap G  low-floor-tom
%%percmap A  high-floor-tom
%%percmap B  low-tom
%%percmap ^B tambourine   triangle
%%percmap c  acoustic-snare
%%percmap _c electric-snare
%%percmap ^c low-wood-block   triangle
%%percmap =c side-stick x
%%percmap d  low-tom
%%percmap =d  low-mid-tom harmonic
%%percmap ^d hi-wood-block    triangle
%%percmap e  hi-mid-tom
%%percmap ^e cowbell      triangle
%%percmap f  high-tom
%%percmap ^f ride-cymbal-1
%%percmap =f ride-bell harmonic
%%percmap g  closed-hi-hat x
%%percmap ^g open-hi-hat x
%%percmap a  crash-cymbal-1  x
%%percmap ^a open-triangle     triangle
Q:1/4=100
L:1/16
K:C perc
V:ALL stem=up
[g2F2]"^o"^g2[c2g2F2]"^o"^g2 [g2F2]"^o"^g2[c2g2F2]"^o"^g2`
    },
    {
        name: 'dance beat',
        notation: `X:1
T: Dance beat
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap D  pedal-hi-hat x
%%percmap F  bass-drum-1
%%percmap E  acoustic-bass-drum
%%percmap G  low-floor-tom
%%percmap A  high-floor-tom
%%percmap B  low-tom
%%percmap ^B tambourine   triangle
%%percmap c  acoustic-snare
%%percmap _c electric-snare
%%percmap ^c low-wood-block   triangle
%%percmap =c side-stick x
%%percmap d  low-tom
%%percmap =d  low-mid-tom harmonic
%%percmap ^d hi-wood-block    triangle
%%percmap e  hi-mid-tom
%%percmap ^e cowbell      triangle
%%percmap f  high-tom
%%percmap ^f ride-cymbal-1
%%percmap =f ride-bell harmonic
%%percmap g  closed-hi-hat x
%%percmap ^g open-hi-hat x
%%percmap a  crash-cymbal-1  x
%%percmap ^a open-triangle     triangle
Q:1/4=120
L:1/16
K:C perc
V:ALL stem=up
[gF2]ggg [gF2c]ggg [gF2]ggg [gF2c]ggg`
    },
    {
        name: 'hard rock',
        notation: `X:1
T: Hard Rock
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap D  pedal-hi-hat x
%%percmap F  bass-drum-1
%%percmap E  acoustic-bass-drum
%%percmap G  low-floor-tom
%%percmap A  high-floor-tom
%%percmap B  low-tom
%%percmap ^B tambourine   triangle
%%percmap c  acoustic-snare
%%percmap _c electric-snare
%%percmap ^c low-wood-block   triangle
%%percmap =c side-stick x
%%percmap d  low-tom
%%percmap =d  low-mid-tom harmonic
%%percmap ^d hi-wood-block    triangle
%%percmap e  hi-mid-tom
%%percmap ^e cowbell      triangle
%%percmap f  high-tom
%%percmap ^f ride-cymbal-1
%%percmap =f ride-bell harmonic
%%percmap g  closed-hi-hat x
%%percmap ^g open-hi-hat x
%%percmap a  crash-cymbal-1  x
%%percmap ^a open-triangle     triangle
Q:1/4=150
L:1/8
K:C perc
V:ALL stem=up
[gF2][gF2][gc][gF2] [gF2][gF2][gc][gF2] | [gF2][gF2][gc][gF2] [gF2][gF2][gc][gF2] |`
    },
    {
        name: 'groove with fill annotation',
        notation: `X:1
T: Groove with fill annotation
C: 
P: 
%%barnumbers 1
%%stretchlast 1
%%percmap D  pedal-hi-hat x
%%percmap F  bass-drum-1
%%percmap E  acoustic-bass-drum
%%percmap G  low-floor-tom
%%percmap A  high-floor-tom
%%percmap B  low-tom
%%percmap ^B tambourine   triangle
%%percmap c  acoustic-snare
%%percmap _c electric-snare
%%percmap ^c low-wood-block   triangle
%%percmap =c side-stick x
%%percmap d  low-tom
%%percmap =d  low-mid-tom harmonic
%%percmap ^d hi-wood-block    triangle
%%percmap e  hi-mid-tom
%%percmap ^e cowbell      triangle
%%percmap f  high-tom
%%percmap ^f ride-cymbal-1
%%percmap =f ride-bell harmonic
%%percmap g  closed-hi-hat x
%%percmap ^g open-hi-hat x
%%percmap a  crash-cymbal-1  x
%%percmap ^a open-triangle     triangle
Q:1/4=100
L:1/16
K:C perc
V:ALL stem=up
[g2F2]g2[c2g2]g2  | [g2F2]g2"_Fill................."[c2g2]g2 |`
    }
];