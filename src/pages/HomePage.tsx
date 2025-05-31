import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Trophy, Medal, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import EventCard from '../components/quiz/EventCard';
import { getUpcomingEvents, getActiveEvents } from '../lib/appwrite';

const HomePage: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcoming = await getUpcomingEvents(3);
        const active = await getActiveEvents(3);
        
        setUpcomingEvents(upcoming.documents);
        setActiveEvents(active.documents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 transform -skew-y-1"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Challenge Your Knowledge with Live Quizzes
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Join interactive quiz events, compete in real-time, and track your progress with our gamified quiz platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/events">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-white/90">
                    Browse Events <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            QuizMaster provides a fun and engaging way to test your knowledge, compete with others, and track your progress.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-card p-6 rounded-xl shadow-sm text-center"
          >
            <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Join Quiz Events</h3>
            <p className="text-muted-foreground">
              Browse upcoming quiz events and register to participate in real-time competitions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white dark:bg-card p-6 rounded-xl shadow-sm text-center"
          >
            <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Compete Live</h3>
            <p className="text-muted-foreground">
              Answer questions within time limits and see real-time leaderboard updates.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white dark:bg-card p-6 rounded-xl shadow-sm text-center"
          >
            <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Medal className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Earn XP & Badges</h3>
            <p className="text-muted-foreground">
              Gain experience points and unlock achievement badges as you participate and win.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white dark:bg-card p-6 rounded-xl shadow-sm text-center"
          >
            <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              View your quiz history, performance analytics, and compare with other participants.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Events Section */}
      <section className="bg-gray-50 dark:bg-background/80 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Register for these exciting quiz events and test your knowledge against others.
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading events...</p>
            </div>
          ) : (
            <>
              {activeEvents.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-6 text-center md:text-left">Live Now</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeEvents.map(event => (
                      <EventCard
                        key={event.$id}
                        id={event.$id}
                        title={event.title}
                        description={event.description}
                        startTime={event.startTime}
                        endTime={event.endTime}
                        imageUrl={event.imageUrl}
                        participantCount={event.participantCount || Math.floor(Math.random() * 50) + 10}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {upcomingEvents.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center md:text-left">Coming Soon</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map(event => (
                      <EventCard
                        key={event.$id}
                        id={event.$id}
                        title={event.title}
                        description={event.description}
                        startTime={event.startTime}
                        endTime={event.endTime}
                        imageUrl={event.imageUrl}
                        participantCount={event.participantCount || Math.floor(Math.random() * 30)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming events scheduled. Check back soon!</p>
                </div>
              )}
              
              <div className="text-center mt-12">
                <Link to="/events">
                  <Button size="lg">
                    View All Events <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Test Your Knowledge?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join our community of quiz enthusiasts and challenge yourself today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/sign-up">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-white/90">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Browse Events
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;