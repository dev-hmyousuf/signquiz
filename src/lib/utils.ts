import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd, yyyy");
}

export function timeAgo(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function generateUsername(email: string): string {
  const username = email.split("@")[0];
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${username}${randomSuffix}`;
}

export function calculateXP(answers: any[]): number {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  return (correctAnswers * 10) + 50; // 10 XP per correct answer + 50 XP for finishing
}

export function getBadgeInfo(badgeId: string) {
  const badges = {
    "quiz-master": {
      icon: "🧠",
      name: "Quiz Master",
      description: "Achieved top 10 rank in 5+ events"
    },
    "speedster": {
      icon: "🐇",
      name: "Speedster",
      description: "Average answer time under 5 seconds"
    },
    "streaker": {
      icon: "📈",
      name: "Streaker",
      description: "Played 3 events in a row"
    },
    "perfect-score": {
      icon: "🔥",
      name: "Perfect Score",
      description: "100% correct answers in a quiz"
    },
    "first-quiz": {
      icon: "🎯",
      name: "First Quiz",
      description: "Completed your first quiz"
    }
  };
  
  return badges[badgeId as keyof typeof badges] || {
    icon: "🏆",
    name: badgeId,
    description: "Special achievement"
  };
}