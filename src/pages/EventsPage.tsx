import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Search } from 'lucide-react';
import EventCard from '../components/quiz/EventCard';
import { getUpcomingEvents, getActiveEvents } from '../lib/appwrite';

const EventsPage: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        const upcoming = await getUpcomingEvents(10);
        const active = await getActiveEvents(10);
        
        // For demo purposes, we'll create some past events
        const mockPastEvents = [
          {
            $id: 'past1',
            title: 'History Trivia Challenge',
            description: 'Test your knowledge of world history in this challenging quiz.',
            startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            imageUrl: 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            participantCount: 78
          },
          {
            $id: 'past2',
            title: 'Science Quiz Bowl',
            description: 'From physics to biology, test your science knowledge.',
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            imageUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            participantCount: 92
          },
          {
            $id: 'past3',
            title: 'Movie Buffs Quiz Night',
            description: 'How well do you know your movies? Find out in this cinematic challenge.',
            startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            participantCount: 64
          }
        ];
        
        setUpcomingEvents(upcoming.documents);
        setActiveEvents(active.documents);
        setPastEvents(mockPastEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const filterEvents = (events: any[]) => {
    if (!searchTerm) return events;
    
    const term = searchTerm.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(term) || 
      event.description.toLowerCase().includes(term)
    );
  };
  
  const filteredActiveEvents = filterEvents(activeEvents);
  const filteredUpcomingEvents = filterEvents(upcomingEvents);
  const filteredPastEvents = filterEvents(pastEvents);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Quiz Events</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Browse all upcoming and active quiz events. Register to participate and compete with others in real-time.
        </p>
        
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </motion.div>
      
      {isLoading ? (
        <div className="text-center py-20">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading events...</p>
        </div>
      ) : (
        <div>
          {filteredActiveEvents.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <div className="h-4 w-4 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Now
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActiveEvents.map(event => (
                  <EventCard
                    key={event.$id}
                    id={event.$id}
                    title={event.title}
                    description={event.description}
                    startTime={event.startTime}
                    endTime={event.endTime}
                    imageUrl={event.imageUrl}
                    participantCount={event.participantCount || Math.floor(Math.random() * 50) + 20}
                  />
                ))}
              </div>
            </div>
          )}
          
          {filteredUpcomingEvents.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-primary" />
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcomingEvents.map(event => (
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
          )}
          
          {filteredPastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPastEvents.map(event => (
                  <EventCard
                    key={event.$id}
                    id={event.$id}
                    title={event.title}
                    description={event.description}
                    startTime={event.startTime}
                    endTime={event.endTime}
                    imageUrl={event.imageUrl}
                    participantCount={event.participantCount}
                  />
                ))}
              </div>
            </div>
          )}
          
          {filteredActiveEvents.length === 0 && filteredUpcomingEvents.length === 0 && filteredPastEvents.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-card rounded-xl shadow-sm">
              <p className="text-muted-foreground mb-2">No events found matching "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;