import React from 'react';
import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';
import { formatDate, getBadgeInfo } from '../../lib/utils';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface UserProfileProps {
  user: {
    username: string;
    email: string;
    xp: number;
    badges: string[];
    joinedAt: string;
    imageUrl?: string;
  };
  recentEvents?: {
    id: string;
    title: string;
    date: string;
    score: number;
    rank: number;
  }[];
}

const UserProfile: React.FC<UserProfileProps> = ({ user, recentEvents = [] }) => {
  // Calculate XP to next level (example: each level requires level * 100 XP)
  const currentLevel = Math.floor(user.xp / 100) + 1;
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = ((user.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div 
        className="bg-white dark:bg-card shadow-sm rounded-xl overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600"></div>
        
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row">
            <div className="-mt-12 mb-4 md:mb-0">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="text-xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center text-sm text-muted-foreground">
                  <CalendarClock className="h-4 w-4 mr-1" />
                  <span>Joined {formatDate(user.joinedAt)}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline">
                    <span className="text-lg font-semibold">Level {currentLevel}</span>
                    <span className="text-sm text-muted-foreground ml-2">{user.xp} XP</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {xpForNextLevel - user.xp} XP to Level {currentLevel + 1}
                  </span>
                </div>
                <Progress value={xpProgress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4">Recent Quiz Activity</h2>
          
          {recentEvents.length === 0 ? (
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm text-center">
              <p className="text-muted-foreground">No quiz activity yet.</p>
              <p className="text-sm mt-2">Join a quiz to see your activity here!</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-card rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Quiz</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-muted-foreground">Date</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-muted-foreground">Score</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event) => (
                    <tr key={event.id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{event.title}</td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">{formatDate(event.date)}</td>
                      <td className="py-3 px-4 text-center font-medium">{event.score}%</td>
                      <td className="py-3 px-4 text-right">
                        {event.rank <= 3 ? (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full text-sm font-semibold text-white bg-primary">
                            {event.rank}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{event.rank}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Badges</h2>
          
          {user.badges.length === 0 ? (
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm text-center">
              <p className="text-muted-foreground">No badges yet.</p>
              <p className="text-sm mt-2">Complete quizzes to earn badges!</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                {user.badges.map(badge => {
                  const badgeInfo = getBadgeInfo(badge);
                  return (
                    <div key={badge} className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                      <div className="text-2xl">{badgeInfo.icon}</div>
                      <div>
                        <div className="font-medium">{badgeInfo.name}</div>
                        <div className="text-xs text-muted-foreground">{badgeInfo.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;