import { create } from 'zustand';
import { 
  getQuizByEventId, 
  getQuizQuestions, 
  submitAnswer, 
  updateLeaderboard 
} from '../lib/appwrite';
import { useUserStore } from './userStore';
import { calculateXP } from '../lib/utils';

interface Question {
  $id: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  timeLimit: number;
  order: number;
}

interface Answer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface QuizState {
  eventId: string | null;
  quizId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  timeRemaining: number;
  isLoading: boolean;
  isFinished: boolean;
  error: string | null;
  
  setEventId: (eventId: string) => void;
  loadQuiz: () => Promise<boolean>;
  startQuiz: () => void;
  submitCurrentAnswer: (answerId: string, timeSpent: number) => Promise<void>;
  nextQuestion: () => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  eventId: null,
  quizId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 0,
  isLoading: false,
  isFinished: false,
  error: null,
  
  setEventId: (eventId) => {
    set({ eventId, quizId: null, questions: [], answers: [], isFinished: false });
  },
  
  loadQuiz: async () => {
    const { eventId } = get();
    if (!eventId) return false;
    
    try {
      set({ isLoading: true, error: null });
      
      const quiz = await getQuizByEventId(eventId);
      if (!quiz) {
        set({ error: "Quiz not found", isLoading: false });
        return false;
      }
      
      const questionsResult = await getQuizQuestions(quiz.$id);
      
      set({ 
        quizId: quiz.$id, 
        questions: questionsResult.documents as Question[],
        isLoading: false,
        currentQuestionIndex: 0,
        answers: []
      });
      
      return true;
    } catch (error) {
      console.error("Error loading quiz:", error);
      set({ error: "Failed to load quiz", isLoading: false });
      return false;
    }
  },
  
  startQuiz: () => {
    const { questions, currentQuestionIndex } = get();
    if (questions.length === 0) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    set({ timeRemaining: currentQuestion.timeLimit });
  },
  
  submitCurrentAnswer: async (answerId, timeSpent) => {
    const { 
      questions, 
      currentQuestionIndex, 
      answers, 
      quizId 
    } = get();
    
    if (!quizId || currentQuestionIndex >= questions.length) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctOptionId === answerId;
    
    try {
      const appwriteUser = useUserStore.getState().appwriteUser;
      if (!appwriteUser) throw new Error("User not authenticated");
      
      // Submit to Appwrite
      await submitAnswer(
        appwriteUser.$id,
        currentQuestion.$id,
        answerId,
        timeSpent
      );
      
      // Update local state
      const newAnswer = {
        questionId: currentQuestion.$id,
        answerId,
        isCorrect,
        timeSpent
      };
      
      set({ answers: [...answers, newAnswer] });
    } catch (error) {
      console.error("Error submitting answer:", error);
      set({ error: "Failed to submit answer" });
    }
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex >= questions.length - 1) {
      // Last question, finish quiz
      get().finishQuiz();
      return;
    }
    
    const nextIndex = currentQuestionIndex + 1;
    const nextQuestion = questions[nextIndex];
    
    set({ 
      currentQuestionIndex: nextIndex,
      timeRemaining: nextQuestion.timeLimit
    });
  },
  
  finishQuiz: async () => {
    const { eventId, answers, questions } = get();
    if (!eventId) return;
    
    try {
      const appwriteUser = useUserStore.getState().appwriteUser;
      if (!appwriteUser) throw new Error("User not authenticated");
      
      // Calculate score
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const totalQuestions = questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      
      // Update leaderboard
      await updateLeaderboard(
        eventId,
        appwriteUser.$id,
        score,
        correctAnswers,
        totalQuestions
      );
      
      // Add XP to user
      const xpEarned = calculateXP(answers);
      await useUserStore.getState().addXP(xpEarned);
      
      // Check for perfect score badge
      if (correctAnswers === totalQuestions && totalQuestions > 0) {
        await useUserStore.getState().addBadge('perfect-score');
      }
      
      set({ isFinished: true });
    } catch (error) {
      console.error("Error finishing quiz:", error);
      set({ error: "Failed to finish quiz" });
    }
  },
  
  resetQuiz: () => {
    set({
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: 0,
      isFinished: false,
      error: null
    });
  }
}));