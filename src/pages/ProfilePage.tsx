import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import UserProfile from '../components/profile/UserProfile';
import { getUserByUsername } from '../lib/appwrite';
import { useUserStore } from '../store/userStore';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const { user: clerkUser } = useUser();
  const { appwriteUser } = useUserStore();
  
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (username) {
          // Viewing someone else's profile
          const user = await getUserByUsername(username);
          if (user) {
            setProfileUser(user);
          } else {
            setError("User not found");
          }
        } else if (appwriteUser) {
          // Viewing own profile
          setProfileUser(appwriteUser);
        } else {
          setError("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [username, appwriteUser]);
  
  // Mock recent events for demo purposes
  const recentEvents = [
    {
      id: 'event1',
      title: 'Science Quiz Bowl',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      score: 85,
      rank: 3
    },
    {
      id: 'event2',
      title: 'History Trivia Challenge',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      score: 92,
      rank: 1
    },
    {
      id: 'event3',
      title: 'Pop Culture Quiz Night',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      score: 78,
      rank: 5
    }
  ];
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }
  
  if (error || !profileUser) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">{error || "User not found"}</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <UserProfile 
        user={{
          username: profileUser.username,
          email: profileUser.email,
          xp: profileUser.xp || 0,
          badges: profileUser.badges || [],
          joinedAt: profileUser.joinedAt,
          imageUrl: clerkUser?.imageUrl
        }}
        recentEvents={recentEvents}
      />
    </div>
  );
};

export default ProfilePage;