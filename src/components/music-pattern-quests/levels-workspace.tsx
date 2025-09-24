'use client';

import { useState } from 'react';
import { categories, type Quest, type DrumLevel, type Category } from '@/lib/levels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveSheetMusic, type AbcNoteEvent } from './interactive-sheet-music';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Lock, Unlock } from 'lucide-react';
import { VisualDrumset } from './visual-drumset';
import { PianoHero } from '../piano/piano-hero';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function CategoryList({
  onSelectCategory,
}: {
  onSelectCategory: (category: Category) => void;
}) {
  return (
    <div className="w-full p-4 md:p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">music pattern quests</h1>
        <p className="text-muted-foreground mt-2">
          select your category to begin your quest
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className={category.quests.length > 0 ? 'cursor-pointer hover:shadow-lg transition-shadow' : 'opacity-60 bg-muted cursor-not-allowed'}
          >
            <CardHeader>
              <CardTitle className="font-headline">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function QuestList({
  category,
  onSelectQuest,
  onBackToCategories,
}: {
  category: Category;
  onSelectQuest: (quest: Quest) => void;
  onBackToCategories: () => void;
}) {
  return (
    <div className="w-full p-4 md:p-8 space-y-8">
      <Button variant="ghost" onClick={onBackToCategories}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        back to categories
      </Button>
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">{category.title}</h1>
        <p className="text-muted-foreground mt-2">
          choose the quest you want to begin
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.quests.map((quest) => (
          <Card
            key={quest.id}
            onClick={() => onSelectQuest(quest)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="font-headline">{quest.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{quest.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LevelList({
  quest,
  onSelectLevel,
  completedLevels,
  onBackToQuests,
}: {
  quest: Quest;
  onSelectLevel: (level: DrumLevel) => void;
  completedLevels: number[];
  onBackToQuests: () => void;
}) {
  return (
    <div className="w-full p-4 md:p-8 space-y-8">
      <Button variant="ghost" onClick={onBackToQuests}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        back to quests
      </Button>
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">{quest.title}</h1>
        <p className="text-muted-foreground mt-2">
          learn to read and write drum notation using patterns
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quest.levels.map((level) => {
          const isUnlocked = level.level === 1 || completedLevels.includes(level.level - 1);
          const isCompleted = completedLevels.includes(level.level);
          return (
            <Card
              key={level.level}
              onClick={() => isUnlocked && onSelectLevel(level)}
              className={
                isUnlocked
                  ? 'cursor-pointer hover:shadow-lg transition-shadow'
                  : 'opacity-60 bg-muted cursor-not-allowed'
              }
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-headline">
                      level {level.level}: {level.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : isUnlocked ? (
                      <Unlock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const twinkleMelodyRaw = [
  { noteNames: ['C4'], duration: 500 }, { noteNames: ['C4'], duration: 500 },
  { noteNames: ['G4'], duration: 500 }, { noteNames: ['G4'], duration: 500 },
  { noteNames: ['A4'], duration: 500 }, { noteNames: ['A4'], duration: 500 },
  { noteNames: ['G4'], duration: 1000 },

  { noteNames: ['F4'], duration: 500 }, { noteNames: ['F4'], duration: 500 },
  { noteNames: ['E4'], duration: 500 }, { noteNames: ['E4'], duration: 500 },
  { noteNames: ['D4'], duration: 500 }, { noteNames: ['D4'], duration: 500 },
  { noteNames: ['C4'], duration: 1000 },

  { noteNames: ['G4'], duration: 500 }, { noteNames: ['G4'], duration: 500 },
  { noteNames: ['F4'], duration: 500 }, { noteNames: ['F4'], duration: 500 },
  { noteNames: ['E4'], duration: 500 }, { noteNames: ['E4'], duration: 500 },
  { noteNames: ['D4'], duration: 1000 },

  { noteNames: ['G4'], duration: 500 }, { noteNames: ['G4'], duration: 500 },
  { noteNames: ['F4'], duration: 500 }, { noteNames: ['F4'], duration: 500 },
  { noteNames: ['E4'], duration: 500 }, { noteNames: ['E4'], duration: 500 },
  { noteNames: ['D4'], duration: 1000 },

  { noteNames: ['C4'], duration: 500 }, { noteNames: ['C4'], duration: 500 },
  { noteNames: ['G4'], duration: 500 }, { noteNames: ['G4'], duration: 500 },
  { noteNames: ['A4'], duration: 500 }, { noteNames: ['A4'], duration: 500 },
  { noteNames: ['G4'], duration: 1000 },

  { noteNames: ['F4'], duration: 500 }, { noteNames: ['F4'], duration: 500 },
  { noteNames: ['E4'], duration: 500 }, { noteNames: ['E4'], duration: 500 },
  { noteNames: ['D4'], duration: 500 }, { noteNames: ['D4'], duration: 500 },
  { noteNames: ['C4'], duration: 1000 },
];

let accumulatedTime = 0;
const twinkleProgression = twinkleMelodyRaw.map(note => {
  const progressionNote = {
    notes: note.noteNames.filter(n => n !== null) as string[],
    time: accumulatedTime / 1000,
    duration: note.duration / 1000
  };
  accumulatedTime += note.duration;
  return progressionNote;
});

const firstProgressionRoot = [
  { notes: ['C4', 'E4', 'G4'], time: 0, duration: 1.9 },
  { notes: ['F4', 'A4', 'C5'], time: 2, duration: 1.9 },
  { notes: ['G4', 'B4', 'D5'], time: 4, duration: 1.9 },
  { notes: ['C4', 'E4', 'G4'], time: 6, duration: 1.9 },
];

const firstProgression1stInversion = [
  { notes: ['E4', 'G4', 'C5'], time: 0, duration: 1.9 },
  { notes: ['A4', 'C5', 'F5'], time: 2, duration: 1.9 },
  { notes: ['B4', 'D5', 'G5'], time: 4, duration: 1.9 },
  { notes: ['E4', 'G4', 'C5'], time: 6, duration: 1.9 },
];

const firstProgression2ndInversion = [
  { notes: ['G4', 'C5', 'E5'], time: 0, duration: 1.9 },
  { notes: ['C5', 'F5', 'A5'], time: 2, duration: 1.9 },
  { notes: ['D5', 'G5', 'B5'], time: 4, duration: 1.9 },
  { notes: ['G4', 'C5', 'E5'], time: 6, duration: 1.9 },
];


function LevelDetail({
  level,
  onCompleteLevel,
  onBackToList,
}: {
  level: DrumLevel;
  onCompleteLevel: (levelNumber: number) => void;
  onBackToList: () => void;
}) {

  const getProgressionForLevel = (title: string) => {
    switch (title) {
      case 'a classic melody':
        return twinkleProgression;
      case 'twinkle, twinkle, little star':
        return twinkleProgression;
      case 'scale degrees':
        return twinkleProgression;
      case 'the first progression (i-iv-v-i) - root position':
        return firstProgressionRoot;
      case 'the first progression (i-iv-v-i) - 1st inversion':
        return firstProgression1stInversion;
      case 'the first progression (i-iv-v-i) - 2nd inversion':
        return firstProgression2ndInversion;
      default:
        return null;
    }
  }

  const currentProgression = getProgressionForLevel(level.title);


  return (
    <div className="w-full p-4 md:p-8 space-y-8">
      <Button variant="ghost" onClick={onBackToList}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        back to levels
      </Button>
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">
          level {level.level}: {level.title}
        </h1>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{level.instructions}</p>
            <div className="flex items-center gap-4">
              {level.hint && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">hint</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>hint</AlertDialogTitle>
                      <AlertDialogDescription>
                        {level.hint}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>got it</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {level.answer && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">reveal answer</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>answer</AlertDialogTitle>
                      <AlertDialogDescription>
                        {level.answer}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>got it</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">notation &amp; playback</CardTitle>
            <CardDescription>listen to this. this is your goal.</CardDescription>
          </CardHeader>
          <CardContent>
            <InteractiveSheetMusic
              key={`notation & playback-${level.level}`}
              abcNotation={level.notation}
              initialTempo={100}
              onTempoChange={() => { }}
            />
          </CardContent>
        </Card>

        {(level.title === 'the basic rock beat' || level.title === 'adding the hi hats') && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">visual drumset</CardTitle>
              <CardDescription>watch the drums light up as the beat plays.</CardDescription>
            </CardHeader>
            <CardContent>
              <VisualDrumset beatTitle={level.title} />
            </CardContent>
          </Card>
        )}

        {currentProgression && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">piano hero</CardTitle>
              <CardDescription>watch the notes fall and play along!</CardDescription>
            </CardHeader>
            <CardContent>
              <PianoHero
                progression={currentProgression}
                displayMode={level.title === 'scale degrees' ? 'scaleDegrees' : 'notes'}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">notice the only change we made in this notation is the number   near the top left if 117 whereas in our previous level it was 100. this is how we notate the speed on the music which we refer to as 'beats per minute' or bpm. </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => onCompleteLevel(level.level)}>complete level</Button>
      </div>
    </div>
  );
}

export function LevelsWorkspace() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<DrumLevel | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const handleSelectCategory = (category: Category) => {
    if (category.quests.length > 0) {
      setSelectedCategory(category);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedQuest(null);
    setSelectedLevel(null);
  };

  const handleSelectQuest = (quest: Quest) => {
    setSelectedQuest(quest);
  };

  const handleBackToQuests = () => {
    setSelectedQuest(null);
    setSelectedLevel(null);
  };

  const handleSelectLevel = (level: DrumLevel) => {
    setSelectedLevel(level);
  };

  const handleCompleteLevel = (levelNumber: number) => {
    if (!completedLevels.includes(levelNumber)) {
      setCompletedLevels([...completedLevels, levelNumber]);
    }
    setSelectedLevel(null);
  };

  const handleBackToList = () => {
    setSelectedLevel(null);
  };

  if (selectedLevel) {
    return (
      <LevelDetail
        level={selectedLevel}
        onCompleteLevel={handleCompleteLevel}
        onBackToList={handleBackToList}
      />
    );
  }

  if (selectedQuest) {
    return (
      <LevelList
        quest={selectedQuest}
        onSelectLevel={handleSelectLevel}
        completedLevels={completedLevels}
        onBackToQuests={handleBackToQuests}
      />
    );
  }

  if (selectedCategory) {
    return (
      <QuestList
        category={selectedCategory}
        onSelectQuest={handleSelectQuest}
        onBackToCategories={handleBackToCategories}
      />
    );
  }

  return <CategoryList onSelectCategory={handleSelectCategory} />;
}
