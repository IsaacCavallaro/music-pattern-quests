'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MusicPatternQuestsWorkspace } from '@/components/music-pattern-quests/music-pattern-quests-workspace';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LevelsWorkspace } from '@/components/music-pattern-quests/levels-workspace';
import { HomeWorkspace } from '@/components/music-pattern-quests/home-workspace';
import { PatternsWorkspace } from '@/components/music-pattern-quests/patterns-workspace';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="sticky top-0 z-50 flex justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-5">
            <TabsList>
              <TabsTrigger value="home">home</TabsTrigger>
              <TabsTrigger value="quests">quests</TabsTrigger>
              <TabsTrigger value="patterns">patterns</TabsTrigger>
              <TabsTrigger value="workspace">workspace</TabsTrigger>
            </TabsList>
            <div className="absolute right-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    help
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Need help with sound?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sound not working or being odd? Try using this website from a desktop (not a mobile device).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>got it</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <TabsContent value="home">
            <HomeWorkspace onTabChange={setActiveTab} />
          </TabsContent>
          <TabsContent value="quests">
            <LevelsWorkspace />
          </TabsContent>
          <TabsContent value="patterns">
            <PatternsWorkspace />
          </TabsContent>
          <TabsContent value="workspace">
            <MusicPatternQuestsWorkspace />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-background/95">
        <div className="flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row px-4">
        </div>
      </footer>
    </div>
  );
}