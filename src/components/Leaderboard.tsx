
import React, { useEffect, useState } from 'react';
import { getTopPurchases } from '@/services/exhibitService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  size: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    // Fetch top purchases
    const topPurchases = getTopPurchases(10);
    setLeaderboard(topPurchases.map(p => ({
      username: p.username,
      size: p.size
    })));
  }, []);
  
  return (
    <Card className="bg-hero-secondary border-hero-accent/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length > 0 ? (
          <ul className="space-y-2">
            {leaderboard.map((entry, index) => (
              <li key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className={`w-5 text-center font-bold ${index < 3 ? 'text-hero-accent' : 'text-muted-foreground'}`}>
                    {index + 1}.
                  </span>
                  <span className="ml-2">@{entry.username}</span>
                </div>
                <span className="font-semibold">{entry.size}m</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-2 text-sm text-muted-foreground">
            No purchases yet. Be the first!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
