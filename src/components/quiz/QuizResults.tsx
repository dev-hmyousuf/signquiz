import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, Award, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { getBadgeInfo } from '../../lib/utils';

interface Answer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface Question {
  $id: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

interface QuizResultsProps {
  questions: Question[];
  answers: Answer[];
  xpEarned: number;
  newBadges: string[];
  eventId: string;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  answers,
  xpEarned,
  newBadges,
  eventId
}) => {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const totalQuestions = questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
        <p className="text-muted-foreground">Here's how you did:</p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="bg-white dark:bg-card p-6 rounded-lg shadow-sm text-center">
          <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
          <div className="text-sm text-muted-foreground">Overall Score</div>
        </motion.div>
        
        <motion.div variants={item} className="bg-white dark:bg-card p-6 rounded-lg shadow-sm text-center">
          <div className="text-4xl font-bold text-green-500 mb-2">{correctAnswers}</div>
          <div className="text-sm text-muted-foreground">Correct Answers</div>
        </motion.div>
        
        <motion.div variants={item} className="bg-white dark:bg-card p-6 rounded-lg shadow-sm text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">+{xpEarned}</div>
          <div className="text-sm text-muted-foreground">XP Earned</div>
        </motion.div>
      </motion.div>
      
      {newBadges.length > 0 && (
        <motion.div
          className="mb-8 bg-primary-50 p-6 rounded-lg border border-primary-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Award className="mr-2 text-primary-600" /> New Badges Earned!
          </h2>
          
          <div className="flex flex-wrap gap-4">
            {newBadges.map(badge => {
              const badgeInfo = getBadgeInfo(badge);
              return (
                <div key={badge} className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-2xl">{badgeInfo.icon}</div>
                  <div>
                    <div className="font-medium">{badgeInfo.name}</div>
                    <div className="text-xs text-muted-foreground">{badgeInfo.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">Question Breakdown</h2>
        
        <div className="space-y-4">
          {questions.map((question, index) => {
            const answer = answers.find(a => a.questionId === question.$id);
            const isCorrect = answer?.isCorrect ?? false;
            
            return (
              <div key={question.$id} className="bg-white dark:bg-card p-4 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Question {index + 1}: {question.questionText}</h3>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      {answer ? (
                        <>Your answer: {question.options.find(o => o.id === answer.answerId)?.text || 'Unknown'}</>
                      ) : (
                        <>No answer provided</>
                      )}
                    </div>
                    
                    <div className="text-sm text-green-600">
                      Correct answer: {question.options.find(o => o.id === question.correctOptionId)?.text || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row justify-between gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link to={`/event/${eventId}/leaderboard`}>
          <Button variant="outline" className="w-full sm:w-auto">
            View Leaderboard
          </Button>
        </Link>
        
        <Link to="/events">
          <Button className="w-full sm:w-auto">
            Find More Quizzes <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default QuizResults;