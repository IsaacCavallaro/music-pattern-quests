'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PatternsWorkspace() {
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
    </div>
  );
}
