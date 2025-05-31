import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatTimer } from '../../lib/utils';
import { Progress } from '../ui/progress';

interface CountdownTimerProps {
  startTime: string;
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  startTime, 
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(100);
  
  useEffect(() => {
    const targetDate = new Date(startTime).getTime();
    const now = new Date().getTime();
    const initialTimeLeft = Math.max(0, Math.floor((targetDate - now) / 1000));
    const totalDuration = initialTimeLeft;
    
    setTimeLeft(initialTimeLeft);
    
    if (initialTimeLeft <= 0) {
      onComplete();
      return;
    }
    
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        
        const newTime = prevTime - 1;
        setPercentage((newTime / totalDuration) * 100);
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, onComplete]);
  
  const formattedTime = formatTimer(timeLeft);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-2">
        <motion.h2 
          className="text-2xl font-bold"
          key={timeLeft}
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Event Starting In
        </motion.h2>
      </div>
      
      <motion.div
        className="text-center mb-6 text-4xl font-bold text-primary-600"
        key={formattedTime}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {formattedTime}
      </motion.div>
      
      <Progress value={percentage} className="h-3" />
      
      <p className="text-center mt-4 text-muted-foreground">
        Get ready! The quiz will start automatically.
      </p>
    </div>
  );
};

export default CountdownTimer;