import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import LeaderboardTable from '../components/quiz/LeaderboardTable';
import { getEventById, getEventLeaderboard } from '../lib/appwrite';

const LeaderboardPage: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (eventId) {
          // Fetch event details
          const eventData = await getEventById(eventId);
          setEvent(eventData);
          
          // Fetch leaderboard
          const leaderboardData = await getEventLeaderboard(eventId);
          setLeaderboard(leaderboardData.documents);
        } else {
          // For global leaderboard, we would fetch from a different endpoint
          // For demo purposes, we'll create mock data
          const mockLeaderboard = Array.from({ length: 20 }, (_, i) => ({
            userId: `user${i + 1}`,
            score: Math.floor(Math.random() * 50) + 50,
            correctAnswers: Math.floor(Math.random() * 15) + 5,
            totalQuestions: 20,
            user: {
              username: `Player${i + 1}`
            }
          }));
          
          // Sort by score descending
          mockLeaderboard.sort((a, b) => b.score - a.score);
          
          setLeaderboard(mockLeaderboard);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [eventId]);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {event ? `${event.title} Leaderboard` : 'Global Leaderboard'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {event 
            ? `Check how you ranked against other participants in this event.`
            : `See the top performers across all quiz events on the platform.`
          }
        </p>
      </motion.div>
      
      {!isLoading && leaderboard.length > 0 && (
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
            {[1, 0, 2].map((position, index) => {
              // We display 2nd (index 0), 1st (index 1), 3rd (index 2)
              const entry = leaderboard[position];
              if (!entry) return null;
              
              const placement = position + 1;
              const medalColors = {
                1: 'bg-amber-500',
                2: 'bg-gray-300',
                3: 'bg-amber-700'
              };
              
              const medalColor = medalColors[placement as keyof typeof medalColors];
              
              return (
                <motion.div
                  key={placement}
                  className={`text-center ${index === 1 ? 'order-first md:order-none' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <div className={`relative mx-auto mb-4 ${index === 1 ? 'h-24 w-24' : 'h-20 w-20'}`}>
                    <div className={`absolute inset-0 rounded-full ${medalColor} flex items-center justify-center`}>
                      <Trophy className={`${index === 1 ? 'h-12 w-12' : 'h-10 w-10'} text-white`} />
                    </div>
                    <div className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="font-bold">{placement}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg">{entry.user?.username || entry.userId}</h3>
                  <p className="text-2xl font-bold text-primary-600">{entry.score}%</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.correctAnswers}/{entry.totalQuestions} correct
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Full Rankings</h2>
        </div>
        
        <LeaderboardTable entries={leaderboard} isLoading={isLoading} />
      </div>
      
      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;