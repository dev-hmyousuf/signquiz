import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import CountdownTimer from '../components/quiz/CountdownTimer';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResults from '../components/quiz/QuizResults';
import { formatDate, timeAgo } from '../lib/utils';
import { getEventById, getQuizByEventId, getQuizQuestions } from '../lib/appwrite';
import { useQuizStore } from '../store/quizStore';
import { useUserStore } from '../store/userStore';

const EventDetailPage: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'active' | 'ended'>('upcoming');
  const [quizStarted, setQuizStarted] = useState(false);
  
  const { appwriteUser } = useUserStore();
  const { 
    questions, 
    currentQuestionIndex,
    answers, 
    timeRemaining,
    isFinished,
    setEventId: setQuizEventId,
    loadQuiz,
    startQuiz,
    submitCurrentAnswer,
    nextQuestion
  } = useQuizStore();
  
  useEffect(() => {
    if (!eventId) return;
    
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch event
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        
        // Determine event status
        const now = new Date();
        const startTime = new Date(eventData.startTime);
        const endTime = new Date(eventData.endTime);
        
        if (now < startTime) {
          setEventStatus('upcoming');
        } else if (now >= startTime && now <= endTime) {
          setEventStatus('active');
        } else {
          setEventStatus('ended');
        }
        
        // Fetch quiz
        const quizData = await getQuizByEventId(eventId);
        setQuiz(quizData);
        
        // Set event ID in quiz store
        setQuizEventId(eventId);
        
        // Load quiz questions
        await loadQuiz();
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Failed to load event details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [eventId, setQuizEventId, loadQuiz]);
  
  const handleCountdownComplete = () => {
    setQuizStarted(true);
    startQuiz();
  };
  
  const handleSubmitAnswer = (optionId: string, timeSpent: number) => {
    submitCurrentAnswer(optionId, timeSpent);
    
    // Short delay before moving to next question
    setTimeout(() => {
      nextQuestion();
    }, 500);
  };
  
  const handleTimeUp = () => {
    // If time runs out, automatically move to next question
    nextQuestion();
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading event details...</p>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">{error || "Event not found"}</p>
        <Link to="/events">
          <Button>View All Events</Button>
        </Link>
      </div>
    );
  }
  
  // If the quiz is finished, show results
  if (isFinished) {
    return (
      <div className="container mx-auto px-4 py-12">
        <QuizResults
          questions={questions}
          answers={answers}
          xpEarned={answers.filter(a => a.isCorrect).length * 10 + 50}
          newBadges={answers.filter(a => a.isCorrect).length === questions.length ? ['perfect-score'] : []}
          eventId={eventId!}
        />
      </div>
    );
  }
  
  // If the quiz is active and started, show the current question
  if (eventStatus === 'active' && quizStarted) {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) {
      return (
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Question...</h1>
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        <QuizQuestion
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          questionText={currentQuestion.questionText}
          options={currentQuestion.options}
          timeLimit={currentQuestion.timeLimit}
          onSubmit={handleSubmitAnswer}
          onTimeUp={handleTimeUp}
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Event Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-muted-foreground mb-6">{event.description}</p>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(event.startTime)}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>{event.participantCount || '0'} participants</span>
              </div>
            </div>
          </div>
          
          {/* Event Image */}
          <div className="mb-8 rounded-xl overflow-hidden h-64 md:h-80">
            <img
              src={event.imageUrl || 'https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Event Status */}
          <div className="bg-white dark:bg-card p-8 rounded-xl shadow-sm mb-8">
            {eventStatus === 'upcoming' && (
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-6">Event Starting Soon</h2>
                <CountdownTimer 
                  startTime={event.startTime} 
                  onComplete={handleCountdownComplete}
                />
                <div className="mt-8">
                  <Button size="lg" onClick={() => handleCountdownComplete()}>
                    Start Practice Quiz Now
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    For testing purposes, you can start the quiz immediately
                  </p>
                </div>
              </div>
            )}
            
            {eventStatus === 'active' && !quizStarted && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">This Event is Live!</h2>
                <p className="text-muted-foreground mb-6">
                  The quiz is active and waiting for you to join.
                </p>
                <Button size="lg" onClick={() => setQuizStarted(true)}>
                  Join Quiz Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            
            {eventStatus === 'ended' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Event Ended</h2>
                <p className="text-muted-foreground mb-6">
                  This event ended {timeAgo(event.endTime)}. Check out the results or find other events.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to={`/event/${eventId}/leaderboard`}>
                    <Button>
                      View Leaderboard
                    </Button>
                  </Link>
                  <Link to="/events">
                    <Button variant="outline">
                      Find More Events
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Quiz Details */}
          {quiz && (
            <div className="bg-white dark:bg-card p-8 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Quiz Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Title</h3>
                  <p>{quiz.title}</p>
                </div>
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p>{quiz.description}</p>
                </div>
                <div>
                  <h3 className="font-medium">Time Limit</h3>
                  <p>{quiz.timeLimit} minutes</p>
                </div>
                <div>
                  <h3 className="font-medium">Questions</h3>
                  <p>{questions.length} questions</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetailPage;