
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PianoHero } from '../piano/piano-hero';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { harmonyPatterns, availableKeys, generateProgressionInKey, type Progression } from '@/lib/music-theory';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../ui/button';

export function PatternsWorkspace() {
  const [selectedPatternName, setSelectedPatternName] = useState(harmonyPatterns[0].name);
  const [selectedKey, setSelectedKey] = useState('C');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProgression, setModalProgression] = useState<Progression[]>([]);
  const [modalTitle, setModalTitle] = useState('');


  const selectedPattern = useMemo(() => {
    return harmonyPatterns.find(p => p.name === selectedPatternName) || harmonyPatterns[0];
  }, [selectedPatternName]);

  const handleExampleClick = (key: string, song: string, artist: string) => {
    if (availableKeys.includes(key)) {
      const progression = generateProgressionInKey(selectedPattern.numerals, key);
      setModalProgression(progression);
      setModalTitle(`${song} by ${artist} (Key of ${key})`);
      setIsModalOpen(true);
    } else {
      console.warn(`Key "${key}" is not available for selection.`);
    }
  };

  const handlePreviewClick = () => {
    const progression = generateProgressionInKey(selectedPattern.numerals, selectedKey);
    setModalProgression(progression);
    setModalTitle(`${selectedPattern.name} in ${selectedKey}`);
    setIsModalOpen(true);
  }

  return (
    <div className="w-full p-4 md:p-8 grid grid-cols-1 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-center text-4xl">music patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            this is where we can going to explore core patterns in music and see how we can apply them to many areas to get the most "bang for buck"
          </p>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{modalTitle}</DialogTitle>
          </DialogHeader>
          {modalProgression.length > 0 && <PianoHero progression={modalProgression} />}
        </DialogContent>
        <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">harmony patterns</CardTitle>
              <CardDescription>Select a progression and a key, then click preview to see it in action.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="pattern-select">Progression</Label>
                  <Select onValueChange={setSelectedPatternName} defaultValue={selectedPatternName} id="pattern-select">
                    <SelectTrigger>
                      <SelectValue placeholder="select a harmony pattern..." />
                    </SelectTrigger>
                    <SelectContent>
                      {harmonyPatterns.map((pattern) => (
                        <SelectItem key={pattern.name} value={pattern.name}>
                          {pattern.name} ({pattern.numerals.join(' - ')})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="key-select">Key</Label>
                  <Select onValueChange={setSelectedKey} value={selectedKey} id="key-select">
                    <SelectTrigger>
                      <SelectValue placeholder="select a key..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableKeys.map((key) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handlePreviewClick}>Preview Progression</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">example songs</CardTitle>
              <CardDescription>
                This progression is used in countless hits. Click a song to see it in action in its original key.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>song</TableHead>
                    <TableHead>artist</TableHead>
                    <TableHead>key</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPattern.examples.map((example) => (
                    <TableRow key={example.song} onClick={() => handleExampleClick(example.key, example.song, example.artist)} className="cursor-pointer">
                      <TableCell className="font-medium">{example.song}</TableCell>
                      <TableCell>{example.artist}</TableCell>
                      <TableCell>{example.key}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Dialog>
    </div>
  );
}
