import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HomeWorkspaceProps {
  onTabChange: (tab: string) => void;
}

export function HomeWorkspace({ onTabChange }: HomeWorkspaceProps) {
  return (
    <div className="w-full p-4 md:p-8 grid grid-cols-1 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-center text-4xl">welcome to music pattern quests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            a place to study & experiment with music patterns
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-center">how to use this site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            1. <strong>start with the quests:</strong> if you're new to music theory, the quests tab is the perfect place to start. select a category to begin your first quest.
          </p>
          <p>
            2. <strong>study the patterns:</strong> once you've completed your quests head over to the patterns tab. here you can study some common patterns at your own pace. this will help you gain confidence to create your own beats and melodies.
          </p>
          <p>
            3. <strong>explore the workspace:</strong> this is where you can experiement making your own music. you can use the examples dropdown to get started with some pre-made patterns.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onTabChange('quests')}
        >
          <CardHeader>
            <CardTitle className="font-headline">quests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              embark on a journey through our structured learning paths. the quests tab contains a series of interactive levels designed to teach you the fundamentals of rhythm, melody, and harmony. each quest builds on the last, helping you master musical concepts one step at a time.
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onTabChange('patterns')}
        >
          <CardHeader>
            <CardTitle className="font-headline">patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              explore core patterns in music and see how we can apply them to many areas to get the most "bang for buck"
            </p>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onTabChange('workspace')}
        >
          <CardHeader>
            <CardTitle className="font-headline">workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              the workspace is your creative canvas. here, you can write and edit musical patterns using abc notation, a simple text-based music notation system. see your notation come to life in real-time as sheet music and hear it played back. experiment with different drum beats, melodies, and harmonies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
