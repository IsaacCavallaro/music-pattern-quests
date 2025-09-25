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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { harmonyPatterns, availableKeys, generateProgressionInKey, type Progression } from '@/lib/music-theory';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '../ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Input } from '../ui/input';

type SortConfig = {
  key: keyof typeof harmonyPatterns[0]['examples'][0];
  direction: 'ascending' | 'descending';
};

export function PatternsWorkspace() {
  const [selectedPatternName, setSelectedPatternName] = useState(harmonyPatterns[0].name);
  const [selectedKey, setSelectedKey] = useState('C');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProgression, setModalProgression] = useState<Progression[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTempo, setModalTempo] = useState(120);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'key', direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');

  const selectedPattern = useMemo(() => {
    return harmonyPatterns.find(p => p.name === selectedPatternName) || harmonyPatterns[0];
  }, [selectedPatternName]);

  const sortedExamples = useMemo(() => {
    let sortableItems = [...(selectedPattern?.examples || [])];
    if (sortConfig !== null && sortConfig !== undefined) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal == null || bVal == null) return 0;

        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [selectedPattern?.examples, sortConfig]);

  const filteredExamples = useMemo(() => {
    if (!searchQuery) {
      return sortedExamples;
    }
    return sortedExamples.filter(example =>
      example.song.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedExamples, searchQuery]);

  const requestSort = (key: keyof typeof harmonyPatterns[0]['examples'][0]) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleExampleClick = (key: string, song: string, artist: string, tempo: number, durationMultiplier?: number) => {
    if (availableKeys.includes(key)) {
      const progression = generateProgressionInKey(selectedPattern.numerals, key, durationMultiplier);
      setModalProgression(progression);
      setModalTitle(`${song} by ${artist} (Key of ${key})`);
      setModalTempo(tempo);
      setIsModalOpen(true);
    } else {
      console.warn(`Key "${key}" is not available for selection.`);
    }
  };

  const handlePreviewClick = () => {
    const progression = generateProgressionInKey(selectedPattern.numerals, selectedKey);
    setModalProgression(progression);
    setModalTitle(`${selectedPattern.name} in ${selectedKey}`);
    setModalTempo(120); // Default tempo for preview
    setIsModalOpen(true);
  }

  const getSortIndicator = (name: keyof typeof harmonyPatterns[0]['examples'][0]) => {
    if (!sortConfig || sortConfig.key !== name) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-50" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="w-full p-4 md:p-8 grid grid-cols-1 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-center text-4xl">music patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            this is where we can go to explore core patterns in music and see how we can apply them to many areas to get the most "bang for buck"
          </p>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-headline">{modalTitle}</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {modalProgression.length > 0 && <PianoHero progression={modalProgression} />}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-8 max-w-7xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">How to Use This Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><strong>1. Select a Progression:</strong> Choose a common chord progression from the first dropdown.</p>
            <p><strong>2. Choose a Key:</strong> Use the second dropdown to select a musical key. The chord names in the table below will update to reflect the chords in that key.</p>
            <p><strong>3. Preview the Progression:</strong> Click the "Preview Progression" button to open an interactive piano player and hear how the progression sounds in the key you selected.</p>
            <p><strong>4. Explore Real Songs:</strong> The table below shows popular songs that use the selected progression. Click on any song to hear the pattern in its original key and tempo.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">harmony patterns</CardTitle>
            <CardDescription>Select a progression and a key, then click preview to see it in action.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="pattern-select">Progression</Label>
                <Select onValueChange={setSelectedPatternName} defaultValue={selectedPatternName}>
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
                <Select onValueChange={setSelectedKey} value={selectedKey}>
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
            <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-center">
              <p className="text-yellow-800 text-xs sm:text-sm">
                This is still a WIP so bare with me as I build it.
              </p>
            </div>
            <CardTitle className="font-headline">example songs</CardTitle>
            <CardDescription>
              This progression is used in countless hits. Click a song to see it in action in its original key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="search for a song..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>song</TableHead>
                  <TableHead>artist</TableHead>
                  <TableHead className="cursor-pointer group" onClick={() => requestSort('key')}>
                    <div className="flex items-center">
                      key
                      {getSortIndicator('key')}
                    </div>
                  </TableHead>
                  <TableHead>tempo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExamples.map((example) => (
                  <TableRow
                    key={example.song}
                    onClick={() =>
                      handleExampleClick(
                        example.key,
                        example.song,
                        example.artist,
                        example.tempo,
                        example.durationMultiplier
                      )
                    }
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{example.song}</TableCell>
                    <TableCell>{example.artist}</TableCell>
                    <TableCell>{example.key}</TableCell>
                    <TableCell>{example.tempo} bpm</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
