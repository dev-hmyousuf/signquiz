import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/userStore';
import { getUserByUsername } from '../../lib/appwrite';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface LeaderboardEntry {
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  user?: {
    username: string;
    imageUrl?: string;
  };
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  entries, 
  isLoading 
}) => {
  const appwriteUser = useUserStore(state => state.appwriteUser);
  const [leaderboardWithUsers, setLeaderboardWithUsers] = useState<LeaderboardEntry[]>([]);
  
  // Fetch user details for each leaderboard entry
  useEffect(() => {
    const fetchUserDetails = async () => {
      const entriesWithUsers = await Promise.all(
        entries.map(async (entry) => {
          try {
            const user = await getUserByUsername(entry.userId);
            return {
              ...entry,
              user: {
                username: user?.username || 'Unknown User',
                imageUrl: user?.imageUrl || undefined
              }
            };
          } catch (error) {
            console.error("Error fetching user details:", error);
            return entry;
          }
        })
      );
      
      setLeaderboardWithUsers(entriesWithUsers);
    };
    
    if (entries.length > 0) {
      fetchUserDetails();
    }
  }, [entries]);
  
  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
      </div>
    );
  }
  
  if (leaderboardWithUsers.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-muted-foreground">No entries yet. Be the first to complete this quiz!</p>
      </div>
    );
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="w-full overflow-x-auto">
      <motion.table 
        className="w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Rank</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Player</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Score</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground hidden md:table-cell">Correct</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardWithUsers.map((entry, index) => {
            const isCurrentUser = appwriteUser && entry.userId === appwriteUser.$id;
            const username = entry.user?.username || 'User';
            const firstLetter = username.charAt(0).toUpperCase();
            
            return (
              <motion.tr 
                key={entry.userId} 
                className={`border-b ${isCurrentUser ? 'bg-primary-50' : ''}`}
                variants={item}
              >
                <td className="py-3 px-4">
                  {index < 3 ? (
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full text-sm font-semibold text-white bg-primary">
                      {index + 1}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{index + 1}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={entry.user?.imageUrl} />
                      <AvatarFallback>{firstLetter}</AvatarFallback>
                    </Avatar>
                    <span className={isCurrentUser ? 'font-medium text-primary-700' : ''}>{username}</span>
                    {isCurrentUser && <span className="ml-2 text-xs text-primary-600">(You)</span>}
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-medium">{entry.score}%</td>
                <td className="py-3 px-4 text-right hidden md:table-cell">
                  {entry.correctAnswers}/{entry.totalQuestions}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </motion.table>
    </div>
  );
};

export default LeaderboardTable;