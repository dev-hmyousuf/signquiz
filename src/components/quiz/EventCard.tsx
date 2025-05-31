import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock } from 'lucide-react';
import { formatDate, timeAgo } from '../../lib/utils';
import { Button } from '../ui/button';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  imageUrl?: string;
  participantCount?: number;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  startTime,
  endTime,
  imageUrl = 'https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  participantCount = 0
}) => {
  const isActive = new Date(startTime) <= new Date() && new Date(endTime) >= new Date();
  const isUpcoming = new Date(startTime) > new Date();
  const isPast = new Date(endTime) < new Date();
  
  const startDate = new Date(startTime);
  const now = new Date();
  const diffMs = startDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  let statusComponent;
  
  if (isActive) {
    statusComponent = (
      <div className="absolute top-4 right-4 badge badge-primary">Live Now</div>
    );
  } else if (isUpcoming) {
    let timeDisplay = '';
    if (diffDays > 0) {
      timeDisplay = `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      timeDisplay = `${diffHours}h ${diffMins}m`;
    } else {
      timeDisplay = `${diffMins}m`;
    }
    
    statusComponent = (
      <div className="absolute top-4 right-4 badge badge-secondary">
        Starts in {timeDisplay}
      </div>
    );
  } else if (isPast) {
    statusComponent = (
      <div className="absolute top-4 right-4 badge bg-gray-100 text-gray-600">
        Ended {timeAgo(endTime)}
      </div>
    );
  }
  
  return (
    <motion.div
      className="quiz-card overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {statusComponent}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(startTime)}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{participantCount} participants</span>
          </div>
        </div>
        
        <Link to={`/event/${id}`}>
          <Button className="w-full">
            {isActive ? 'Join Now' : isUpcoming ? 'Register' : 'View Results'}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;