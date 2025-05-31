import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { formatTimer } from '../../lib/utils';

interface Option {
  id: string;
  text: string;
}

interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: Option[];
  timeLimit: number;
  onSubmit: (optionId: string, timeSpent: number) => void;
  onTimeUp: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  timeLimit,
  onSubmit,
  onTimeUp
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
      
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLimit, onTimeUp]);
  
  const handleOptionSelect = (optionId: string) => {
    if (isSubmitting) return;
    setSelectedOption(optionId);
  };
  
  const handleSubmit = () => {
    if (!selectedOption || isSubmitting) return;
    
    setIsSubmitting(true);
    onSubmit(selectedOption, timeSpent);
  };
  
  const progressPercentage = (timeRemaining / timeLimit) * 100;
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="flex items-center">
          <div className="text-sm font-medium mr-2">
            {formatTimer(timeRemaining)}
          </div>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="mb-6" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-2">{questionText}</h2>
      </motion.div>
      
      <AnimatePresence>
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          {options.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`quiz-answer ${selectedOption === option.id ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex-1">{option.text}</div>
                {selectedOption === option.id && (
                  <div className="h-5 w-5 rounded-full bg-primary ml-2"></div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      <motion.div 
        className="mt-8 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button 
          onClick={handleSubmit}
          disabled={!selectedOption || isSubmitting}
        >
          Submit Answer
        </Button>
      </motion.div>
    </div>
  );
};

export default QuizQuestion;