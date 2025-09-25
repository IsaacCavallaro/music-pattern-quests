'use client';

import { useState, useEffect } from 'react';
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
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    // Show welcome dialog every time the page loads with a small delay
    const timer = setTimeout(() => {
      setShowWelcomeDialog(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="flex flex-col min-h-screen">
      {/* Welcome Dialog */}
      <AlertDialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to Music Pattern Quests!</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>This is currently just a fun side project and a work in progress. Have a play around but we're still tinkering with this! Also, the audio may not work on mobile so try on your desktop.</p>
                <p>
                  Want to contribute or raise an issue? Head to the repository:{" "}
                  <a
                    href="https://github.com/IsaacCavallaro/music-pattern-quests"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    github.com/IsaacCavallaro/music-pattern-quests
                  </a>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Let's explore!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="sticky top-0 z-50 flex justify-between items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 gap-4">
            {/* Mobile-first responsive approach */}
            <div className="flex-1 flex justify-center min-w-0">
              <TabsList className="flex-1 max-w-md justify-center">
                <TabsTrigger value="home" className="flex-1 min-w-0 px-2 text-xs sm:text-sm">home</TabsTrigger>
                <TabsTrigger value="quests" className="flex-1 min-w-0 px-2 text-xs sm:text-sm">quests</TabsTrigger>
                <TabsTrigger value="patterns" className="flex-1 min-w-0 px-2 text-xs sm:text-sm">patterns</TabsTrigger>
                <TabsTrigger value="workspace" className="flex-1 min-w-0 px-2 text-xs sm:text-sm">workspace</TabsTrigger>
              </TabsList>
            </div>
            {/* Help button positioned relatively with proper spacing */}
            <div className="flex-shrink-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="whitespace-nowrap text-xs sm:text-sm">
                    help
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Need help with sound?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-4">
                        <p>Sound not working or being odd? Try using this website from a desktop (not a mobile device).</p>
                        <p className="pt-2">
                          Want to contribute or raise an issue? Head to the repository:{" "}
                          <a
                            href="https://github.com/IsaacCavallaro/music-pattern-quests"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline font-medium"
                          >
                            github.com/IsaacCavallaro/music-pattern-quests
                          </a>
                        </p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>got it</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Mobile warning banner */}
          <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-center">
            <p className="text-yellow-800 text-xs sm:text-sm">
              Audio may not work on mobile devices. For best experience, use a desktop device.
            </p>
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